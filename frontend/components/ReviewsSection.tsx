"use client";

import { motion } from "framer-motion";

const reviews = [
  { name: "يوسف", city: "الدار البيضاء", text: "جودة عالية بزاف. التيشيرت كيف ما كنت كنتمنى. غادي نطلب مرة أخرى.", rating: 5, verified: true },
  { name: "أمين", city: "الرباط", text: "الصراحة ما كنت متوقع هاد الجودة. التغليف كان فاخر و المنتج بحال الصورة بالضبط.", rating: 5, verified: true },
  { name: "سفيان", city: "مراكش", text: "ثاني مرة كنطلب. هاد المرة جبت هودي لخويا. كامل عجبهم. الخدمة جدية و الثقة.", rating: 5, verified: true },
  { name: "كريم", city: "طنجة", text: "البنطلون كيف ما كنت كنتمنى. القماش فاخر و الخياطة متقنة. توصيل سريع.", rating: 4, verified: true },
  { name: "أنس", city: "فاس", text: "جيت نهار الجمعة و وصلني نهار الاثنين. الجودة و الخدمة مزيانين بزاف.", rating: 5, verified: true },
  { name: "إبراهيم", city: "أكادير", text: "الصراحة كنت شاك فيها ولكن المنتج وصل و الجودة عالية. غادي نطلب مرة أخرى.", rating: 4, verified: true },
];

const ratingDistribution = [
  { stars: 5, count: 4 },
  { stars: 4, count: 2 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

const totalReviews = reviews.length;
const averageRating = 4.8;

const easeArr: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeArr } },
};

export default function ReviewsSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-8 text-center md:mb-12">
          <h2 className="mb-2 text-xl font-bold text-white md:text-3xl">شنو كايقولو الزبائن؟</h2>
          <p className="mx-auto max-w-lg text-xs text-text-secondary md:text-base">أكثر من 500 راجل وثق فينا. هادو بعض التعليقات اللي وصلونا</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }} className="mx-auto mb-8 max-w-md rounded-[24px] border border-white/10 bg-[#101014]/90 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)] md:mb-10 md:p-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex-shrink-0 text-center">
              <div className="text-3xl font-bold text-brand-terracotta md:text-4xl">{averageRating}</div>
              <div className="mt-1 flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-sm ${star <= Math.round(averageRating) ? "text-brand-terracotta" : "text-white/10"}`}>★</span>
                ))}
              </div>
              <div className="mt-1 text-xs text-text-muted">{totalReviews} تقييم</div>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-left text-text-muted">{row.stars} ★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${(row.count / totalReviews) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} className="h-full rounded-full bg-brand-terracotta" />
                  </div>
                  <span className="w-6 text-right text-text-muted">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {reviews.slice(0, 6).map((review) => (
            <motion.div key={review.name} variants={itemVariants} whileHover={{ y: -2 }} className="rounded-[24px] border border-white/10 bg-[#0F0F12]/90 p-4 shadow-[0_16px_35px_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[0_24px_50px_rgba(0,0,0,0.24)] md:p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-terracotta/10 text-sm font-bold text-brand-terracotta md:h-10 md:w-10 md:text-base">{review.name[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    {review.verified && (<span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-400">مؤكد</span>)}
                  </div>
                  <p className="text-xs text-text-muted">{review.city}</p>
                </div>
                <div className="flex flex-shrink-0 gap-0.5">{Array.from({ length: review.rating }).map((_, i) => (<span key={i} className="text-xs text-brand-terracotta">★</span>))}</div>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">&ldquo;{review.text}&rdquo;</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
