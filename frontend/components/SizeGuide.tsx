"use client";

interface SizeGuideProps {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}

export default function SizeGuide({ sizes, selected, onSelect }: SizeGuideProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
            selected === size
              ? "bg-brand-black text-white border-brand-black"
              : "bg-white text-brand-black border-border hover:border-brand-black"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
