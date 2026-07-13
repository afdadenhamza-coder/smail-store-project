"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { Product } from "@/lib/api";
import Link from "next/link";
import Stars from "./Stars";

interface ProductCardProps {
  product: Product;
  _featured?: boolean;
}

function isBestseller(product: Product): boolean {
  return product.reviews_count >= 100;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { addItem, openCart } = useCart();
  const stock = 5;

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.has_offer && product.offer_price ? product.offer_price : product.price,
      size: selectedSize,
      image: product.images[0],
    });
    openCart();
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0F0F12] shadow-[0_16px_45px_rgba(0,0,0,0.24)]"
    >
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square overflow-hidden bg-[#121216]">
          <motion.img
            ref={imgRef}
            src={product.images[0]}
            alt={product.name}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`h-full w-full object-cover transition duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {product.has_offer && product.offer_price && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className="absolute right-2 top-2 rounded-full bg-red-500/90 px-2.5 py-1 text-[9px] font-bold text-white md:right-3 md:top-3 md:px-3 md:text-[10px]">
            -{Math.round((1 - product.offer_price / product.price) * 100)}%
          </motion.div>
        )}

        {isBestseller(product) && (
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-[8px] font-bold text-white shadow-sm md:left-3 md:top-3 md:px-2.5 md:text-[9px]">
            🔥 الأكثر مبيعا
          </motion.div>
        )}
      </Link>

      <div className="p-3 md:p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-1 text-sm font-semibold leading-tight text-white transition-colors group-hover:text-brand-terracotta md:text-[15px]">
            {product.name}
          </h3>
        </Link>
        <Stars rating={product.rating} reviewsCount={product.reviews_count} />

        <div className="mt-2 flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${stock <= 3 ? "animate-pulse bg-red-500" : "bg-amber-400"}`} />
          <span className={`text-[10px] md:text-[11px] ${stock <= 3 ? "font-medium text-red-400" : "text-amber-400"}`}>
            متبقي غير {stock} وحدات
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 md:mt-3">
          {product.has_offer && product.offer_price ? (
            <>
              <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-lg font-bold text-brand-terracotta md:text-xl">
                {product.offer_price} <span className="text-[10px] md:text-xs">DH</span>
              </motion.span>
              <span className="text-[10px] text-text-muted line-through md:text-sm">{product.price} DH</span>
            </>
          ) : (
            <span className="text-lg font-bold text-white md:text-xl">
              {product.price} <span className="text-[10px] md:text-xs">DH</span>
            </span>
          )}
        </div>

        <div className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
          <div className="flex gap-1.5 md:gap-2">
            {product.sizes.map((size) => (
              <motion.button
                key={size}
                onClick={() => setSelectedSize(size)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`h-8 w-8 rounded-lg border text-[10px] font-medium transition-colors md:h-9 md:w-9 md:text-[11px] ${
                  selectedSize === size
                    ? "border-brand-terracotta bg-brand-terracotta text-white shadow-sm"
                    : "border-white/10 bg-white/5 text-gray-300 hover:border-brand-terracotta/40 hover:text-white"
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
          <motion.button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            whileHover={selectedSize ? { scale: 1.02 } : {}}
            whileTap={selectedSize ? { scale: 0.98 } : {}}
            className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 md:py-3 ${
              selectedSize
                ? "bg-gradient-to-r from-brand-terracotta to-brand-gold/90 text-white shadow-[0_10px_25px_rgba(192,112,64,0.25)] hover:shadow-[0_12px_32px_rgba(192,112,64,0.35)]"
                : "cursor-default bg-white/5 text-text-muted"
            }`}
          >
            {!selectedSize ? "اختيار المقاس" : "اطلب دابا"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
