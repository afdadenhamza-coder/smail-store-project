"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import TrustBadges from "@/components/TrustBadges";
import ReviewsSection from "@/components/ReviewsSection";
import AnimatedSection from "@/components/AnimatedSection";
import StatsCounter from "@/components/StatsCounter";

const faqs = [
  { q: "هل الدفع عند الاستلام متاح لجميع مدن المغرب؟", a: "أيوه، الدفع عند الاستلام (كاش أو وصول) متوفر فجميع مدن المملكة. الشحن مجاني للطلبات اللي فوق 300 درهم." },
  { q: "كم يستغرق التوصيل؟", a: "التوصيل داخل المدن الرئيسية (الدار البيضاء، الرباط، مراكش، فاس، طنجة) ف 3 أيام عمل. باقي المدن ف 5 أيام. كاين رقم تتبع بعد الشحن." },
  { q: "شنو المميز في Smail Store مقارنة بالباقي؟", a: "أول ماركة مغربية ديال الستريوير عندها شهادة الجودة الرسمية. نستعملو أحسن الأقمشة المستوردة، الخياطة متقنة، و التغليف فاخر. الجودة ديالنا كتضاهي الماركات العالمية." },
  { q: "كيفاش نطلب من Smail Store؟", a: "سهلة بزاف. ديّز على المنتج اللي عجبك، اختار المقاس، و ضيفو للسلة. من بعد، افتح السلة و ضغط على تأكيد الطلب. دخل سميتك و رقم الهاتف فقط. الطلب غادي يوصل ليك ف 3-5 أيام و تخلص وقت الإستلام." },
];

const whySmail = [
  { icon: "🏆", title: "شهادة الجودة", desc: "أول ماركة مغربية ديال الستريوير عندها شهادة الجودة الرسمية. منتجاتنا مطابقة للمعايير العالمية." },
  { icon: "🌍", title: "جودة عالمية", desc: "نستعملو أحسن الأقمشة المستوردة. قطن فاخر، خياطة متقنة، و تشطيب بحال الماركات العالمية." },
  { icon: "🚚", title: "توصيل سريع و آمن", desc: "التوصيل ف 3-5 أيام لباب دارك. كاين رقم تتبع عشان تعرف واش وصل الطلب ولا لا." },
  { icon: "🤝", title: "الدفع عند الإستلام", desc: "ما كتخلصش حتى يوصل الطلب ليديك. لا قلق، لا نصب، غير الجودة. راه كاين ضمان 14 يوم." },
];

const steps = [
  { num: 1, title: "اختر المنتج", desc: "تصفح المجموعة و اختار القطعة اللي عجباتك. كاين تيشيرتات، هوديات، بناطل و جواكيط." },
  { num: 2, title: "أكد الطلب", desc: "سميتك و رقم الهاتف فقط. ما كاينش دفع أونلاين. الدفع عند الإستلام." },
  { num: 3, title: "استلم و ادفع", desc: "الطلب يوصل لباب دارك ف 3-5 أيام. دفع كاش و إلا وصول وقت الإستلام." },
];

const easeArr: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeArr } },
};

