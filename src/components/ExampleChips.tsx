interface ExampleChipsProps {
  onSelect: (text: string) => void;
}

const examples = [
  "Oh great, another Monday morning… just what I needed.",
  "Fantastic, my internet stopped working right before the meeting.",
  "Sure, I love being stuck in traffic for two hours.",
  "What a beautiful day to be alive and well!",
  "This is the best project I have ever worked on, genuinely.",
];

const ExampleChips = ({ onSelect }: ExampleChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {examples.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {text.length > 45 ? text.slice(0, 45) + "…" : text}
        </button>
      ))}
    </div>
  );
};

export default ExampleChips;
