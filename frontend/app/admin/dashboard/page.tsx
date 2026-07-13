"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { isAdminLoggedIn, fetchDetailedStats, DetailedStats, trackClick } from "@/lib/admin-api";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "قيد المراجعة", color: "#F59E0B" },
  confirmed: { label: "مؤكد", color: "#10B981" },
  shipped: { label: "تم الشحن", color: "#3B82F6" },
  delivered: { label: "تم التوصيل", color: "#059669" },
  cancelled: { label: "ملغي", color: "#EF4444" },
  returned: { label: "مرتجع", color: "#F97316" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const easeArr: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeArr } },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !isAdminLoggedIn()) {
      router.replace("/admin/login");
      return;
    }
    trackClick("/admin/dashboard");
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDetailedStats();
      setStats(data);
    } catch {
      setError("فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="h-6 w-40 bg-white/5 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#0E0E10] border border-white/5 p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                <div className="w-7 h-7 rounded-xl bg-white/5 animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-[#0E0E10] rounded-2xl border border-white/5 p-5 h-56 animate-pulse" />
          <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5 h-56 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-sm text-red-400 mb-3">{error || "لا توجد بيانات"}</p>
          <motion.button
            onClick={loadStats}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs px-4 py-2 bg-brand-terracotta text-white rounded-xl hover:opacity-90"
          >
            إعادة المحاولة
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const maxRevenue = Math.max(...stats.revenue_chart.map(d => d.revenue), 1);
  const totalStatusCount = stats.status_distribution.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white">نظرة عامة</h1>
          <p className="text-[10px] text-gray-600 mt-0.5">آخر تحديث: {new Date().toLocaleTimeString("ar-MA")}</p>
        </div>
        <motion.button
          onClick={loadStats}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
        >
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </motion.svg>
          تحديث
        </motion.button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        <motion.div variants={itemVariants}>
          <KPICard
            label="إيرادات اليوم"
            value={`${stats.today_revenue.toLocaleString()} DH`}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            gradient="from-emerald-500/20 to-emerald-600/5 border-emerald-500/20"
            accent="#059669"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            label="طلبات اليوم"
            value={String(stats.today_orders)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            gradient="from-blue-500/20 to-blue-600/5 border-blue-500/20"
            accent="#3B82F6"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            label="إجمالي الإيرادات"
            value={`${stats.total_revenue.toLocaleString()} DH`}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            gradient="from-amber-500/20 to-amber-600/5 border-amber-500/20"
            accent="#F59E0B"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            label="إجمالي الطلبات"
            value={String(stats.total_orders)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            gradient="from-purple-500/20 to-purple-600/5 border-purple-500/20"
            accent="#8B5CF6"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            label="نسبة التحويل"
            value={`${stats.conversion_rate}%`}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            gradient="from-pink-500/20 to-pink-600/5 border-pink-500/20"
            accent="#EC4899"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            label="معدل الطلب"
            value={`${stats.avg_order_value.toLocaleString()} DH`}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            gradient="from-cyan-500/20 to-cyan-600/5 border-cyan-500/20"
            accent="#06B6D4"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            label="قيد المراجعة"
            value={String(stats.pending_orders)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            gradient="from-yellow-500/20 to-yellow-600/5 border-yellow-500/20"
            accent="#F59E0B"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            label="زوار المغرب"
            value={String(stats.valid_clicks)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            gradient="from-orange-500/20 to-orange-600/5 border-orange-500/20"
            accent="#F97316"
          />
        </motion.div>
      </motion.div>

      {/* Middle Row: Revenue Chart + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 bg-[#0E0E10] rounded-2xl border border-white/5 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-white">الإيرادات (آخر 30 يوم)</h2>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 text-[10px] text-gray-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                الإيرادات
              </motion.span>
            </div>
          </div>
          {stats.revenue_chart.length > 0 ? (
            <div className="relative h-40 md:h-48">
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[8px] text-gray-700 pl-1">
                <span>{maxRevenue.toFixed(0)}</span>
                <span>{(maxRevenue / 2).toFixed(0)}</span>
                <span>0</span>
              </div>
              <div className="ml-10 h-full flex items-end gap-[1px]">
                {stats.revenue_chart.map((day, i) => {
                  const pct = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                  const isToday = i === stats.revenue_chart.length - 1;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div className="w-full mx-px relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(pct, 0.5)}%` }}
                          transition={{ duration: 0.6, delay: 0.4 + i * 0.015, ease: "easeOut" }}
                          className={`w-full rounded-t-sm ${
                            isToday ? "bg-brand-terracotta" : "bg-emerald-500/60 hover:bg-emerald-400"
                          }`}
                        />
                      </div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-white/10 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        <div className="text-[9px] text-white font-semibold">{day.revenue.toFixed(0)} DH</div>
                        <div className="text-[7px] text-gray-500">{day.orders} طلب</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mr-10 mt-1 flex justify-between text-[7px] text-gray-700">
                {stats.revenue_chart.filter((_, i) => i % 5 === 0 || i === stats.revenue_chart.length - 1).map((day) => (
                  <span key={day.date}>{new Date(day.date).toLocaleDateString("ar-MA", { day: "numeric", month: "short" })}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs text-gray-600">لا توجد بيانات</div>
          )}
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5"
        >
          <h2 className="text-xs font-bold text-white mb-4">حالة الطلبات</h2>
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
              className="relative w-32 h-32 mb-4"
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(
                    ${stats.status_distribution
                      .filter(d => d.count > 0)
                      .map((d, i, arr) => {
                        const startPct = arr.slice(0, i).reduce((s, x) => s + (x.count / totalStatusCount) * 100, 0);
                        const endPct = startPct + (d.count / totalStatusCount) * 100;
                        return `${STATUS_CONFIG[d.status]?.color || "#666"} ${startPct}% ${endPct}%`;
                      })
                      .join(", ")}
                  )`,
                }}
              >
                <div className="absolute inset-3 bg-[#0E0E10] rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{stats.total_orders}</div>
                    <div className="text-[8px] text-gray-600">المجموع</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="w-full space-y-1.5">
              {stats.status_distribution.map((d, i) => {
                const cfg = STATUS_CONFIG[d.status] || { label: d.status, color: "#666" };
                const pct = totalStatusCount > 0 ? ((d.count / totalStatusCount) * 100).toFixed(1) : "0";
                return (
                  <motion.div
                    key={d.status}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-center justify-between text-[10px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <span className="text-gray-400">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{d.count}</span>
                      <span className="text-gray-700">{pct}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Top Products + Quick Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Top Products */}
        <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5">
          <h2 className="text-xs font-bold text-white mb-4">أفضل المنتجات</h2>
          {stats.top_products.length > 0 ? (
            <div className="space-y-2">
              {stats.top_products.map((p, i) => (
                <motion.div
                  key={p.product_name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.7 + i * 0.08 }}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0 ${
                        i === 0 ? "bg-amber-500/20 text-amber-400" :
                        i === 1 ? "bg-gray-400/20 text-gray-300" :
                        i === 2 ? "bg-orange-500/20 text-orange-400" :
                        "bg-white/5 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </motion.span>
                    <span className="text-xs text-white truncate">{p.product_name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-gray-500">{p.quantity} وحدة</span>
                    <span className="text-xs font-semibold text-emerald-400">{p.revenue.toFixed(0)} DH</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-600">لا توجد منتجات مبيعة بعد</div>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5">
          <h2 className="text-xs font-bold text-white mb-4">ملخص سريع</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickStatBox label="مؤكدة" value={String(stats.confirmed_orders)} color="#10B981" index={0} />
            <QuickStatBox label="تم الشحن" value={String(stats.shipped_orders)} color="#3B82F6" index={1} />
            <QuickStatBox label="تم التوصيل" value={String(stats.delivered_orders)} color="#059669" index={2} />
            <QuickStatBox label="ملغية" value={String(stats.cancelled_orders)} color="#EF4444" index={3} />
            <QuickStatBox label="مرتجعة" value={String(stats.returned_orders)} color="#F97316" index={4} />
            <QuickStatBox label="زيارات" value={String(stats.total_clicks)} color="#8B5CF6" index={5} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-4 bg-[#0A0A0A] rounded-xl p-3 border border-white/5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-500">نسبة التحويل</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className={`text-[10px] font-bold ${stats.conversion_rate >= 3 ? "text-emerald-400" : stats.conversion_rate >= 1 ? "text-amber-400" : "text-red-400"}`}
              >
                {stats.conversion_rate}%
              </motion.span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stats.conversion_rate * 10, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  stats.conversion_rate >= 3 ? "bg-emerald-500" : stats.conversion_rate >= 1 ? "bg-amber-500" : "bg-red-500"
                }`}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-[8px] text-gray-700 mt-1.5"
            >
              {stats.conversion_rate >= 3 ? "أداء ممتاز 🏆" : stats.conversion_rate >= 1 ? "أداء جيد 👍" : "في تحسن مستمر 💪"}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function KPICard({ label, value, icon, gradient, accent }: {
  label: string; value: string; icon: React.ReactNode; gradient: string; accent: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl border bg-gradient-to-br ${gradient} p-4 md:p-5 relative overflow-hidden`}
    >
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
      />
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] md:text-[11px] text-gray-500 font-medium">{label}</span>
        <motion.div
          whileHover={{ rotate: 15 }}
          className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center" style={{ color: accent }}>
          {icon}
        </motion.div>
      </div>
      <div className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight">{value}</div>
    </motion.div>
  );
}

function QuickStatBox({ label, value, color, index }: { label: string; value: string; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5"
    >
      <div className="flex items-center gap-2 mb-1">
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>
      <div className="text-sm font-bold text-white">{value}</div>
    </motion.div>
  );
}
