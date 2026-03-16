import { motion } from "framer-motion";

interface SentimentBarProps {
  sentiment: "Positive" | "Negative" | "Neutral";
  score: number;
}

const SentimentBar = ({ sentiment, score }: SentimentBarProps) => {
  const getBarStyle = () => {
    switch (sentiment) {
      case "Positive":
        return { side: "right" as const, color: "bg-positive" };
      case "Negative":
        return { side: "left" as const, color: "bg-negative" };
      default:
        return { side: "center" as const, color: "bg-muted-foreground" };
    }
  };

  const { side, color } = getBarStyle();
  const width = `${score / 2}%`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-negative font-medium">Negative</span>
        <span className="text-muted-foreground font-medium">Neutral</span>
        <span className="text-positive font-medium">Positive</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border z-10" />
        {side === "right" && (
          <motion.div
            className={`absolute left-1/2 top-0 bottom-0 rounded-r-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          />
        )}
        {side === "left" && (
          <motion.div
            className={`absolute right-1/2 top-0 bottom-0 rounded-l-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          />
        )}
        {side === "center" && (
          <motion.div
            className={`absolute left-[48%] top-0 bottom-0 rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: "4%" }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          />
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl font-semibold text-foreground">{sentiment}</span>
        <span className="text-lg font-mono tabular-nums text-muted-foreground">{score.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default SentimentBar;
