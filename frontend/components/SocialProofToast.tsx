"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const names = [
  "أحمد", "يوسف", "عمر", "مهدي", "كريم",
  "إسماعيل", "أسامة", "حمزة", "أمين", "أنس",
  "رضوان", "سفيان", "عادل", "نبيل", "هشام",
];
const cities = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة",
  "أكادير", "مكناس", "وجدة", "تطوان", "سلا",
];
const products = [
  "تيشيرت كلاسيك أسود", "تيشيرت أوفرサイズ أبيض", "هودي بريميوم رمادي",
  "هودي أوفرサイズ أسود", "بنطلون كارغو بيج", "جاكيت دينيم كلاسيك",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [product, setProduct] = useState("");

  const show = useCallback(() => {
    setName(randomItem(names));
    setCity(randomItem(cities));
    setProduct(randomItem(products));
    setVisible(true);
    setTimeout(() => setVisible(false), 4500);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => show(), 3000);
    const interval = setInterval(() => {
      show();
    }, 20000);
    return () => {
      clearTimeout(t1);
      clearInterval(interval);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-20 md:bottom-24 left-4 z-50 max-w-[260px] md:max-w-xs"
        >
          <div className="bg-white rounded-xl shadow-premium border border-border/60 p-3 flex items-center gap-3 backdrop-blur-sm bg-white/95">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] leading-tight">
                <span className="font-bold">{name}</span>
                <span className="text-text-muted"> من </span>
                <span className="font-bold">{city}</span>
              </p>
              <p className="text-[10px] text-text-muted truncate">
                طلب {product}
              </p>
              <p className="text-[8px] text-emerald-500 font-medium mt-0.5">منذ دقيقة</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
