"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [addedAnim, setAddedAnim] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { addItem, openCart } = useCart();
  const stock = 5;

  useEffect(() => {
    if (imgRef.current?.complete) setImageLoaded(true);
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price:
        product.has_offer && product.offer_price
          ? product.offer_price
          : product.price,
      size: selectedSize,
      image: product.images[0],
    });
    setAddedAnim(true);
    setTimeout(() => {
      setAddedAnim(false);
      openCart();
    }, 650);
  };

  const displayPrice =
    product.has_offer && product.offer_price
      ? product.offer_price
      : product.price;
  const discountPct =
    product.has_offer && product.offer_price
      ? Math.round((1 - product.offer_price / product.price) * 100)
      : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[linear-gradient(165deg,#131318,#0C0C10)] shadow-[0_12px_40px_rgba(0,0,0,0.22)] transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:border-white/[0.13]"
    >
      {/* Image Area */}
      <Link
        href={`/product/${product.id}`}
        className="relative block overflow-hidden"
      >
        <div className="aspect-square overflow-hidden bg-[#0F0F13]">
          {/* Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 to-transparent" />
          )}
          <motion.img
            ref={imgRef}
            src={product.images[0]}
            alt={product.name}
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`h-full w-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 md:left-3 md:top-3">
          {discountPct > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-2 py-1 text-[9px] font-bold text-white shadow-[0_4px_12px_rgba(239,68,68,0.35)] md:text-[10px]"
            >
              -{discountPct}%
            </motion.div>
          )}
          {isBestseller(product) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                delay: 0.1,
                stiffness: 400,
                damping: 15,
              }}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-400 px-2 py-1 text-[9px] font-bold text-white shadow-[0_4px_12px_rgba(245,158,11,0.35)] md:text-[10px]"
            >
              🔥 الأكثر مبيعا
            </motion.div>
          )}
        </div>

        {/* Stock urgency */}
        {stock <= 5 && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-black/70 px-2 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-[9px] font-medium text-red-400">
              {stock} متبقية
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="mb-1 text-sm font-bold leading-snug text-white transition-colors group-hover:text-brand-terracotta-light md:text-[15px]">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2">
          <Stars rating={product.rating} />
        </div>

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg font-black text-white md:text-xl">
            {displayPrice}
            <span className="ml-0.5 text-[10px] font-semibold text-text-muted md:text-xs">
              {" "}
              DH
            </span>
          </span>
          {discountPct > 0 && (
            <span className="text-xs text-text-muted line-through">
              {product.price} DH
            </span>
          )}
        </div>

        {/* Sizes */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {product.sizes.map((size) => (
            <motion.button
              key={size}
              onClick={() => setSelectedSize(size)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className={`h-8 w-8 rounded-lg border text-[10px] font-semibold transition-all duration-150 md:h-9 md:w-9 md:text-[11px] ${
                selectedSize === size
                  ? "border-brand-terracotta bg-brand-terracotta text-white shadow-terracotta-sm"
                  : "border-white/[0.10] bg-white/[0.04] text-text-secondary hover:border-brand-terracotta/40 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {size}
            </motion.button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <motion.button
            onClick={handleAddToCart}
            disabled={!selectedSize || addedAnim}
            whileTap={selectedSize ? { scale: 0.97 } : {}}
            className={`relative w-full overflow-hidden rounded-xl py-2.5 text-sm font-bold transition-all duration-200 md:py-3 ${
              selectedSize && !addedAnim
                ? "bg-gradient-to-r from-brand-terracotta to-brand-terracotta-light text-white shadow-terracotta-sm hover:shadow-terracotta hover:from-brand-terracotta-light hover:to-brand-gold-deep"
                : addedAnim
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "cursor-default bg-white/[0.05] text-text-muted"
            }`}
          >
            <AnimatePresence mode="wait">
              {addedAnim ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center justify-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  تمت الإضافة!
                </motion.span>
              ) : !selectedSize ? (
                <motion.span
                  key="select"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  اختيار المقاس
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-1.5"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  اطلب دابا
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
