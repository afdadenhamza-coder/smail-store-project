"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { generateEventId } from "@/lib/utils";
import { fireAllPixels } from "@/lib/pixels";
import PhoneInput from "./PhoneInput";
import { validateMoroccanPhone, formatPhone } from "@/lib/validation";

const MOROCCAN_CITIES = [
  "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة",
  "أكادير", "مكناس", "وجدة", "تطوان", "سلا",
  "القنيطرة", "تازة", "الحسيمة", "بني ملال", "خريبكة",
  "الجديدة", "آسفي", "اليوسفية", "الناظور", "تاوريرت",
  "الصويرة", "ورزازات", "الرشيدية", "وزان", "شفشاون",
  "تارودانت", "طانطان", "بوجدور", "الداخلة", "العيون",
];

const WILAYAS = [
  "الدار البيضاء-سطات", "الرباط-سلا-القنيطرة", "مراكش-آسفي",
  "فاس-مكناس", "طنجة-تطوان-الحسيمة", "أكادير-تارودانت-تيزنيت",
  "الشرق (وجدة)", "بني ملال-خنيفرة", "درعة-تافيلالت",
  "سوس-ماسة", "كلميم-واد نون", "العيون-الساقية الحمراء", "الداخلة-وادي الذهب",
];

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowUpsell: (data: {
    customer_name: string;
    customer_phone: string;
    event_id: string;
  }) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onShowUpsell,
}: CheckoutModalProps) {
  const { items, total } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [address, setAddress] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (value.length === 10 || value.length === 0) {
      setPhoneError("");
    }
  };

  const validate = (): boolean => {
    let valid = true;
    if (!name.trim()) valid = false;
    if (!city) valid = false;
    const cleanPhone = formatPhone(phone);
    if (!validateMoroccanPhone(cleanPhone)) {
      setPhoneError("الرجاء إدخال رقم هاتف صحيح");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    const event_id = generateEventId();
    const customer_phone = formatPhone(phone);
    const customer_name = name.trim();
    fireAllPixels("InitiateCheckout", { event_id });
    setTimeout(() => {
      onShowUpsell({ customer_name, customer_phone, event_id });
      setSubmitting(false);
    }, 500);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (name || phone) {
        if (confirm("هل تريد إلغاء الطلب؟")) {
          onClose();
        }
      } else {
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full rounded-t-2xl border border-white/10 bg-[linear-gradient(180deg,#16161d_0%,#0b0b0f_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] animate-scale-in md:mx-4 md:max-w-md md:rounded-2xl"
        dir="rtl"
        style={{ maxHeight: "90dvh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-brand-black rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-white md:text-lg">معلومات التوصيل</h2>
          </div>
          <button
            onClick={() => {
              if (name || phone) {
                if (confirm("هل تريد إلغاء الطلب؟")) onClose();
              } else {
                onClose();
              }
            }}
            className="rounded-xl p-1.5 text-[#cfcfd5] transition-colors hover:bg-white/10 md:p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2.5 md:space-y-3">
          <div>
            <label className="block text-[11px] md:text-xs font-semibold mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الكامل"
              autoComplete="name"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-border rounded-lg md:rounded-xl text-sm outline-none focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] md:text-xs font-semibold mb-1">
              رقم الهاتف
            </label>
            <PhoneInput value={phone} onChange={handlePhoneChange} error={phoneError} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] md:text-xs font-semibold mb-1">
                المدينة
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 md:py-3 border border-border rounded-lg md:rounded-xl text-sm outline-none focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta/20 transition-all bg-white"
              >
                <option value="">اختر المدينة</option>
                {MOROCCAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] md:text-xs font-semibold mb-1">
                الجهة
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full px-3 py-2.5 md:py-3 border border-border rounded-lg md:rounded-xl text-sm outline-none focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta/20 transition-all bg-white"
              >
                <option value="">اختر الجهة</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] md:text-xs font-semibold mb-1">
              العنوان (اختياري)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="الزنقة، رقم البناية، الطابق..."
              className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-border rounded-lg md:rounded-xl text-sm outline-none focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta/20 transition-all"
            />
          </div>
        </div>

        {/* Order Summary with Thumbnails */}
        {items.length > 0 && (
          <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-[rgba(10,10,13,0.95)] p-3 md:mt-5 md:rounded-xl md:p-4">
            <p className="text-[10px] font-semibold text-[#cfcfd5] md:text-xs">منتجات طلبك</p>
            {items.map((item, i) => (
              <div key={`${item.id}-${item.size}-${i}`} className="flex items-center gap-2.5">
                <div className="flex-shrink-0 h-9 w-9 overflow-hidden rounded-lg bg-white/10 shadow-sm md:h-10 md:w-10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium text-white md:text-[11px]">{item.name}</p>
                  <p className="text-[9px] text-[#a4a4af]">المقاس: {item.size} × {item.quantity}</p>
                </div>
                <p className="text-[10px] md:text-[11px] font-bold shrink-0">
                  {item.price} <span className="text-[8px]">DH</span>
                </p>
              </div>
            ))}
            <div className="border-t border-border/60 pt-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#cfcfd5] md:text-xs">المجموع</span>
              <span className="text-sm font-bold text-white md:text-base">{total()} DH</span>
            </div>
          </div>
        )}

        {/* Trust Strip */}
        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[9px] text-[#b8b8c2] md:text-[10px]">
          <span>🔒</span>
          <span>طلبك آمن 100% — ما كنخزنو والو من المعلومات البنكية</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full mt-3 md:mt-4 py-3 md:py-3.5 rounded-lg md:rounded-xl text-sm md:text-base font-bold shadow-terracotta transition-all ${
            submitting
              ? "cursor-not-allowed bg-white/10 text-gray-400 shadow-none"
              : "bg-terracotta-gradient text-white hover:shadow-lg active:scale-[0.98]"
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              جاري التحميل...
            </span>
          ) : (
            "أكد الطلب — الدفع عند الإستلام"
          )}
        </button>
      </div>
    </div>
  );
}
