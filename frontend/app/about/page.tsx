import Link from "next/link";
import type { Metadata } from "next";
import TrustBadges from "@/components/TrustBadges";

export const metadata: Metadata = {
  title: "من نحن | Smail Store",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient text-white py-14 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4">من نحن</h1>
          <p className="text-sm md:text-lg text-gray-400 px-2">
            أول ماركة مغربية ديال الستريوير عندها شهادة الجودة و تضمن الرجوع
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center mb-12 md:mb-16">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">شنو هو Smail Store؟</h2>
            <div className="space-y-3 md:space-y-4 text-xs md:text-base text-text-secondary leading-relaxed">
              <p>
                Smail Store هي أول ماركة مغربية ديال الستريوير تقدم منتجات بجودة
                عالمية و بشهادة الجودة. تأسسنا باش نعطيو الشباب المغربي بديل
                محلي ممتاز للبراندات العالمية — بأسعار معقولة و ثقة كاملة.
              </p>
              <p>
                عندنا أكثر من 500 طلب وصلو لجميع مدن المغرب. كنهتم بالجودة و
                التفاصيل، و كنسعيو باش نوصلكم المنتجات ف أسرع وقت. كل منتج
                كيمر من مراقبة الجودة قبل ما يخرج ليك.
              </p>
              <p>
                الفرق بيناتنا و بين غيرنا؟ عندنا شهادة الجودة، التغليف الفاخر،
                و خدمة الزبائن اللي كاتجاوبك ف نفس اليوم. ما كاينش نصب و لا
                منتجات TG. الجودة هي أساسنا.
              </p>
            </div>
          </div>
          <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-premium">
            <img
              src="/images/Collection 1.jpg"
              alt="Smail Store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">علاش تختار Smail Store؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {[
            {
              icon: "✓",
              title: "شهادة الجودة",
              desc: "كل منتج كيمر من مراقبة الجودة قبل الشحن. مضمون 100%",
            },
            {
              icon: "⭐",
              title: "أكثر من 500 زبون",
              desc: "سمعتنا معروفة فالمغرب. أكثر من 500 راجل واثق فينا و طلب من قبل",
            },
            {
              icon: "🎁",
              title: "تغليف فاخر",
              desc: "كل طلب كيجي فصندوق فاخر مع ورق حريري و كارت الشكر. الunboxing تجربة بحد ذاتها",
            },
          ].map((item) => (
            <div key={item.title} className="bg-surface/70 p-5 md:p-6 rounded-xl md:rounded-2xl text-center hover:shadow-card transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-terracotta/10 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 text-xl md:text-2xl font-bold text-brand-terracotta shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1 md:mb-2">{item.title}</h3>
              <p className="text-[11px] md:text-sm text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* What makes us different */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">الفرق بيناتنا و بين غيرنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-12 md:mb-16">
          {[
            { us: "شهادة الجودة المضمونة", them: "منتجات بلا مصدر" },
            { us: "تغليف فاخر (صندوق + ورق حريري + كارت)", them: "كيس بلاستيك" },
            { us: "خدمة زبائن ف نفس اليوم", them: "لا رد و لا خدمة" },
            { us: "التبديل و الإرجاع مضمون", them: "ما كاينش لارجاع" },
            { us: "توصيل ف 3-5 أيام لجميع المدن", them: "15 يوم و لا جاو" },
          ].map((item) => (
            <div key={item.us} className="bg-white border border-border/60 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm">
              <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-[10px] md:text-xs font-bold flex-shrink-0">✓</span>
                <span className="font-semibold text-[11px] md:text-sm">{item.us}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-red-50 rounded-full flex items-center justify-center text-red-400 text-[10px] md:text-xs font-bold flex-shrink-0">✕</span>
                <span className="text-[11px] md:text-sm text-text-muted">{item.them}</span>
              </div>
            </div>
          ))}
        </div>

        <TrustBadges className="bg-surface/50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-8 md:mb-10" />

        <div className="text-center">
          <Link
            href="/collections/t-shirts"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-terracotta-gradient text-white font-bold rounded-xl shadow-terracotta hover:shadow-lg active:scale-[0.98] transition-all text-sm md:text-base"
          >
            تسوق الآن
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
