"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProducts, fetchFeaturedProducts, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import TrustBadges from "@/components/TrustBadges";
import ReviewsSection from "@/components/ReviewsSection";
import AnimatedSection from "@/components/AnimatedSection";

const faqs = [
  {
    q: "هل الدفع عند الاستلام متاح لجميع مدن المغرب؟",
    a: "أيوه، الدفع عند الاستلام (كاش أو وصول) متوفر فجميع مدن المملكة. الشحن مجاني للطلبات اللي فوق 300 درهم.",
  },
  {
    q: "كم يستغرق التوصيل؟",
    a: "التوصيل داخل المدن الرئيسية (الدار البيضاء، الرباط، مراكش، فاس، طنجة) ف 3 أيام عمل. باقي المدن ف 5 أيام. كاين رقم تتبع بعد الشحن.",
  },
  {
    q: "شنو المميز في Smail Store مقارنة بالباقي؟",
    a: "أول ماركة مغربية ديال الستريوير عندها شهادة الجودة الرسمية. نستعملو أحسن الأقمشة المستوردة، الخياطة متقنة، و التغليف فاخر. الجودة ديالنا كتضاهي الماركات العالمية.",
  },
  {
    q: "كيفاش نطلب من Smail Store؟",
    a: "سهلة بزاف. ديّز على المنتج اللي عجبك، اختار المقاس، و ضيفو للسلة. من بعد، افتح السلة و ضغط على تأكيد الطلب. دخل سميتك و رقم الهاتف فقط. الطلب غادي يوصل ليك ف 3-5 أيام و تخلص وقت الإستلام.",
  },
];

const whySmail = [
  {
    icon: "🏆",
    title: "شهادة الجودة",
    desc: "أول ماركة مغربية ديال الستريوير عندها شهادة الجودة الرسمية. منتجاتنا مطابقة للمعايير العالمية.",
  },
  {
    icon: "🌍",
    title: "جودة عالمية",
    desc: "نستعملو أحسن الأقمشة المستوردة. قطن فاخر، خياطة متقنة، و تشطيب بحال الماركات العالمية.",
  },
  {
    icon: "🚚",
    title: "توصيل سريع و آمن",
    desc: "التوصيل ف 3-5 أيام لباب دارك. كاين رقم تتبع عشان تعرف واش وصل الطلب ولا لا.",
  },
  {
    icon: "🤝",
    title: "الدفع عند الإستلام",
    desc: "ما كتخلصش حتى يوصل الطلب ليديك. لا قلق، لا نصب، غير الجودة. راه كاين ضمان 14 يوم.",
  },
];

