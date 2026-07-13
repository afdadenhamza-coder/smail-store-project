"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { products } from "@/data/products";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function ThankYouPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const secondChanceProducts = products.filter((p) => !p.is_upsell).slice(0, 3);

  useEffect(() => {
    const num = sessionStorage.getItem("order_number");
    if (num) setOrderNumber(num);

    try {
      const saved = sessionStorage.getItem("last_order_items");
      if (saved) setOrderItems(JSON.parse(saved));
      const total = sessionStorage.getItem("last_order_total");
      if (total) setOrderTotal(Number(total));
    } catch {}
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto px-4 py-10 md:py-16"
    >
      {/* Success Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-5 shadow-lg shadow-emerald-500/30">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 md:h-10 md:w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-4xl font-bold mb-2"
        >
          تم تأكيد طلبك بنجاح 🎉
        </motion.h1>

        {orderNumber && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-surface/80 backdrop-blur-sm border border-border/60 px-3 md:px-4 py-1.5 md:py-2 rounded-xl mb-3"
          >
            <span className="text-[11px] md:text-sm text-text-secondary">رقم الطلب:</span>
            <span className="font-bold text-base md:text-lg tracking-wider">{orderNumber}</span>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs md:text-base text-text-secondary max-w-md mx-auto"
        >
          سنتصل بك قريبا لتأكيد التوصيل و العنوان
        </motion.p>
      </motion.div>

      {/* COD Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-5 mb-6 border border-green-100/80 max-w-sm mx-auto text-center"
      >
        <div className="flex items-center gap-2 justify-center text-xs md:text-sm font-medium text-green-700 mb-1">
          <span>💵</span>
          <span>الدفع عند الإستلام</span>
        </div>
        <p className="text-[11px] md:text-sm text-green-600/70">
          غادي نعيطو ليك فالقريب باش نأكدو الطلب و العنوان ديالك
        </p>
      </motion.div>

      {/* Ordered Products */}
      {orderItems.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-border/60 shadow-card p-4 md:p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
            <svg className="w-4 h-4 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h2 className="text-sm md:text-base font-bold">منتجات طلبك</h2>
            <span className="text-[10px] text-text-muted mr-auto">{orderItems.length} منتج</span>
          </div>

          <div className="space-y-3">
            {orderItems.map((item, i) => (
              <motion.div
                key={`${item.id}-${item.size}`}
                variants={itemVariants}
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface/50 transition-colors"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-surface shadow-sm flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-semibold truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] md:text-xs text-text-secondary">المقاس: {item.size}</span>
                    <span className="text-[10px] text-text-muted">×</span>
                    <span className="text-[10px] md:text-xs text-text-secondary">{item.quantity}</span>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-brand-terracotta mt-0.5">
                    {item.price} <span className="text-[9px] md:text-[10px]">DH</span>
                  </p>
                </div>
                <div className="text-[9px] md:text-[10px] text-text-muted text-center flex-shrink-0">
                  <div>{item.quantity}</div>
                  <div className="text-[8px]">قطعة</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between"
          >
            <span className="text-xs md:text-sm text-text-secondary">المجموع</span>
            <span className="text-sm md:text-base font-bold">
              {orderTotal.toLocaleString()} <span className="text-[10px]">DH</span>
            </span>
          </motion.div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-3 justify-center mb-10 md:mb-12"
      >
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href={`https://wa.me/212612345678?text=${encodeURIComponent(
            `مرحبا، عندي سؤال بخصوص طلبي رقم ${orderNumber}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white font-medium rounded-xl text-xs md:text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center gap-2 justify-center"
        >
          <span>💬</span>
          واتساب
        </motion.a>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 border border-border text-text-secondary font-medium rounded-xl text-xs md:text-sm hover:bg-surface transition-all justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            العودة للرئيسية
          </Link>
        </motion.div>
      </motion.div>

      {/* Second Chance */}
      {secondChanceProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-border pt-8 md:pt-10"
        >
          <h2 className="text-lg md:text-xl font-bold mb-5 md:mb-6 text-center">قد يهمك أيضا</h2>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {secondChanceProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
              >
                <Link
                  href={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-square bg-surface rounded-lg md:rounded-xl overflow-hidden mb-1.5 md:mb-2 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-[10px] md:text-xs font-medium truncate">{product.name}</p>
                  <p className="text-[10px] md:text-xs font-bold text-brand-terracotta">
                    {product.has_offer && product.offer_price
                      ? product.offer_price
                      : product.price}{" "}
                    DH
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