export default function HomePage() {
  const allProducts = products.filter((p) => !p.is_upsell);
  const featured = allProducts.slice(0, 4);
  const categories = [
    { slug: "t-shirts", name: "تيشيرتات", image: "/images/Tshirts Collection.jpg", count: 2 },
    { slug: "hoodies", name: "هوديات", image: "/images/Hoodie.jpg", count: 2 },
    { slug: "pants", name: "بناطل", image: "/images/insta post.jpg", count: 1 },
    { slug: "jackets", name: "جواكيط", image: "/images/Jacket.jpg", count: 1 },
  ];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <section className="relative flex min-h-[82vh] items-center overflow-hidden bg-hero-gradient md:min-h-[90vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(192,112,64,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,203,124,0.08),transparent_45%)]" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.08, scale: 1 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} className="pointer-events-none absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-brand-terracotta blur-[140px]" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(95deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.3)_55%,transparent_100%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} className="order-2 space-y-5 text-right lg:order-1 md:space-y-6">
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full border border-brand-terracotta/30 bg-brand-terracotta/10 px-3 py-1.5 text-xs text-brand-terracotta backdrop-blur md:px-4 md:text-sm">
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="h-1.5 w-1.5 rounded-full bg-brand-terracotta" />
                أول ماركة مغربية بشهادة الجودة
              </motion.div>
              <h1 className="text-3xl font-black leading-[1.05] text-white sm:text-4xl md:text-6xl lg:text-7xl">
                <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="block">جودة عالمية،</motion.span>
                <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-2 block bg-gradient-to-r from-brand-terracotta via-brand-gold to-[#ffe0b3] bg-clip-text text-transparent">روح مغربية</motion.span>
              </h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mr-auto max-w-xl text-sm leading-8 text-gray-300 md:text-lg">
                أنيقة، فخمة، ومصممة للرجال اللي كيوزعوا على التفاصيل. منتجاتنا مضمونة، التوصيل ف 3-5 أيام، والدفع عند الإستلام، بلا تعقيد ولا قلق.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col justify-end gap-3 pt-2 sm:flex-row">
                <Link href="/collections/t-shirts" className="w-full rounded-2xl bg-gradient-to-r from-brand-terracotta to-brand-gold/90 px-6 py-3.5 text-center text-sm font-bold text-white shadow-[0_12px_30px_rgba(192,112,64,0.28)] transition-all hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(192,112,64,0.35)] sm:w-auto md:px-8 md:py-4 md:text-base">تسوق الآن</Link>
                <Link href="/about" className="w-full rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-white transition-all hover:bg-white/10 sm:w-auto md:px-8 md:py-4 md:text-base">من نحن</Link>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-center justify-around gap-3 pt-3 sm:justify-end sm:gap-6 md:pt-4">
                <div className="text-center"><div className="text-xl font-bold text-white md:text-2xl">+<StatsCounter end={500} duration={2500} /></div><div className="text-[10px] text-gray-400 md:text-xs">طلب وصلو</div></div>
                <div className="h-8 w-px bg-white/10 md:h-10" />
                <div className="text-center"><div className="text-xl font-bold text-white md:text-2xl"><StatsCounter end={4.8} decimals={1} duration={2500} /></div><div className="text-[10px] text-gray-400 md:text-xs">تقييم عام</div></div>
                <div className="h-8 w-px bg-white/10 md:h-10" />
                <div className="text-center"><div className="text-xl font-bold text-white md:text-2xl">3-5</div><div className="text-[10px] text-gray-400 md:text-xs">أيام للتوصيل</div></div>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30, y: 30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative order-1 flex justify-center lg:order-2">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand-terracotta/20 via-transparent to-white/10 blur-3xl" />
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.35)] lg:max-w-none">
                <img src="/images/right side img.jpg" alt="Smail Store Collection" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 200 }} className="absolute -bottom-4 right-0 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-lg backdrop-blur-xl lg:-left-4 lg:right-auto md:p-4">
                <div className="flex items-center gap-3"><motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, delay: 2, repeatDelay: 5, repeat: Infinity }} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-terracotta/20 md:h-10 md:w-10"><span className="text-base text-brand-terracotta md:text-lg">⭐</span></motion.div><div><div className="text-xs font-semibold text-white md:text-sm">أكثر من 500</div><div className="text-[10px] text-gray-400 md:text-xs">راجل واثق فينا</div></div></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 md:-mt-8">
          <TrustBadges className="rounded-[24px] border border-white/10 bg-[#101014]/85 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-6" />
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 text-center md:mb-14">
              <h2 className="mb-2 text-xl font-bold text-white md:text-3xl">شنو كيميز Smail Store؟</h2>
              <p className="mx-auto max-w-lg text-xs text-text-secondary md:text-base">ما كايناش ماركة عادية. عندنا 4 حوايج كيخلونا مختلفين و فريدين فالمغرب</p>
            </div>
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
              {whySmail.map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,18,24,0.98),rgba(10,10,13,0.98))] p-4 text-center shadow-[0_20px_55px_rgba(0,0,0,0.22)] transition-shadow hover:shadow-[0_28px_70px_rgba(0,0,0,0.3)] md:p-6">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-terracotta/10 text-xl md:mb-4 md:h-14 md:w-14 md:text-3xl">
                    {item.icon}
                  </motion.div>
                  <h3 className="mb-1 text-sm font-bold text-white md:mb-2 md:text-base">{item.title}</h3>
                  <p className="text-[11px] leading-relaxed text-text-secondary md:text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection delay={0.2}>
        <section className="max-w-7xl mx-auto px-4 py-8 md:py-16">
          <div className="flex items-end justify-between mb-6 md:mb-10">
            <div>
              <h2 className="text-xl md:text-3xl font-bold">الأكثر مبيعا</h2>
              <p className="text-xs md:text-base text-text-secondary mt-1 md:mt-2">هادو اللي عجبقات الزبائن كثر من 500 طلب</p>
            </div>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6"
          >
            {featured.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection delay={0.1}>
        <section className="py-12 md:py-20 bg-surface/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-14">
              <h2 className="text-xl md:text-3xl font-bold mb-2">من الطلب لباب دارك ف 3 خطوات</h2>
              <p className="text-xs md:text-base text-text-secondary">بلا دفع أونلاين. بلا التزام. بلا مخاطرة.</p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto"
            >
              {steps.map((step) => (
                <motion.div
                  key={step.num}
                  variants={itemVariants}
                  className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(16,16,20,0.98),rgba(8,8,11,0.98))] p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative md:p-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 md:w-14 md:h-14 bg-brand-terracotta rounded-full flex items-center justify-center text-white font-bold text-lg md:text-2xl mx-auto mb-3 md:mb-5"
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="mb-1 text-sm font-bold text-white md:mb-2 md:text-lg">{step.title}</h3>
                  <p className="text-[11px] leading-relaxed text-[#cfcfd5] md:text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Categories */}
      <AnimatedSection delay={0.2}>
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl md:text-3xl font-bold mb-2 text-center">تسوق حسب القسم</h2>
            <p className="text-xs md:text-base text-text-secondary mb-6 md:mb-10 text-center">اختر القسم اللي يناسب ستايلك</p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
            >
              {categories.map((cat) => (
                <motion.div key={cat.slug} variants={itemVariants}>
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="group relative block h-36 sm:h-48 md:h-64 rounded-xl md:rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="text-white font-bold text-sm md:text-lg">{cat.name}</h3>
                      <p className="text-white/60 text-[10px] md:text-sm">{cat.count} منتجات</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Reviews Section */}
      <AnimatedSection delay={0.1}>
        <ReviewsSection />
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection delay={0.2}>
        <section className="py-12 md:py-20 bg-surface/50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl md:text-3xl font-bold mb-2">أسئلة قبل الطلب</h2>
              <p className="text-xs md:text-base text-text-secondary">كل شيء كتحتاج تعرفه قبل ما تطلب</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(16,16,20,0.98),rgba(8,8,11,0.98))] shadow-[0_18px_45px_rgba(0,0,0,0.18)] md:rounded-2xl"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-right"
                  >
                    <span className="text-sm font-semibold text-white md:text-base">{faq.q}</span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-brand-terracotta flex-shrink-0 mr-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-xs leading-relaxed text-[#cfcfd5] md:px-5 md:pb-5 md:text-sm">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(192,112,64,0.25),transparent_35%),linear-gradient(135deg,#0d0d11_0%,#16161b_60%,#0b0b0d_100%)] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-16"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.06, 0.1, 0.06] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,112,64,0.45),transparent_60%)]"
            />
            <div className="relative">
              <h2 className="mb-3 text-xl font-bold text-white md:mb-4 md:text-4xl">
                واش مستعد تطور الستيل ديالك؟
              </h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-[#cfcfd5] md:mb-8 md:text-lg">
                جودة عالمية، روح مغربية. اطلب دابا و توصلك ف 3-5 أيام. جرب و إلا ردينا ليك فلوسك.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-6 flex flex-wrap items-center justify-center gap-2 md:mb-8 md:gap-3"
              >
                {["🏆 شهادة الجودة", "🚚 توصيل 3-5 أيام", "💳 الدفع عند الإستلام", "✅ ضمان 14 يوم"].map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-[#d8d8de] md:px-3 md:text-xs"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/collections/t-shirts"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-terracotta to-brand-gold/90 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(192,112,64,0.28)] transition-all hover:shadow-[0_16px_40px_rgba(192,112,64,0.35)] md:px-10 md:py-4 md:text-base"
                >
                  تسوق الآن
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </AnimatedSection>
    </div>
  );
}
