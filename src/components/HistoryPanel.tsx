import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult } from "./ResultDashboard";
import { Clock, Download, X } from "lucide-react";

interface HistoryPanelProps {
  history: AnalysisResult[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: AnalysisResult) => void;
  onDownload: (result: AnalysisResult) => void;
}

const HistoryPanel = ({ history, isOpen, onClose, onSelect, onDownload }: HistoryPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card shadow-card z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Analysis History</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No analyses yet.</p>
            )}
            {history.map((item, i) => (
              <motion.button
                key={item.timestamp}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelect(item)}
                className="w-full text-left p-4 rounded-xl bg-background hover:bg-muted transition-colors group"
              >
                <p className="text-sm text-foreground line-clamp-2 mb-2">&ldquo;{item.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.sentiment}</span>
                    <span className="font-mono tabular-nums">{item.sarcasmProbability.toFixed(0)}% sarcasm</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); onDownload(item); }}
                      className="p-1 rounded hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistoryPanel;
