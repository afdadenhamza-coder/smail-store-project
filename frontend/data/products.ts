import { Product } from "@/lib/api";

export const products: Product[] = [
  {
    id: "prod-1",
    name: "تيشيرت كلاسيك أسود",
    slug: "t-shirt-classic-noir",
    price: 299,
    offer_price: 249,
    has_offer: true,
    images: ["/images/Collection.jpg", "/images/Tshirts Collection.jpg"],
    sizes: ["S", "M", "L", "XL"],
    category: "t-shirts",
    description:
      "تيشيرت كلاسيك بجودة عالية. مصنوع من القطن الفاخر 100%، مناسب لجميع الإطلالات. متوفر بعدة مقاسات.",
    is_upsell: false,
    is_featured: true,
    rating: 4.8,
    reviews_count: 127,
  },
  {
    id: "prod-2",
    name: "تيشيرت أوفرサイズ أبيض",
    slug: "t-shirt-oversized-blanc",
    price: 349,
    offer_price: null,
    has_offer: false,
    images: ["/images/Collection 1.jpg", "/images/Tshirts Collection.jpg"],
    sizes: ["S", "M", "L", "XL"],
    category: "t-shirts",
    description:
      "تيشيرت أوفرサイズ بقصة عصرية. مريح و أنيق، مناسب للإطلالات الكاجوال و الستريت وير.",
    is_upsell: false,
    is_featured: true,
    rating: 4.7,
    reviews_count: 98,
  },
  {
    id: "prod-3",
    name: "هودي بريميوم رمادي",
    slug: "hoodie-premium-gris",
    price: 599,
    offer_price: 499,
    has_offer: true,
    images: ["/images/Hoodie.jpg", "/images/2PAC Hoodie.jpg"],
    sizes: ["M", "L", "XL"],
    category: "hoodies",
    description:
      "هودي بريميوم بجودة استثنائية. قماش ثقيل و دافئ، مناسب لفصل الشتاء. جيوب أمامية و غطاء رأس.",
    is_upsell: false,
    is_featured: true,
    rating: 4.9,
    reviews_count: 203,
  },
  {
    id: "prod-4",
    name: "هودي أوفرサイズ أسود",
    slug: "hoodie-oversized-noir",
    price: 649,
    offer_price: null,
    has_offer: false,
    images: ["/images/Black Sweatshirt.jpg", "/images/2PAC Hoodie.jpg"],
    sizes: ["M", "L", "XL"],
    category: "hoodies",
    description:
      "هودي أوفرサイズ بقصة عصرية. مريح جداً و مناسب للإطلالات الجريئة. جودة عالية و خامة فاخرة.",
    is_upsell: false,
    is_featured: true,
    rating: 4.6,
    reviews_count: 156,
  },
  {
    id: "prod-5",
    name: "بنطلون كارغو بيج",
    slug: "pant-cargo-beige",
    price: 449,
    offer_price: 399,
    has_offer: true,
    images: ["/images/insta post.jpg", "/images/insta post1.jpg"],
    sizes: ["S", "M", "L", "XL"],
    category: "pants",
    description:
      "بنطلون كارغو بقصة عصرية. جيوب متعددة و قماش متين. مناسب للإطلالات اليومية و الستريت وير.",
    is_upsell: false,
    is_featured: false,
    rating: 4.7,
    reviews_count: 89,
  },
  {
    id: "prod-6",
    name: "جاكيت دينيم كلاسيك",
    slug: "jacket-denim-classic",
    price: 799,
    offer_price: null,
    has_offer: false,
    images: ["/images/Jacket.jpg", "/images/Collection.jpg"],
    sizes: ["S", "M", "L", "XL"],
    category: "jackets",
    description:
      "جاكيت دينيم كلاسيك بجودة عالية. تصميم خالد يناسب جميع الإطلالات. متوفر بعدة مقاسات.",
    is_upsell: false,
    is_featured: false,
    rating: 4.5,
    reviews_count: 67,
  },
  {
    id: "upsell-1",
    name: "قبعة Smail بريميوم",
    slug: "cap-smail-premium",
    price: 199,
    offer_price: null,
    has_offer: false,
    images: ["/images/insta post.jpg"],
    sizes: ["M", "L"],
    category: "accessories",
    description: "قبعة بريميوم بتصميم عصري. تطريز شعار Smail Store.",
    is_upsell: true,
    is_featured: false,
    rating: 4.9,
    reviews_count: 45,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category && !p.is_upsell);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => !p.is_upsell).slice(0, 4);
}

export function getUpsellProduct(): Product | undefined {
  return products.find((p) => p.is_upsell);
}

export function getCrossSellProducts(excludeId: string, count = 3): Product[] {
  return products
    .filter((p) => p.id !== excludeId && !p.is_upsell)
    .slice(0, count);
}
