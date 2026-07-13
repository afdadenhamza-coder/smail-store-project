interface TrustBadgesProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function TrustBadges({ className = "", variant = "light" }: TrustBadgesProps) {
  const badges = [
    { icon: "✓", text: "شهادة الجودة" },
    { icon: "🚚", text: "التوصيل ف 3-5 أيام" },
    { icon: "💵", text: "الدفع عند الإستلام" },
    { icon: "🔄", text: "التبديل و الإرجاع" },
  ];

  return (
    <div className={`grid grid-cols-2 gap-3 py-6 md:grid-cols-4 ${className}`}>
      {badges.map((badge) => (
        <div
          key={badge.text}
          className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium ${
            variant === "dark"
              ? "bg-white/5 text-gray-300"
              : "border border-white/10 bg-white/5 text-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          }`}
        >
          <span className="text-lg">{badge.icon}</span>
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
