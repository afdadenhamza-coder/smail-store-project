"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductById, getCrossSellProducts } from "@/data/products";
import { useCart } from "@/lib/cart";
import { fireAllPixels } from "@/lib/pixels";
import Stars from "@/components/Stars";
import SizeGuide from "@/components/SizeGuide";
import ProductCard from "@/components/ProductCard";
import ReviewsSection from "@/components/ReviewsSection";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product || product.is_upsell) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
        <a href="/" className="text-brand-terracotta underline">العودة للرئيسية</a>
      </div>
    );
  }

  const relatedProducts = getCrossSellProducts(product.id, 4);


  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.has_offer && product.offer_price ? product.offer_price : product.price,
      size: selectedSize,
      image: product.images[0],
    });
    fireAllPixels("AddToCart", {
      content_ids: [product.id],
      content_type: "product",
      value: product.has_offer && product.offer_price ? product.offer_price : product.price,
      currency: "MAD",
    });
    fireAllPixels("ViewContent", {
      content_ids: [product.id],
      content_type: "product",
      value: product.has_offer && product.offer_price ? product.offer_price : product.price,
      currency: "MAD",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const productUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappShareText = encodeURIComponent(
    `مرحبا، عندي سؤال على ${product.name} — ${productUrl}`
  );

  const catLabel =
    product.category === "t-shirts" ? "تيشيرتات" :
    product.category === "hoodies" ? "هوديات" :
    product.category === "pants" ? "بناطل" : "جواكيط";

  const currentPrice = product.has_offer && product.offer_price ? product.offer_price : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 pb-20 md:pb-12">
      {/* Breadcrumb */}
      <nav className="text-[10px] md:text-xs text-text-muted mb-4 md:mb-6">
        <a href="/" className="hover:text-brand-terracotta transition-colors">الرئيسية</a>
        <span className="mx-1.5">›</span>
        <a href={`/collections/${product.category}`} className="hover:text-brand-terracotta transition-colors">{catLabel}</a>
        <span className="mx-1.5">›</span>
        <span className="text-text-secondary font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-surface rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3 shadow-card relative">
            <img
              src={product.images[mainImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.has_offer && product.offer_price && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-sm">
                -{Math.round((1 - product.offer_price / product.price) * 100)}%
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${
                  i === mainImage ? "border-brand-terracotta shadow-sm" : "border-border/60 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 bg-surface px-2.5 md:px-3 py-1 rounded-full text-[10px] md:text-xs text-text-secondary mb-3 md:mb-4 w-fit">
            {catLabel}
          </div>

          <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 leading-tight">
            {product.name}
          </h1>

          <Stars rating={product.rating} reviewsCount={product.reviews_count} />

          {/* Social proof counter */}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] md:text-[11px] text-green-600 font-medium">
              {product.reviews_count} عميل اشترو هاد المنتوج
            </span>
          </div>

          <div className="flex items-baseline gap-2 md:gap-3 mt-4 md:mt-5 mb-5 md:mb-7">
            {product.has_offer && product.offer_price ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-brand-terracotta">
                  {product.offer_price} <span className="text-base md:text-lg">DH</span>
                </span>
                <span className="text-sm md:text-lg text-text-muted line-through">
                  {product.price} DH
                </span>
                <span className="text-[10px] md:text-xs bg-red-50 text-red-500 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-medium">
                  -{Math.round((1 - product.offer_price / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-bold">
                {product.price} <span className="text-base md:text-lg">DH</span>
              </span>
            )}
          </div>

          <div className="mb-5 md:mb-7">
            <div className="flex items-center justify-between mb-2 md:mb-2.5">
              <p className="text-xs md:text-sm font-medium">المقاس:</p>
              <SizeGuide sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full py-3 md:py-3.5 rounded-lg md:rounded-xl text-sm md:text-sm font-bold transition-all duration-200 ${
                selectedSize
                  ? "bg-brand-black text-white hover:bg-brand-black-light shadow-sm hover:shadow-md active:scale-[0.98]"
                  : "bg-surface text-text-muted cursor-default"
              }`}
            >
              {!selectedSize
                ? "اختيار المقاس"
                : added
                ? "✓ تمت الإضافة بنجاح"
                : `أضف للمقفولة — ${currentPrice} DH`}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-1.5 md:gap-2 mt-4 md:mt-6">
            {[
              { icon: "🚚", text: "التوصيل ف 3-5 أيام" },
              { icon: "💵", text: "الدفع عند الإستلام" },
              { icon: "🔄", text: "التبديل و الإرجاع" },
            ].map((item) => (
              <div key={item.text} className="bg-surface/70 rounded-lg md:rounded-xl p-2 md:p-3 text-center">
                <div className="text-base md:text-lg mb-0.5 md:mb-1">{item.icon}</div>
                <div className="text-[9px] md:text-[10px] text-text-secondary leading-tight">{item.text}</div>
              </div>
            ))}
          </div>

          {/* WhatsApp Ask Button */}
          <a
            href={`https://wa.me/212612345678?text=${whatsappShareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 py-2.5 border border-green-200 bg-green-50 text-green-700 rounded-xl text-xs md:text-sm font-medium hover:bg-green-100 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            اسأل على هاد المنتوج ف واتساب
          </a>

          {/* Share Button */}
          <button
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({ title: product.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("تم نسخ الرابط");
              }
            }}
            className="mt-2 flex items-center justify-center gap-2 py-2 border border-border rounded-xl text-[11px] text-text-secondary hover:bg-surface transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            شارك هاد المنتوج
          </button>

          {/* Description with Bullets */}
          <div className="mt-6 md:mt-8 pt-5 md:pt-7 border-t border-border">
            <h3 className="font-bold text-sm md:text-base mb-3">الوصف</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {[
                product.description,
                "✅ 100% قطن فاخر — ناعم على الجلد و مريح",
                "✅ خياطة متقنة — ضمان الجودة ف كل قطعة",
                "✅ قصة عصرية — تناسب جميع الإطلالات",
                "✅ غسيل آمن ف الغسالة — ما يتقلصش و ما يبهتتش",
              ].map((line, i) => (
                <li key={i} className={`text-[11px] md:text-sm ${i === 0 ? "text-text-secondary leading-relaxed mb-2" : "text-text-secondary"} ${i > 0 ? "" : "list-none"}`}>
                  {i === 0 ? line : line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10 md:mt-16">
        <ReviewsSection />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 md:mt-16">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-bold">منتجات قد تعجبك</h2>
            <a href={`/collections/${product.category}`} className="text-[11px] md:text-sm text-brand-terracotta font-medium hover:underline">
              عرض الكل ←
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add-to-Cart */}
      {isSticky && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-border/80 px-3 py-2.5 flex items-center gap-3 z-40 md:hidden shadow-premium">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-text-muted truncate">{product.name}</p>
            <p className="text-sm font-bold text-brand-terracotta">{currentPrice} DH</p>
          </div>
          {!selectedSize ? (
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="text-xs border border-border rounded-lg px-2 py-2 bg-white"
            >
              <option value="">المقاس</option>
              {product.sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1.5 rounded-lg">{selectedSize}</span>
          )}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedSize
                ? "bg-gradient-to-r from-brand-terracotta to-brand-terracotta-light text-white shadow-sm"
                : "bg-surface text-text-muted cursor-default"
            }`}
          >
            {added ? "✓" : "أضف للسلة"}
          </button>
        </div>
      )}
    </div>
  );
}
