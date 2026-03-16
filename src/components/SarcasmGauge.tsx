import { motion } from "framer-motion";

interface SarcasmGaugeProps {
  probability: number;
}

const SarcasmGauge = ({ probability }: SarcasmGaugeProps) => {
  const getColor = () => {
    if (probability > 70) return "text-warning";
    if (probability > 40) return "text-primary";
    return "text-muted-foreground/40";
  };

  const getLabel = () => {
    if (probability > 70) return "High Sarcasm";
    if (probability > 40) return "Medium Sarcasm";
    return "Low Sarcasm";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-64 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 55">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-muted"
          />
          <motion.path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="126"
            initial={{ strokeDashoffset: 126 }}
            animate={{ strokeDashoffset: 126 - (126 * probability) / 100 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className={getColor()}
          />
        </svg>
        <div className="absolute bottom-1 w-full text-center">
          <motion.span
            className="text-3xl font-semibold tabular-nums font-mono text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {probability.toFixed(1)}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{getLabel()}</span>
    </div>
  );
};

export default SarcasmGauge;
