interface TrustBadgesProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function TrustBadges({
  className = "",
  variant = "light",
}: TrustBadgesProps) {
  const badges = [
    { icon: "🏆", text: "شهادة الجودة" },
    { icon: "🚚", text: "توصيل 3-5 أيام" },
    { icon: "💵", text: "الدفع عند الإستلام" },
    { icon: "🔄", text: "ضمان 14 يوم" },
  ];

  return (
    <div className={`grid grid-cols-2 gap-3 py-4 md:grid-cols-4 ${className}`}>
      {badges.map((badge) => (
        <div
          key={badge.text}
          className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 transition-all hover:border-white/[0.13] hover:bg-white/[0.06]"
        >
          <span className="text-xl">{badge.icon}</span>
          <span className="text-sm font-medium text-text-secondary">
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
}