const steps = [
  {
    num: 1,
    title: "اختر المنتج",
    desc: "تصفح المجموعة و اختار القطعة اللي عجباتك. كاين تيشيرتات، هوديات، بناطل و جواكيط.",
  },
  {
    num: 2,
    title: "أكد الطلب",
    desc: "سميتك و رقم الهاتف فقط. ما كاينش دفع أونلاين. الدفع عند الإستلام.",
  },
  {
    num: 3,
    title: "استلم و ادفع",
    desc: "الطلب يوصل لباب دارك ف 3-5 أيام. دفع كاش و إلا وصول وقت الإستلام.",
  },
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
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState([
    {
      slug: "t-shirts",
      name: "تيشيرتات",
      image: "/images/Tshirts Collection.jpg",
      count: 0,
    },
    { slug: "hoodies", name: "هوديات", image: "/images/Hoodie.jpg", count: 0 },
    { slug: "pants", name: "بناطل", image: "/images/insta post.jpg", count: 0 },
    { slug: "jackets", name: "جواكيط", image: "/images/Jacket.jpg", count: 0 },
  ]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [allProducts, featuredProducts] = await Promise.all([
          fetchProducts(),
          fetchFeaturedProducts(),
        ]);

        // Use featured products if available, otherwise use first 4 regular products
        let productsToShow =
          featuredProducts.length > 0
            ? featuredProducts
            : allProducts.slice(0, 4);

        // If API returns no products at all, use static data as fallback
        if (productsToShow.length === 0) {
          const { products: staticProducts } = await import("@/data/products");
          const all = staticProducts.filter((p) => !p.is_upsell);
          productsToShow = all.slice(0, 4);
        }

        setFeatured(productsToShow);

        // Count products by category
        const counts: Record<string, number> = {};
        (allProducts.length > 0
          ? allProducts
          : (await import("@/data/products")).products.filter(
              (p) => !p.is_upsell,
            )
        ).forEach((p) => {
          if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
        });
        setCategories((prev) =>
          prev.map((c) => ({ ...c, count: counts[c.slug] || 0 })),
        );
      } catch {
        // fallback: use static data
        const { products: staticProducts } = await import("@/data/products");
        const all = staticProducts.filter((p) => !p.is_upsell);
        setFeatured(all.slice(0, 4));
        const counts: Record<string, number> = {};
        all.forEach((p) => {
          if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
        });
        setCategories((prev) =>
          prev.map((c) => ({ ...c, count: counts[c.slug] || 0 })),
        );
      }
    })();
  }, []);

  return (
    <div>
      {/* ═══ HERO SECTION ════════════════════════════════════════ */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden md:min-h-screen">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/right side img.jpg"
            alt=""
            className="h-full w-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030304] via-[#030304]/85 to-[#030304]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-transparent to-[#030304]/30" />
        </div>

        {/* Animated glow orbs — opacity only, no scale to avoid layout shifts */}
        <motion.div
          animate={{ opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-terracotta blur-[120px]"
          style={{ willChange: "opacity" }}
        />
        <motion.div
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="pointer-events-none absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-brand-gold blur-[150px]"
          style={{ willChange: "opacity" }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 space-y-6 text-right lg:order-1"
            >
              {/* Label pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-brand-terracotta/30 bg-brand-terracotta/10 px-4 py-2 text-xs font-semibold text-brand-terracotta backdrop-blur"
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-brand-terracotta"
                />
                أول ماركة مغربية بشهادة الجودة 🇲🇦
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl font-black leading-[1.02] text-white sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="block"
                >
                  جودة عالمية،
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.7 }}
                  className="mt-1 block gradient-text"
                >
                  روح مغربية
                </motion.span>
              </h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="max-w-lg text-base leading-8 text-text-secondary md:text-lg"
              >
                أنيقة، فخمة، ومصممة للرجال اللي كيوزعوا على التفاصيل. منتجاتنا
                مضمونة، التوصيل ف 3-5 أيام، والدفع عند الإستلام.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="flex flex-col justify-end gap-3 sm:flex-row"
              >
                <Link
                  href="/collections/t-shirts"
                  className="btn-primary flex items-center justify-center gap-2 text-center"
                >
                  تسوق الآن
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
                <Link href="/about" className="btn-secondary text-center">
                  اكتشف القصة
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-end gap-6 pt-2"
              >
                {[
                  { value: "+500", label: "طلب وصلو" },
                  { value: "4.8★", label: "تقييم عام" },
                  { value: "3-5", label: "أيام توصيل" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl font-black text-white md:text-2xl">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-text-muted md:text-xs">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Product image card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative order-1 flex justify-center lg:order-2"
            >
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-brand-terracotta/25 via-brand-gold/15 to-transparent blur-2xl" />

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[32px] border border-white/[0.12] shadow-float lg:max-w-md"
                >
                  <img
                    src="/images/right side img.jpg"
                    alt="Smail Store Collection"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  {/* Badge on image */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 bg-black/60 p-3 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 rtl:space-x-reverse">
                        {["bg-amber-400", "bg-orange-400", "bg-red-400"].map(
                          (c, i) => (
                            <div
                              key={i}
                              className={`h-6 w-6 rounded-full ${c} border-2 border-black/50`}
                            />
                          ),
                        )}
                      </div>
                      <div className="mr-1">
                        <p className="text-xs font-semibold text-white">
                          +500 زبون راضي
                        </p>
                        <div className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                          {"★★★★★".split("").map((s, i) => (
                            <span key={i}>{s}</span>
                          ))}
                          <span className="text-text-muted mr-1">(4.8)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating quality badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="absolute -top-4 -left-4 rounded-2xl border border-white/15 bg-[#0D0D10]/90 p-3 shadow-premium backdrop-blur-xl md:-top-6 md:-left-6 md:p-4"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-terracotta/20">
                      <span className="text-lg">🏆</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white">
                        شهادة الجودة
                      </p>
                      <p className="text-[9px] text-text-muted">
                        معتمدة رسمياً
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5"
          >
            <div className="h-2 w-1 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ MARQUEE STRIP ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden border-y border-white/[0.07] bg-[#070709] py-3.5">
        <div className="animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, di) => (
            <span key={di} className="inline-flex items-center">
              {[
                "🏆 شهادة الجودة المعتمدة",
                "🚚 توصيل لباب دارك",
                "💵 الدفع عند الإستلام",
                "🇲🇦 صنعو بالمغرب",
                "⭐ 4.8 تقييم من 500+",
                "🔄 ضمان التبديل 14 يوم",
                "📦 تغليف فاخر مجاناً",
                "✨ جودة عالمية، روح مغربية",
              ].map((item, i) => (
                <span
                  key={i}
                  className="mx-6 text-sm font-medium text-text-secondary"
                >
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ TRUST BADGES ════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-10">
          <TrustBadges className="rounded-[24px] border border-white/[0.07] bg-[#0A0A0E]/85 p-4 shadow-premium backdrop-blur-xl md:p-6" />
        </section>
      </AnimatedSection>

      {/* ═══ WHY SMAIL STORE ═════════════════════════════════════ */}
      <AnimatedSection delay={0.1}>
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 text-center md:mb-16">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
                ليش Smail Store
              </p>
              <h2 className="text-2xl font-black text-white md:text-4xl">
                شنو كيميزنا عن غيرنا؟
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary md:text-base">
                ما كايناش ماركة عادية. عندنا 4 حوايج كيخلونا مختلفين و فريدين
                فالمغرب
              </p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
            >
              {whySmail.map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group rounded-[22px] border border-white/[0.07] bg-[linear-gradient(165deg,#131318,#0A0A0D)] p-5 text-center shadow-card transition-all hover:border-white/[0.13] hover:shadow-card-hover md:p-7"
                >
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-terracotta/15 to-brand-gold/10 text-2xl md:h-16 md:w-16 md:text-3xl"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="mb-2 text-sm font-bold text-white md:text-base">
                    {item.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-text-secondary md:text-sm">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ FEATURED PRODUCTS ═══════════════════════════════════ */}
      <AnimatedSection delay={0.2}>
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-end justify-between md:mb-12">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
                  المجموعة المختارة
                </p>
                <h2 className="text-2xl font-black text-white md:text-4xl">
                  الأكثر مبيعا 🔥
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  هادو اللي عجبقات الزبائن — أكثر من 500 طلب
                </p>
              </div>
              <Link
                href="/collections/t-shirts"
                className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-brand-terracotta/30 hover:bg-brand-terracotta/10 hover:text-white md:flex"
              >
                شوف الكل
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
            </div>
            <motion.div
              key={featured.length > 0 ? "loaded" : "empty"}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
            >
              {featured.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-6 text-center md:hidden">
              <Link
                href="/collections/t-shirts"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-text-secondary"
              >
                شوف الكل
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ HOW IT WORKS ════════════════════════════════════════ */}
      <AnimatedSection delay={0.1}>
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-terracotta/[0.03] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mb-10 text-center md:mb-16">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
                بسيط و سريع
              </p>
              <h2 className="text-2xl font-black text-white md:text-4xl">
                من الطلب لباب دارك ف 3 خطوات
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                بلا دفع أونلاين. بلا التزام. بلا مخاطرة.
              </p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid max-w-4xl mx-auto grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={itemVariants}
                  className="relative rounded-[22px] border border-white/[0.07] bg-[linear-gradient(165deg,#131318,#0A0A0D)] p-6 text-center shadow-card md:p-8"
                >
                  {i < steps.length - 1 && (
                    <div className="absolute -left-3 top-1/2 hidden -translate-y-1/2 md:block">
                      <svg
                        className="h-5 w-5 rotate-180 text-brand-terracotta/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-terracotta to-brand-terracotta-deep text-white text-xl font-black shadow-terracotta-sm md:h-14 md:w-14 md:text-2xl"
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="mb-2 text-base font-bold text-white md:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-text-secondary md:text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ CATEGORIES ══════════════════════════════════════════ */}
      <AnimatedSection delay={0.2}>
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 text-center md:mb-12">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
                الأقسام
              </p>
              <h2 className="text-2xl font-black text-white md:text-4xl">
                تسوق حسب القسم
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                اختر القسم اللي يناسب ستايلك
              </p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
            >
              {categories.map((cat) => (
                <motion.div key={cat.slug} variants={itemVariants}>
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="group relative block h-40 overflow-hidden rounded-[20px] shadow-card hover:shadow-card-hover sm:h-52 md:h-64"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85" />
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 md:p-5">
                      <h3 className="text-sm font-bold text-white md:text-lg">
                        {cat.name}
                      </h3>
                      <p className="mt-0.5 text-[10px] text-white/60 md:text-xs">
                        {cat.count} منتجات
                      </p>
                    </div>
                    <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.15] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 md:right-4 md:top-4">
                      <svg
                        className="h-3.5 w-3.5 rotate-180 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ REVIEWS ═════════════════════════════════════════════ */}
      <AnimatedSection delay={0.1}>
        <ReviewsSection />
      </AnimatedSection>

      {/* ═══ FAQ ═════════════════════════════════════════════════ */}
      <AnimatedSection delay={0.2}>
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-4">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
                الأسئلة الشائعة
              </p>
              <h2 className="text-2xl font-black text-white md:text-4xl">
                أسئلة قبل الطلب
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                كل شيء كتحتاج تعرفه
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className={`overflow-hidden rounded-[18px] border transition-all duration-200 ${
                    openFaq === i
                      ? "border-brand-terracotta/30 bg-[linear-gradient(165deg,rgba(192,112,64,0.08),rgba(10,10,14,0.98))]"
                      : "border-white/[0.07] bg-[linear-gradient(165deg,#131318,#0A0A0D)]"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-right md:p-5"
                  >
                    <span className="text-sm font-semibold text-white md:text-base">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-terracotta/10 text-brand-terracotta"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="faq-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-5 text-sm leading-relaxed text-text-secondary md:px-5">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ FINAL CTA ═══════════════════════════════════════════ */}
      <AnimatedSection delay={0.1}>
        <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[32px] border border-brand-terracotta/20 bg-[radial-gradient(ellipse_at_top_left,rgba(192,112,64,0.2),transparent_50%),linear-gradient(135deg,#0E0E14_0%,#18161A_60%,#0A0A0C_100%)] p-8 text-center shadow-premium md:p-16"
          >
            {/* Background glow */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.04, 0.08, 0.04] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,112,64,0.5),transparent_65%)]"
            />
            <div className="relative">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
                جرب الفرق
              </p>
              <h2 className="mb-4 text-2xl font-black text-white md:text-5xl">
                واش مستعد تطور الستيل ديالك؟
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-text-secondary md:text-lg">
                جودة عالمية، روح مغربية. اطلب دابا و توصلك ف 3-5 أيام. جرب و إلا
                ردينا ليك فلوسك.
              </p>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
                {[
                  "🏆 شهادة الجودة",
                  "🚚 توصيل 3-5 أيام",
                  "💳 الدفع عند الإستلام",
                  "✅ ضمان 14 يوم",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-white/[0.10] bg-white/[0.05] px-3 py-1.5 text-xs text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/collections/t-shirts"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-terracotta to-brand-terracotta-light px-10 py-4 text-base font-bold text-white shadow-terracotta transition-all hover:shadow-terracotta-lg"
                >
                  تسوق الآن
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
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
