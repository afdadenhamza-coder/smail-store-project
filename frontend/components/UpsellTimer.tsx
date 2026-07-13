"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/lib/cart";
import { getUpsellProduct } from "@/data/products";
import { submitOrder } from "@/lib/api";
import { fireAllPixels } from "@/lib/pixels";

interface UpsellTimerProps {
  customer_name: string;
  customer_phone: string;
  event_id: string;
  onComplete: (orderResult: { order_number: string }) => void;
  onClose?: () => void;
}

export default function UpsellTimer({
  customer_name,
  customer_phone,
  event_id,
  onComplete,
}: UpsellTimerProps) {
  const { items, clearCart, closeCart } = useCart();
  const upsellProduct = getUpsellProduct();
  const [seconds, setSeconds] = useState(12);
  const [accepted, setAccepted] = useState(false);
  const submittedRef = useRef(false);

  const submitOrderToBackend = useCallback(
    async (upsellAccepted: boolean) => {
      if (submittedRef.current) return;
      submittedRef.current = true;

      const orderItems = items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      if (upsellAccepted && upsellProduct) {
        orderItems.push({
          product_id: upsellProduct.id,
          product_name: upsellProduct.name,
          size: upsellProduct.sizes[0],
          quantity: 1,
          unit_price: 99,
        });
      }

      const total =
        items.reduce((s, i) => s + i.price * i.quantity, 0) +
        (upsellAccepted ? 99 : 0);

      const savedItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.image,
      }));

      if (upsellAccepted && upsellProduct) {
        savedItems.push({
          id: upsellProduct.id,
          name: upsellProduct.name,
          price: 99,
          size: upsellProduct.sizes[0],
          quantity: 1,
          image: upsellProduct.images[0],
        });
      }

      sessionStorage.setItem("last_order_items", JSON.stringify(savedItems));
      sessionStorage.setItem("last_order_total", String(total));

      try {
        const result = await submitOrder({
          customer_name,
          customer_phone,
          items: orderItems,
          upsell_accepted: upsellAccepted,
          upsell_product_id:
            upsellAccepted && upsellProduct ? upsellProduct.id : null,
          total,
          event_id,
        });

        fireAllPixels("Purchase", {
          value: total,
          currency: "MAD",
          eventID: event_id,
        });

        clearCart();
        closeCart();
        onComplete(result);
      } catch {
        clearCart();
        closeCart();
        onComplete({ order_number: "SMA-0000" });
      }
    },
    [items, customer_name, customer_phone, event_id, upsellProduct, clearCart, closeCart, onComplete]
  );

  useEffect(() => {
    if (seconds <= 0 && !accepted) {
      submitOrderToBackend(false);
    }
  }, [seconds, accepted, submitOrderToBackend]);

  useEffect(() => {
    if (accepted) return;
    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [accepted]);

  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    submitOrderToBackend(true);
  };

  const handleDecline = () => {
    if (accepted) return;
    setAccepted(true);
    submitOrderToBackend(false);
  };

  if (!upsellProduct) {
    submitOrderToBackend(false);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="w-full rounded-t-3xl border border-white/10 bg-[linear-gradient(180deg,#14141b_0%,#0a0a0e_100%)] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] animate-scale-in md:max-w-sm md:rounded-3xl md:p-8" dir="rtl" style={{ maxHeight: "92dvh", overflowY: "auto" }}>
        <div className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full inline-block mb-3 md:mb-4 animate-pulse">
          🔥 عرض خاص لطلبك الأول
        </div>

        <div className="mx-auto mb-4 aspect-square w-32 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg ring-2 ring-brand-terracotta/20 md:mb-5 md:w-40 md:rounded-2xl">
          <img
            src={upsellProduct.images[0]}
            alt={upsellProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="mb-1 text-lg font-bold text-white md:text-xl">{upsellProduct.name}</h3>
        <p className="mb-3 text-xs text-[#cfcfd5] md:mb-4 md:text-sm">
          أضف هاد المنتج لطلبك ب 99 درهم فقط!
        </p>

        <div className="flex items-center justify-center gap-2 mb-4 md:mb-5">
          <span className="text-3xl md:text-4xl font-bold text-brand-terracotta">99</span>
          <span className="text-base md:text-lg text-brand-terracotta font-medium">درهم</span>
          <span className="mr-2 text-xs text-[#8f8f9a] line-through md:text-sm">
            {upsellProduct.price} DH
          </span>
        </div>

        <div className="mb-4 md:mb-5">
          <div className="mb-1 text-xs text-[#b8b8c2] md:mb-2 md:text-sm">العرض ينتهي بعد</div>
          <div className="text-2xl md:text-3xl font-bold text-red-500 font-mono tabular-nums">
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 md:mt-3">
            <div
              className="bg-terracotta-gradient h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${(seconds / 12) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleAccept}
          className="w-full py-3 md:py-3.5 bg-terracotta-gradient text-white font-bold rounded-xl shadow-terracotta hover:shadow-lg active:scale-[0.98] transition-all text-xs md:text-sm"
        >
          نعم، أريده ب 99 درهم
        </button>

        <button
          onClick={handleDecline}
          className="mt-2 py-2 text-xs text-[#a4a4af] transition-colors hover:text-white md:mt-3 md:text-sm"
        >
          لا شكرا، أريد الطلب فقط
        </button>
      </div>
    </div>
  );
}
