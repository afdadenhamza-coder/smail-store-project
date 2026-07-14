import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "موقع المحل | Smail Store",
  description:
    "زورونا فالمحل ديالنا فمدينة أولاد تايمة. جودة عالمية، روح مغربية. العنوان، ساعات العمل، و الطريق.",
};

const storeInfo = [
  { icon: "📍", label: "العنوان", value: "بلوك ب، آيت إيعزة 83000" },
  {
    icon: "🕐",
    label: "ساعات العمل",
    value:
      "السبت - الخميس: 9:00 صباحاً - 11:00 مساءً\nالجمعة: 3:00 مساءً - 11:00 مساءً",
  },
  { icon: "📞", label: "الهاتف", value: "0600294302" },
  {
    icon: "⭐",
    label: "الخدمات",
    value:
      "تجربة المنتجات قبل الشراء · تبديل و إرجاع فالمحل · نصائح ستايل · طلب منتجات خاصة",
  },
];

export default function LocationPage() {
  return (
    <div className="pt-14 md:pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-black via-brand-black-light to-brand-black py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm text-brand-terracotta mb-4 md:mb-6">
            <span className="w-1.5 h-1.5 bg-brand-terracotta rounded-full animate-pulse" />
            زورونا فالمحل
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            موقع Smail Store
          </h1>
          <p className="text-sm md:text-lg text-gray-400 max-w-xl mx-auto">
            جودة عالمية، روح مغربية. تعال جرب المنتجات بنفسك فالمحل ديالنا
            فأولاد تايمة
          </p>
        </div>
      </section>

      {/* Map + Info */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 md:-mt-10 relative z-10 pb-12 md:pb-20">
        <div className="rounded-[24px] md:rounded-[28px] shadow-premium overflow-hidden border border-white/[0.08] bg-[linear-gradient(165deg,#131318,#0A0A0D)]">
          {/* Map */}
          <div
            className="relative w-full group"
            style={{ paddingBottom: "min(450px, 56.25%)" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3437.5711561953863!2d-8.804647525457776!3d30.50488477469489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb10d3f3a18a791%3A0x1be1e1f4e958e3a1!2sBoutique%20Smail_store75!5e0!3m2!1sen!2sma!4v1783531111894!5m2!1sen!2sma"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Smail Store Location"
            />
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Boutique+Smail_store75+Oulad+Teima"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 cursor-pointer"
              aria-label="افتح في Google Maps"
            />
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.05]">
            {storeInfo.map((item) => (
              <div key={item.label} className="p-5 md:p-7 bg-[#0E0E13]">
                <div className="flex items-start gap-4">
                  <span className="text-xl md:text-2xl flex-shrink-0 mt-0.5">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm md:text-base mb-1">
                      {item.label}
                    </h3>
                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 md:mt-10 text-center">
          <p className="text-xs md:text-sm text-text-secondary mb-4 max-w-md mx-auto">
            تقدر تجي للمحل، تجرب المنتجات، و تشوف الجودة بنفسك قبل ما تشري. خدمة
            الستريوير عندنا فالمغرب
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Boutique+Smail_store75+Oulad+Teima"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-terracotta-gradient text-white font-bold rounded-xl shadow-terracotta hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-sm md:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              افتح فـ Google Maps
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 border border-border text-text-secondary font-semibold rounded-xl hover:bg-surface/80 transition-all text-sm md:text-base"
            >
              تواصل معانا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
