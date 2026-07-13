"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  isAdminLoggedIn, fetchOrders, fetchOrderDetail, updateOrderStatus,
  OrderDetail, OrderListResponse, trackClick,
} from "@/lib/admin-api";

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
  returned: "مرتجع",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/20",
  shipped: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/20",
  returned: "bg-orange-500/20 text-orange-400 border-orange-500/20",
};

const STATUS_FLOW = ["pending", "confirmed", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [data, setData] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !isAdminLoggedIn()) {
      router.replace("/admin/login");
      return;
    }
    trackClick("/admin/orders");
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchOrders({
        page,
        per_page: 15,
        status: statusFilter || undefined,
        search: search || undefined,
        start_date: dateFrom || undefined,
        end_date: dateTo || undefined,
      });
      setData(result);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, dateFrom, dateTo]);

  const handleSearch = () => {
    setPage(1);
    loadOrders();
  };

  const openPreview = async (id: string) => {
    setPreviewLoading(true);
    try {
      const detail = await fetchOrderDetail(id);
      setSelectedOrder(detail);
    } catch {
      // handled
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      loadOrders();
    } catch {
      // handled
    }
  };

  const totalPages = data ? Math.ceil(data.total / data.per_page) : 1;
  const orders = data?.orders || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white">الطلبات</h1>
          <p className="text-[10px] text-gray-600 mt-0.5">{data ? `إجمالي ${data.total} طلب` : "جاري التحميل..."}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-terracotta/50 min-w-[120px]"
          >
            <option value="">جميع الحالات</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-terracotta/50"
          />
          <span className="text-[10px] text-gray-600">إلى</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-terracotta/50"
          />
          <div className="flex gap-2 flex-1 min-w-[200px] max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="بحث بالاسم أو رقم الطلب..."
              className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-terracotta/50"
            />
            <button onClick={handleSearch} className="px-4 py-2 bg-brand-terracotta text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all">
              بحث
            </button>
          </div>
          {(statusFilter || search || dateFrom) && (
            <button
              onClick={() => { setStatusFilter(""); setSearch(""); setDateFrom(""); setDateTo(""); setPage(1); }}
              className="text-[10px] text-gray-500 hover:text-white transition-colors"
            >
              إلغاء الفلتر
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0E0E10] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-600">
                <th className="text-right p-3 font-medium text-[10px]">رقم الطلب</th>
                <th className="text-right p-3 font-medium text-[10px]">الزبون</th>
                <th className="text-right p-3 font-medium text-[10px]">الهاتف</th>
                <th className="text-center p-3 font-medium text-[10px]">المنتجات / المقاس</th>
                <th className="text-right p-3 font-medium text-[10px]">المبلغ</th>
                <th className="text-right p-3 font-medium text-[10px]">الحالة</th>
                <th className="text-right p-3 font-medium text-[10px]">التاريخ</th>
                <th className="text-right p-3 font-medium text-[10px]"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center p-8 text-gray-500 text-xs">جاري التحميل...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center p-8 text-gray-500 text-xs">ما كاينش طلبات</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-3">
                    <span className="text-white font-semibold text-[11px]">{order.order_number}</span>
                    {order.upsell_accepted && (
                      <span className="mr-1 text-[8px] text-green-500 bg-green-500/10 px-1 py-0.5 rounded">UPS</span>
                    )}
                  </td>
                  <td className="p-3 text-white text-[11px]">{order.customer_name}</td>
                  <td className="p-3 text-gray-400 text-[11px]" dir="ltr">{order.customer_phone}</td>
                  <td className="p-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      {order.items && Array.isArray(order.items) ? (
                        order.items.map((item: { product_name?: string; size?: string; quantity?: number }, i: number) => (
                          <span key={i} className="text-[9px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded whitespace-nowrap">
                            {item.product_name?.slice(0, 12) || ""} <span className="text-brand-terracotta">{item.size || "—"}</span> ×{item.quantity || 1}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{order.items_count}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-white font-semibold text-[11px]">{order.total.toFixed(2)} DH</td>
                  <td className="p-3">
                    <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status] || "bg-gray-500/20 text-gray-400"}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-[10px] whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("ar-MA")}
                    <br />
                    <span className="text-[8px] text-gray-700">{new Date(order.created_at).toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" })}</span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => openPreview(order.id)}
                      className="text-[10px] px-2.5 py-1 bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20 rounded-lg hover:bg-brand-terracotta/20 transition-all"
                    >
                      عرض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3 border-t border-white/5">
          <div className="text-[9px] text-gray-700">
            {data ? `الصفحة ${data.page} من ${totalPages} (${data.total} طلب)` : ""}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              السابق
            </button>
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-6 h-6 rounded-lg text-[10px] font-medium transition-all ${
                      pageNum === page
                        ? "bg-brand-terracotta text-white"
                        : "bg-white/5 text-gray-500 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              التالي
            </button>
          </div>
        </div>
      </div>

      {/* Order Preview Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0E0E10] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-white">{selectedOrder.order_number}</h3>
                <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[selectedOrder.status]}`}>
                  {STATUS_LABELS[selectedOrder.status]}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {previewLoading ? (
                <div className="text-center text-gray-500 text-xs py-8">جاري التحميل...</div>
              ) : (
                <>
                  {/* Status Timeline */}
                  <div>
                    <h4 className="text-[9px] text-gray-600 mb-2 font-medium uppercase tracking-wider">تتبع الطلب</h4>
                    <div className="flex items-center gap-0">
                      {STATUS_FLOW.map((s, i) => {
                        const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status);
                        const isReached = i <= currentIdx;
                        const isCancelled = selectedOrder.status === "cancelled" || selectedOrder.status === "returned";
                        return (
                          <div key={s} className="flex-1 flex items-center">
                            <div className={`flex items-center justify-center w-full relative`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${
                                isCancelled ? "border-red-500/30 text-red-400" :
                                isReached ? "border-brand-terracotta bg-brand-terracotta/20 text-brand-terracotta" : "border-white/10 text-gray-600"
                              }`}>
                                {isReached && !isCancelled ? "✓" : i + 1}
                              </div>
                              <span className={`absolute -bottom-4 text-[7px] whitespace-nowrap ${
                                isReached ? "text-gray-400" : "text-gray-700"
                              }`}>
                                {STATUS_LABELS[s]}
                              </span>
                            </div>
                            {i < STATUS_FLOW.length - 1 && (
                              <div className={`flex-1 h-[2px] mx-1 mt-[-12px] ${
                                isReached && !isCancelled ? "bg-brand-terracotta/40" : "bg-white/5"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {(selectedOrder.status === "cancelled" || selectedOrder.status === "returned") && (
                      <div className="mt-6 text-center">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[selectedOrder.status]}`}>
                          {STATUS_LABELS[selectedOrder.status]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h4 className="text-[9px] text-gray-600 mb-2 font-medium uppercase tracking-wider">معلومات الزبون</h4>
                    <div className="bg-[#0A0A0A] rounded-xl p-3 space-y-2 border border-white/5">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-500">الاسم</span>
                        <span className="text-[10px] text-white font-medium">{selectedOrder.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-500">الهاتف</span>
                        <span className="text-[10px] text-white font-medium" dir="ltr">{selectedOrder.customer_phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-500">IP</span>
                        <span className="text-[10px] text-gray-400" dir="ltr">{selectedOrder.client_ip || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="text-[9px] text-gray-600 mb-2 font-medium uppercase tracking-wider">المنتجات</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item: Record<string, unknown>, i: number) => (
                        <div key={i} className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="text-xs text-white font-medium truncate">{item.product_name as string}</div>
                              <div className="text-[9px] text-gray-600 mt-0.5">
                                {String(item.size ?? "")} × {Number(item.quantity) || 1}
                                {Boolean(item.unit_price) && <span className="mr-2">@ {Number(item.unit_price).toFixed(2)} DH</span>}
                              </div>
                            </div>
                            <div className="text-xs text-white font-semibold shrink-0 mr-2">
                              {((Number(item.unit_price) || 0) * (Number(item.quantity) || 1)).toFixed(2)} DH
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-brand-terracotta/10 border border-brand-terracotta/20 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs text-brand-terracotta font-bold">المجموع</span>
                    <span className="text-sm text-brand-terracotta font-bold">{selectedOrder.total.toFixed(2)} DH</span>
                  </div>

                  {selectedOrder.upsell_accepted && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                      <span className="text-[10px] text-emerald-400">✓ تم قبول الأبسيل</span>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h4 className="text-[9px] text-gray-600 mb-2 font-medium uppercase tracking-wider">تحديث الحالة</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(STATUS_LABELS).map(([k, v]) => {
                        const isActive = selectedOrder.status === k;
                        return (
                          <button
                            key={k}
                            onClick={() => handleStatusChange(selectedOrder.id, k)}
                            disabled={isActive}
                            className={`text-[9px] px-2.5 py-1.5 rounded-lg border transition-all ${
                              isActive
                                ? "bg-brand-terracotta/20 text-brand-terracotta border-brand-terracotta/30"
                                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="border-t border-white/5 pt-3 flex justify-between text-[8px] text-gray-700">
                    <span>ID: {selectedOrder.event_id?.slice(0, 8)}...</span>
                    <span>{new Date(selectedOrder.created_at).toLocaleString("ar-MA")}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
