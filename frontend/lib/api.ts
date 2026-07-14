const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  offer_price: number | null;
  has_offer: boolean;
  images: string[];
  sizes: string[];
  category: string | null;
  description: string | null;
  is_upsell: boolean;
  is_featured: boolean;
  rating: number;
  reviews_count: number;
}

export interface OrderRequest {
  customer_name: string;
  customer_phone: string;
  items: {
    product_id: string;
    product_name: string;
    size: string;
    quantity: number;
    unit_price: number;
  }[];
  upsell_accepted: boolean;
  upsell_product_id: string | null;
  total: number;
  event_id: string;
}

export interface OrderResponse {
  order_id: string;
  order_number: string;
  status: string;
  message: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products/featured`);
  if (!res.ok) throw new Error("Failed to fetch featured products");
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/by-slug/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products/by-category/${category}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function submitOrder(data: OrderRequest): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create order");
  }
  return res.json();
}
