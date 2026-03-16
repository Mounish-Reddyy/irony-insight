import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, History, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ResultDashboard, { type AnalysisResult } from "@/components/ResultDashboard";
import HistoryPanel from "@/components/HistoryPanel";
import ExampleChips from "@/components/ExampleChips";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { toast } = useToast();

  const analyze = useCallback(async (inputText?: string) => {
    const analyzeText = inputText ?? text;
    if (!analyzeText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-text", {
        body: { text: analyzeText },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const analysisResult: AnalysisResult = {
        ...data,
        text: analyzeText,
        timestamp: Date.now(),
      };

      setResult(analysisResult);
      setHistory((prev) => [analysisResult, ...prev].slice(0, 50));
    } catch (err: any) {
      toast({
        title: "Analysis failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, toast]);

  const handleExampleSelect = (exampleText: string) => {
    setText(exampleText);
    analyze(exampleText);
  };

  const handleDownload = (item: AnalysisResult) => {
    const report = {
      text: item.text,
      sentiment: item.sentiment,
      sentimentScore: item.sentimentScore,
      sarcasmProbability: item.sarcasmProbability,
      isSarcastic: item.sarcasmProbability > 50,
      explanation: item.explanation,
      analyzedAt: new Date(item.timestamp).toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sarcasm-analysis-${item.timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Loading bar */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: 0.7 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 2, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-[1024px] mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Linguistic Intent Analysis
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground mt-2 max-w-[65ch]">
              Quantify sentiment and sarcasm probability with precision NLP modeling.
            </p>
          </div>
          <button
            onClick={() => setHistoryOpen(true)}
            className="relative p-3 rounded-xl hover:bg-muted transition-colors"
          >
            <History className="w-5 h-5 text-muted-foreground" />
            {history.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {/* Input Area */}
        <div className="bg-card rounded-2xl shadow-card mb-6 overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze for sentiment and sarcasm…"
            className="w-full min-h-[200px] p-6 bg-transparent text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none text-base leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                analyze();
              }
            }}
          />
          <div className="flex items-center justify-between px-6 pb-4">
            <span className="text-xs text-muted-foreground font-mono tabular-nums">
              {text.length} characters
            </span>
            <button
              onClick={() => analyze()}
              disabled={!text.trim() || isAnalyzing}
              className="inline-flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Example chips */}
        <div className="mb-10">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Sample texts</p>
          <ExampleChips onSelect={handleExampleSelect} />
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isAnalyzing && !result && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`bg-card rounded-2xl p-6 shadow-card animate-pulse ${i === 3 ? "md:col-span-2" : ""}`}
                >
                  <div className="h-4 w-32 bg-muted rounded mb-4" />
                  <div className="h-24 bg-muted rounded" />
                </div>
              ))}
            </motion.div>
          )}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <ResultDashboard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History Panel */}
      <HistoryPanel
        history={history}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={(item) => {
          setResult(item);
          setText(item.text);
          setHistoryOpen(false);
        }}
        onDownload={handleDownload}
      />

      {/* Overlay */}
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/10 z-40"
            onClick={() => setHistoryOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
