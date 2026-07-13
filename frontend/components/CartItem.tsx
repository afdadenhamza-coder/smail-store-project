"use client";

import { useCart } from "@/lib/cart";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export default function CartItem({
  id,
  name,
  price,
  size,
  quantity,
  image,
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3.5 py-4 border-b border-border/60 last:border-b-0">
      <div className="w-20 h-20 bg-surface rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold truncate">{name}</h4>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs bg-surface px-2 py-0.5 rounded-md text-text-secondary">
            {size}
          </span>
          <span className="text-xs text-text-muted">المقاس: {size}</span>
        </div>
        <p className="text-sm font-bold mt-1.5">{price} DH</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(id, size, quantity - 1)}
              className="px-2.5 py-1 text-sm hover:bg-surface transition-colors"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm min-w-[28px] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(id, size, quantity + 1)}
              className="px-2.5 py-1 text-sm hover:bg-surface transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(id, size)}
            className="text-xs text-text-muted hover:text-red-500 transition-colors"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
