import { motion } from "framer-motion";
import SarcasmGauge from "./SarcasmGauge";
import SentimentBar from "./SentimentBar";

export interface AnalysisResult {
  sentiment: "Positive" | "Negative" | "Neutral";
  sentimentScore: number;
  sarcasmProbability: number;
  explanation: string;
  text: string;
  timestamp: number;
}

interface ResultDashboardProps {
  result: AnalysisResult;
}

const easing = [0.2, 0, 0, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easing as unknown as [number, number, number, number],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easing as unknown as [number, number, number, number] },
  },
};

const ResultDashboard = ({ result }: ResultDashboardProps) => {
  const isSarcastic = result.sarcasmProbability > 50;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <motion.div variants={itemVariants} className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Sentiment Analysis</h3>
        <SentimentBar sentiment={result.sentiment} score={result.sentimentScore} />
      </motion.div>

      <motion.div variants={itemVariants} className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Sarcasm Probability</h3>
        <SarcasmGauge probability={result.sarcasmProbability} />
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-2 bg-card rounded-2xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Final Label</h3>
            <p className="text-xl font-semibold text-foreground">
              {isSarcastic ? "🟡 Sarcastic" : "🟢 Not Sarcastic"}
            </p>
          </div>
          <p className="text-sm text-muted-foreground max-w-[45ch] leading-relaxed" style={{ textWrap: "pretty" as any }}>
            {result.explanation}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultDashboard;
