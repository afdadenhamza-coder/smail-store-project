"use client";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "");
    if (digits.length <= 10) {
      onChange(digits);
    }
  };

  const displayValue = value
    ? `0${value.slice(1)}`
    : "";

  return (
    <div>
      <div
        className={`flex overflow-hidden rounded-lg border ${
          error ? "border-red-500" : "border-white/10"
        }`}
      >
        <div className="flex items-center gap-1 border-l border-white/10 bg-[#0f0f14] px-3 py-3 text-sm text-[#cfcfd5]">
          <span className="text-base">🇲🇦</span>
          <span>+212</span>
        </div>
        <input
          type="tel"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder="06 12 34 56 78"
          className="flex-1 bg-[#0f0f14] px-3 py-3 text-left text-sm text-white outline-none dir-ltr"
          dir="ltr"
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
