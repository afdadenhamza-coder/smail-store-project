"use client";

import { useCart } from "@/lib/cart";
import { getCrossSellProducts } from "@/data/products";

export default function CrossSellStrip() {
  const { items, addItem } = useCart();
  const excludeId = items.length > 0 ? items[0].id : "";
  const crossSells = getCrossSellProducts(excludeId);

  if (crossSells.length === 0 || items.length === 0) return null;

  return (
    <div className="border-t border-border mt-3 md:mt-4 pt-3 md:pt-4">
      <p className="text-xs md:text-sm font-medium mb-2 md:mb-3">إضافة مع طلبك:</p>
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {crossSells.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-24 md:w-28">
            <div className="aspect-square bg-surface rounded-lg overflow-hidden mb-1">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] md:text-xs truncate">{product.name}</p>
            <p className="text-[10px] md:text-xs font-bold">{product.price} DH</p>
            <button
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  size: product.sizes[0],
                  image: product.images[0],
                });
              }}
              className="text-[10px] md:text-xs text-brand-terracotta font-medium mt-0.5 md:mt-1"
            >
              + أضف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
