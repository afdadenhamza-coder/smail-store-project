"use client";

import { useParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categoryNames: Record<string, string> = {
  "t-shirts": "تيشيرتات",
  "hoodies": "هوديات",
  "pants": "بناطل",
  "jackets": "جواكيط",
};

const categoryDescriptions: Record<string, string> = {
  "t-shirts": "جودة عالمية بشهادة الجودة — تيشيرتات تناسب جميع الإطلالات",
  "hoodies": "جودة عالمية بشهادة الجودة — هوديات مريحة و دافئة للستايل العصري",
  "pants": "جودة عالمية بشهادة الجودة — بناطل كارغو و جينز بقياسات عصرية",
  "jackets": "جودة عالمية بشهادة الجودة — جواكيط دينيم و شتوية بجودة ممتازة",
};

const categoryHeroImages: Record<string, string> = {
  "t-shirts": "/images/Tshirts Collection.jpg",
  "hoodies": "/images/Hoodie.jpg",
  "pants": "/images/insta post.jpg",
  "jackets": "/images/Jacket.jpg",
};

export default function CollectionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = categoryNames[slug] || slug;
  const description = categoryDescriptions[slug] || "";
  const heroImage = categoryHeroImages[slug] || "/images/Collection.jpg";
  const categoryProducts = products.filter(
    (p) => p.category === slug && !p.is_upsell
  );

  const categories = Object.entries(categoryNames);

  return (
    <div>
      {/* Category Hero */}
      <section className="relative h-36 md:h-64 bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImage} alt={categoryName} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white">{categoryName}</h1>
          {description && (
            <p className="text-xs md:text-base text-gray-400 mt-1 md:mt-2 max-w-md">{description}</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Category Nav */}
        <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(([key, name]) => (
            <a
              key={key}
              href={`/collections/${key}`}
              className={`px-4 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                key === slug
                  ? "bg-brand-black text-white shadow-sm"
                  : "bg-surface text-text-secondary hover:bg-border/60"
              }`}
            >
              {name}
            </a>
          ))}
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-16 md:py-20 text-text-muted">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-sm md:text-base font-medium">لا توجد منتجات في هاد القسم</p>
            <p className="text-xs md:text-sm text-text-muted/70 mt-1">قريبا إن شاء الله</p>
          </div>
        ) : (
          <>
            <p className="text-xs md:text-sm text-text-secondary mb-4 md:mb-6">
              {categoryProducts.length} منتجات
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
