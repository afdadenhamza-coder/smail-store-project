"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import CartItem from "./CartItem";
import CrossSellStrip from "./CrossSellStrip";
import OrderSummary from "./OrderSummary";

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { isOpen, closeCart, items } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm md:max-w-md bg-[linear-gradient(180deg,#121218_0%,#09090c_100%)] z-50 transform transition-all duration-300 shadow-[0_24px_80px_rgba(0,0,0,0.35)] border-l border-white/10 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-white/10">
            <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              المقفولة
              {items.length > 0 && (
                <span className="text-xs md:text-sm text-text-muted font-normal">
                  ({items.length})
                </span>
              )}
            </h2>
            <button
              onClick={closeCart}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded-xl transition-colors text-[#cfcfd5]"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#cfcfd5]">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/8 rounded-full flex items-center justify-center mb-4 md:mb-5 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                </div>
                <p className="text-xs md:text-sm mb-1">المقفولة ديالك فاضية</p>
                <p className="text-[10px] md:text-xs text-[#a4a4af] mb-4">ضيف بعض المنتجات الرائعة!</p>
                <button
                  onClick={closeCart}
                  className="px-5 md:px-6 py-2 md:py-2.5 bg-brand-black text-white text-xs md:text-sm font-medium rounded-xl hover:bg-brand-black-light transition-colors"
                >
                  تسوق الآن
                </button>
              </div>
            ) : (
              <div className="py-2 md:py-3">
                {items.map((item) => (
                  <CartItem key={`${item.id}-${item.size}`} {...item} />
                ))}
                <CrossSellStrip />
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-white/10 px-4 md:px-5 py-3 md:py-4 bg-[rgba(12,12,16,0.95)] shadow-[0_-8px_30px_rgba(0,0,0,0.18)]">
              <OrderSummary />
              <button
                onClick={onCheckout}
                className="w-full mt-3 md:mt-4 py-3 md:py-3.5 bg-terracotta-gradient text-white font-bold rounded-xl shadow-terracotta hover:shadow-lg active:scale-[0.98] transition-all text-sm md:text-base"
              >
                إتمام الطلب
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
