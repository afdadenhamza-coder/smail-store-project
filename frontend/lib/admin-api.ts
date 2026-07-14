const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("admin_token");
}

export function isAdminLoggedIn(): boolean {
  return !!getToken();
}

export function logout(): void {
  sessionStorage.removeItem("admin_token");
}

async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    sessionStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Session expired");
  }
  return res;
}

export interface DashboardStats {
  total_clicks: number;
  valid_clicks: number;
  total_orders: number;
  confirmed_orders: number;
  total_revenue: number;
  conversion_rate: number;
  avg_order_value: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  product_name: string;
  quantity: number;
  revenue: number;
  image?: string;
}

export interface OrderStatusDist {
  status: string;
  count: number;
  label: string;
}

export interface DetailedStats {
  today_revenue: number;
  today_orders: number;
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  returned_orders: number;
  valid_clicks: number;
  total_clicks: number;
  conversion_rate: number;
  avg_order_value: number;
  revenue_chart: DailyRevenue[];
  top_products: TopProduct[];
  status_distribution: OrderStatusDist[];
}

export interface ProfitCalcInput {
  selling_price: number;
  product_cost: number;
  shipping_cost: number;
  packaging_cost: number;
  cod_fee: number;
  platform_commission_pct: number;
  platform_commission_fixed: number;
  tax_pct: number;
}

export interface ProfitCalcOutput {
  total_cost: number;
  platform_commission_amount: number;
  tax_amount: number;
  net_profit: number;
  profit_margin_pct: number;
  markup_pct: number;
  break_even: number;
}

export interface OrderListItemData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  upsell_accepted: boolean;
  items: Record<string, unknown>[];
  items_count: number;
  created_at: string;
}

export interface OrderListResponse {
  orders: OrderListItemData[];
  total: number;
  page: number;
  per_page: number;
}

export interface OrderDetail {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  items: Record<string, unknown>[];
  total: number;
  status: string;
  upsell_accepted: boolean;
  upsell_product_id: string | null;
  event_id: string;
  client_ip: string | null;
  client_user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  sessionStorage.setItem("admin_token", data.token);
  return data.token;
}

export async function fetchStats(
  startDate?: string,
  endDate?: string,
): Promise<DashboardStats> {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const res = await authFetch(`${API_BASE}/api/admin/stats?${params}`);
  return res.json();
}

export async function fetchDetailedStats(): Promise<DetailedStats> {
  const res = await authFetch(`${API_BASE}/api/admin/stats/detailed`);
  return res.json();
}

export async function calculateProfit(
  input: ProfitCalcInput,
): Promise<ProfitCalcOutput> {
  const res = await authFetch(`${API_BASE}/api/admin/profit/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function fetchOrders(params: {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}): Promise<OrderListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);
  if (params.start_date) searchParams.set("start_date", params.start_date);
  if (params.end_date) searchParams.set("end_date", params.end_date);
  const res = await authFetch(`${API_BASE}/api/admin/orders?${searchParams}`);
  return res.json();
}

export async function fetchOrderDetail(id: string): Promise<OrderDetail> {
  const res = await authFetch(`${API_BASE}/api/admin/orders/${id}`);
  return res.json();
}

export async function updateOrderStatus(
  id: string,
  status: string,
): Promise<void> {
  await authFetch(`${API_BASE}/api/admin/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

// Product Management

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  offer_price?: number;
  has_offer: boolean;
  images: string[];
  sizes?: string[];
  description?: string;
  category?: string;
  is_active: boolean;
  is_featured: boolean;
  is_upsell: boolean;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  offer_price?: number;
  has_offer: boolean;
  images: string[];
  sizes?: string[];
  category?: string;
  is_active: boolean;
  is_featured: boolean;
  is_upsell: boolean;
  rating?: number;
  reviews_count?: number;
}

export interface ProductUpdateData {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  offer_price?: number;
  has_offer?: boolean;
  images?: string[];
  sizes?: string[];
  category?: string;
  is_active?: boolean;
  is_featured?: boolean;
  is_upsell?: boolean;
  rating?: number;
  reviews_count?: number;
}

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await authFetch(`${API_BASE}/api/admin/products`);
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await authFetch(`${API_BASE}/api/admin/products/${id}`);
  return res.json();
}

export async function createProduct(data: ProductCreateData): Promise<Product> {
  const res = await authFetch(`${API_BASE}/api/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to create product");
  }
  return res.json();
}

export async function updateProduct(
  id: string,
  data: ProductUpdateData,
): Promise<Product> {
  const res = await authFetch(`${API_BASE}/api/admin/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    try {
      const error = await res.json();
      throw new Error(error.detail || "Failed to update product");
    } catch (e: any) {
      if (e.message) throw e;
      throw new Error(`Server error: ${res.status}`);
    }
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await authFetch(`${API_BASE}/api/admin/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to delete product");
  }
}

export async function trackClick(
  path: string,
  sessionId?: string,
): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/admin/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, session_id: sessionId }),
    });
  } catch {
    // Silent fail for tracking
  }
}
