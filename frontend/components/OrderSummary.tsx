"use client";

import { useCart } from "@/lib/cart";

export default function OrderSummary() {
  const { items, total } = useCart();

  return (
    <div className="border-t border-border pt-4 mt-4">
      <div className="space-y-2 text-sm">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex justify-between text-text-secondary">
            <span className="truncate max-w-[70%]">
              {item.name} (x{item.quantity})
            </span>
            <span>{item.price * item.quantity} DH</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
        <span className="font-bold">المجموع</span>
        <span className="font-bold text-lg">{total()} DH</span>
      </div>
    </div>
  );
}
