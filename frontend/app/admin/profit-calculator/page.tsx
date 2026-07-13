"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn } from "@/lib/admin-api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";

const DEFAULT_EXCHANGE_RATE = 0.10;
const STORAGE_KEY = "smail_cod_dashboard";

interface Inputs {
  aov: number;
  exchangeRate: number;
  sellingPrice: number;
  productCost: number;
  piecesPerOrder: number;
  cpl: number;
  leads: number;
  confirmedOrders: number;
  deliveredOrders: number;
}

interface Costs {
  confirmationFee: number;
  deliveryFee: number;
  returnFee: number;
  fulfillmentFee: number;
  packagingCost: number;
  paymentProcessing: number;
  supportCost: number;
}

interface Scenarios {
  a: Inputs & Costs;
  b: Inputs & Costs;
  c: Inputs & Costs;
}



function calcMetrics(inputs: Inputs, costs: Costs) {
  const confirmed = inputs.confirmedOrders;
  const delivered = inputs.deliveredOrders;
  const returned = confirmed - delivered;
  const confirmationRatePct = inputs.leads > 0 ? (confirmed / inputs.leads) * 100 : 0;
  const deliveryRatePct = confirmed > 0 ? (delivered / confirmed) * 100 : 0;

  const aovUsd = inputs.aov * inputs.exchangeRate;
  const revenue = delivered * aovUsd;
  const productCostTotal = delivered * inputs.piecesPerOrder * inputs.productCost;
  const advertising = inputs.leads * inputs.cpl;
  const confirmationFees = confirmed * costs.confirmationFee;
  const deliveryFees = delivered * costs.deliveryFee;
  const returnFees = returned * costs.returnFee;
  const fulfillmentFees = confirmed * costs.fulfillmentFee;
  const packaging = confirmed * costs.packagingCost;
  const support = confirmed * costs.supportCost;
  const payment = delivered * costs.paymentProcessing;

  const totalCosts = productCostTotal + advertising + confirmationFees + deliveryFees + returnFees + fulfillmentFees + packaging + support + payment;
  const netProfit = revenue - totalCosts;
  const profitPerLead = inputs.leads > 0 ? netProfit / inputs.leads : 0;
  const profitPerDelivery = delivered > 0 ? netProfit / delivered : 0;
  const roi = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;
  const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const grossMarginPerOrder = aovUsd - (inputs.piecesPerOrder * inputs.productCost);

  // Breakeven
  const fixedCostsPerLead = costs.confirmationFee + costs.fulfillmentFee + costs.packagingCost + costs.supportCost;
  const varCostsPerDelivered = costs.deliveryFee + costs.paymentProcessing;
  const varCostsPerReturned = costs.returnFee;

  // Breakeven formulas using computed rates
  const L = inputs.leads;
  const CR = confirmationRatePct / 100;
  const DR = deliveryRatePct / 100;
  const P = inputs.piecesPerOrder;
  const PC = inputs.productCost;
  const AOV = aovUsd;
  const CPL = inputs.cpl;
  const FC = fixedCostsPerLead;
  const VC_d = varCostsPerDelivered;
  const VC_r = varCostsPerReturned;

  const drNum = L * CPL + L * CR * FC + L * CR * VC_r;
  const drDen = L * CR * AOV - L * CR * P * PC - L * CR * VC_d + L * CR * VC_r;
  const breakevenDr = drDen > 0 ? (drNum / drDen) * 100 : 0;

  const otherCosts = confirmationFees + deliveryFees + returnFees + fulfillmentFees + packaging + support + payment;
  const maxCpl = L > 0 ? (revenue - productCostTotal - otherCosts) / L : 0;

  const crNum = L * CPL;
  const crDen = L * DR * AOV - L * DR * P * PC - L * FC - L * DR * VC_d - L * (1 - DR) * VC_r;
  const minCr = crDen > 0 ? (crNum / crDen) * 100 : 0;

  const maxPc = delivered > 0 ? (revenue - advertising - confirmationFees - deliveryFees - returnFees - fulfillmentFees - packaging - support - payment) / (delivered * P) : 0;

  const beAovDen = delivered;
  const beAovUsd = beAovDen > 0 ? (totalCosts - revenue + delivered * aovUsd) / beAovDen : 0;
  const beSellingPriceMad = beAovUsd > 0 ? beAovUsd / inputs.exchangeRate : 0;
  const beAovMad = beAovUsd / inputs.exchangeRate;

  const expenses = [
    { label: "Advertising", value: advertising, color: "#F59E0B" },
    { label: "Product Cost", value: productCostTotal, color: "#8B5CF6" },
    { label: "Confirmation Fees", value: confirmationFees, color: "#3B82F6" },
    { label: "Fulfillment", value: fulfillmentFees, color: "#06B6D4" },
    { label: "Packaging", value: packaging, color: "#10B981" },
    { label: "Delivery Fees", value: deliveryFees, color: "#EC4899" },
    { label: "Return Fees", value: returnFees, color: "#F97316" },
    { label: "Support Cost", value: support, color: "#6366F1" },
    { label: "Payment Fees", value: payment, color: "#64748B" },
  ];

  return {
    confirmed, delivered, returned,
    confirmationRatePct, deliveryRatePct,
    aovUsd, revenue, productCostTotal, advertising,
    confirmationFees, deliveryFees, returnFees, fulfillmentFees,
    packaging, support, payment,
    totalCosts, netProfit,
    profitPerLead, profitPerDelivery, roi, netMargin,
    grossMarginPerOrder,
    breakevenDr, maxCpl, minCr, maxPc,
    beSellingPriceMad, beAovMad,
    expenses: expenses.filter(e => e.value > 0),
  };
}

type Metrics = ReturnType<typeof calcMetrics>;

export default function ProfitCalculatorPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !isAdminLoggedIn()) router.replace("/admin/login");
  }, [router]);

  const loadSaved = useCallback(<T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { const parsed = JSON.parse(raw); return parsed[key] ?? fallback; }
    } catch { /* ignore */ }
    return fallback;
  }, []);

  const saveState = useCallback((inputs: Inputs, costs: Costs) => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, costs })); } catch { /* ignore */ }
  }, []);

  const [inputs, setInputs] = useState<Inputs>(() => ({
    aov: loadSaved("inputs", { aov: 450 }).aov ?? 450,
    exchangeRate: DEFAULT_EXCHANGE_RATE,
    sellingPrice: 249,
    productCost: 6,
    piecesPerOrder: 1.8,
    cpl: 5.5,
    leads: 5000,
    confirmedOrders: 3250,
    deliveredOrders: 2275,
  }));

  const [costs, setCosts] = useState<Costs>(() => ({
    confirmationFee: loadSaved("costs", { confirmationFee: 1.5 }).confirmationFee ?? 1.5,
    deliveryFee: 4.5,
    returnFee: 1.2,
    fulfillmentFee: 0.9,
    packagingCost: 0.6,
    paymentProcessing: 0,
    supportCost: 0.4,
  }));

  const m = useMemo(() => calcMetrics(inputs, costs), [inputs, costs]);

  useEffect(() => { saveState(inputs, costs); }, [inputs, costs, saveState]);

  const setInput = <K extends keyof Inputs>(k: K, v: number) => setInputs(p => ({ ...p, [k]: v }));
  const setCost = <K extends keyof Costs>(k: K, v: number) => setCosts(p => ({ ...p, [k]: v }));

  // Scenario calculations
  const scenarios = useMemo((): Scenarios => ({
    a: { ...inputs, ...costs },
    b: {
      ...inputs,
      confirmedOrders: Math.round(inputs.confirmedOrders * 1.3),
      deliveredOrders: Math.round(inputs.deliveredOrders * 1.35),
      cpl: Math.max(inputs.cpl - 1, 1),
      leads: Math.round(inputs.leads * 1.5),
      ...costs,
    },
    c: {
      ...inputs,
      confirmedOrders: Math.round(inputs.confirmedOrders * 0.7),
      deliveredOrders: Math.round(inputs.deliveredOrders * 0.6),
      cpl: inputs.cpl + 2,
      leads: Math.round(inputs.leads * 0.5),
      ...costs,
    },
  }), [inputs, costs]);

  const scenarioMetrics = useMemo(() => ({
    a: calcMetrics(scenarios.a, costs),
    b: calcMetrics(scenarios.b, costs),
    c: calcMetrics(scenarios.c, costs),
  }), [scenarios, costs]);

  // Chart data
  const revenueCostChart = useMemo(() => [
    { name: "Revenue", value: m.revenue, fill: "#10B981" },
    { name: "Total Costs", value: m.totalCosts, fill: "#EF4444" },
    { name: "Net Profit", value: Math.max(m.netProfit, 0), fill: "#C07040" },
  ], [m]);

  const profitByLeads = useMemo(() => {
    const volumes = [500, 1000, 2000, 5000, 10000, 20000];
    return volumes.map(v => {
      const tmp = calcMetrics({ ...inputs, leads: v }, costs);
      return { leads: v, profit: Math.round(tmp.netProfit * 100) / 100 };
    });
  }, [inputs, costs]);

  const deliverySensitivity = useMemo(() => {
    return [20, 30, 40, 50, 60, 70, 80].map(dr => {
      const tmp = calcMetrics({ ...inputs, deliveredOrders: Math.round(inputs.confirmedOrders * dr / 100) }, costs);
      return { dr: dr + "%", profit: Math.round(tmp.netProfit * 100) / 100 };
    });
  }, [inputs, costs]);

  const cplSensitivity = useMemo(() => {
    return [2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map(cpl => {
      const tmp = calcMetrics({ ...inputs, cpl }, costs);
      return { cpl: "$" + cpl, profit: Math.round(tmp.netProfit * 100) / 100 };
    });
  }, [inputs, costs]);

  // Insights
  const insights = useMemo(() => {
    const list: { type: "green" | "yellow" | "red"; text: string }[] = [];

    const dr75 = calcMetrics({ ...inputs, deliveredOrders: Math.round(inputs.confirmedOrders * 0.75) }, costs);
    const profitDiff = dr75.netProfit - m.netProfit;
    if (profitDiff > 0) {
      list.push({ type: "green", text: `زيادة نسبة التوصيل من ${m.deliveryRatePct.toFixed(0)}% إلى 75% غادي تزيد الربح ب ${profitDiff.toFixed(0)}$ (${(profitDiff / inputs.exchangeRate).toFixed(0)} MAD)` });
    }

    if (m.maxCpl > 0 && inputs.cpl >= m.maxCpl * 0.8) {
      list.push({ type: "yellow", text: `تكلفة الليد ($${inputs.cpl}) قريبة من نقطة التعادل ($${m.maxCpl.toFixed(1)}). خفضها غادي يحسن الربح بزاف.` });
    }

    if (m.breakevenDr > 0 && m.deliveryRatePct < m.breakevenDr + 10) {
      list.push({ type: "red", text: `إذا نزلت نسبة التوصيل تحت ${m.breakevenDr.toFixed(0)}%، البيزنس غادي يدير الخسارة. الحالي: ${m.deliveryRatePct.toFixed(0)}%` });
    }

    if (m.roi < 30) {
      list.push({ type: "yellow", text: `ROI ديالك ${m.roi.toFixed(0)}% ضعيف. حاول تزيد نسبة التأكيد ولا نسبة التوصيل.` });
    } else if (m.roi > 100) {
      list.push({ type: "green", text: `ROI ديالك ${m.roi.toFixed(0)}% — أداء ممتاز! حافظ على هاد المستوى.` });
    }

    if (inputs.cpl > 8) {
      list.push({ type: "red", text: `تكلفة الليد tinggi ($${inputs.cpl}). جرب حملات targeting أحسن ولا source أرخص.` });
    }

    if (m.netMargin > 30) {
      list.push({ type: "green", text: `صافي هامش الربح ${m.netMargin.toFixed(0)}% — أحسن من نسبة كتير من الدروبشيبينغ.` });
    } else if (m.netMargin < 10) {
      list.push({ type: "red", text: `صافي الهامش ${m.netMargin.toFixed(0)}% ضعيف. زيد السعر ولا نقص المصاريف.` });
    }

    return list;
  }, [inputs, costs, m]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white">COD Profit Dashboard</h1>
          <p className="text-[10px] text-gray-600 mt-0.5">Metrics only count valid Morocco traffic after fraud filtering.</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" className="bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none focus:border-brand-terracotta/50 w-[120px]" />
          <input type="date" className="bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none focus:border-brand-terracotta/50 w-[120px]" />
          <button className="text-[10px] px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all">Refresh</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-[#0E0E10] rounded-xl p-1 border border-white/5 w-fit">
        <Link href="/admin/dashboard" className="px-4 py-1.5 rounded-lg text-[11px] text-gray-400 hover:text-white hover:bg-white/5 transition-all">Overview</Link>
        <Link href="/admin/orders" className="px-4 py-1.5 rounded-lg text-[11px] text-gray-400 hover:text-white hover:bg-white/5 transition-all">Orders</Link>
        <span className="px-4 py-1.5 rounded-lg text-[11px] font-medium bg-brand-terracotta/10 text-brand-terracotta">Profit Calculator</span>
      </div>

      {/* Section 1 — Inputs & Assumptions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5 mb-4"
      >
        <h2 className="text-xs font-bold text-white mb-4">Inputs &amp; Assumptions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
          <InputField label="Average Order Value (MAD)" value={inputs.aov} onChange={v => setInput("aov", v)} step={10} helper="Revenue per delivered order" />
          <InputField label="MAD → USD Rate" value={inputs.exchangeRate} onChange={v => setInput("exchangeRate", v)} step={0.01} helper="1 MAD = ? USD" />
          <InputField label="Selling Price/Unit (MAD)" value={inputs.sellingPrice} onChange={v => setInput("sellingPrice", v)} step={5} helper="Per product" />
          <InputField label="Product Cost/Unit (USD)" value={inputs.productCost} onChange={v => setInput("productCost", v)} step={0.5} helper="COGS per unit" />
          <InputField label="Avg Pieces/Order" value={inputs.piecesPerOrder} onChange={v => setInput("piecesPerOrder", v)} step={0.1} helper="Units per order" />
          <InputField label="Cost Per Lead (USD)" value={inputs.cpl} onChange={v => setInput("cpl", v)} step={0.5} helper="Advertising CPL" />
          <div>
            <label className="block text-[9px] text-gray-500 mb-1.5">Confirmed Orders</label>
            <input type="number" min={0} value={inputs.confirmedOrders} onChange={e => { const v = parseInt(e.target.value, 10); setInput("confirmedOrders", isNaN(v) ? 0 : v); }} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-semibold outline-none focus:border-[#C07040]" />
            <div className="text-[8px] text-gray-600 mt-0.5">Confirmed: {m.confirmationRatePct.toFixed(1)}% of leads</div>
          </div>
          <div>
            <label className="block text-[9px] text-gray-500 mb-1.5">Delivered Orders</label>
            <input type="number" min={0} value={inputs.deliveredOrders} onChange={e => { const v = parseInt(e.target.value, 10); setInput("deliveredOrders", isNaN(v) ? 0 : v); }} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-semibold outline-none focus:border-[#C07040]" />
            <div className="text-[8px] text-gray-600 mt-0.5">Delivery: {m.deliveryRatePct.toFixed(1)}% of confirmed</div>
          </div>
          <div>
            <label className="block text-[9px] text-gray-500 mb-1.5">Number of Leads</label>
            <div className="flex items-center gap-1">
              <button onClick={() => setInput("leads", Math.max(0, inputs.leads - 500))} className="w-7 h-7 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-white text-xs hover:bg-white/10">−</button>
              <input type="number" min={0} value={inputs.leads} onChange={e => { const v = parseInt(e.target.value, 10); setInput("leads", isNaN(v) ? 0 : v); }} className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white text-center font-semibold outline-none focus:border-[#C07040]" />
              <button onClick={() => setInput("leads", inputs.leads + 500)} className="w-7 h-7 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-white text-xs hover:bg-white/10">+</button>
            </div>
          </div>
        </div>

        {/* Live KPI Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiChip label="AOV (USD)" value={`$${m.aovUsd.toFixed(2)}`} />
          <KpiChip label="Avg Pieces / Order" value={inputs.piecesPerOrder.toFixed(1)} />
          <KpiChip label="Gross Margin / Delivered" value={`$${m.grossMarginPerOrder.toFixed(2)}`} color={m.grossMarginPerOrder > 0 ? "text-emerald-400" : "text-red-400"} />
          <KpiChip label="Net Profit / Delivered" value={`$${m.profitPerDelivery.toFixed(2)}`} color={m.profitPerDelivery > 0 ? "text-emerald-400" : "text-red-400"} />
        </div>
      </motion.div>

      {/* Section 2 — COD Cost Structure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5 mb-4"
      >
        <h2 className="text-xs font-bold text-white mb-4">COD Cost Structure</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <CostChip label="Confirmation Fee" value={costs.confirmationFee} onChange={v => setCost("confirmationFee", v)} step={0.1} />
          <CostChip label="Delivery Fee" value={costs.deliveryFee} onChange={v => setCost("deliveryFee", v)} step={0.25} />
          <CostChip label="Return Fee" value={costs.returnFee} onChange={v => setCost("returnFee", v)} step={0.1} />
          <CostChip label="Fulfillment Fee" value={costs.fulfillmentFee} onChange={v => setCost("fulfillmentFee", v)} step={0.1} />
          <CostChip label="Packaging Cost" value={costs.packagingCost} onChange={v => setCost("packagingCost", v)} step={0.1} />
          <CostChip label="Payment Processing" value={costs.paymentProcessing} onChange={v => setCost("paymentProcessing", v)} step={0.1} />
          <CostChip label="Support Cost" value={costs.supportCost} onChange={v => setCost("supportCost", v)} step={0.1} />
        </div>
      </motion.div>

      {/* Section 3 + 4 — Breakeven x Profit Projection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4"
      >
        {/* Breakeven */}
        <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5">
          <h2 className="text-xs font-bold text-white mb-4">Breakeven Analysis</h2>
          <div className="mb-4">
            <div className="text-[9px] text-gray-500 mb-1">Current Profit Per Lead</div>
            <div className={`text-2xl font-bold ${m.profitPerLead >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {m.profitPerLead >= 0 ? "+" : ""}${m.profitPerLead.toFixed(2)}
            </div>
            <div className={`text-[10px] mt-1 ${m.profitPerLead >= 0 ? "text-emerald-500" : "text-red-400"}`}>
              {m.profitPerLead >= 0 ? "Above breakeven ✓" : "Losing money ✗"}
            </div>
          </div>
          <div className="space-y-2.5">
            <BeRow label="Breakeven Delivery Rate" value={`${m.breakevenDr.toFixed(1)}%`} sub={`Current: ${m.deliveryRatePct.toFixed(1)}%`} />
            <BeRow label="Maximum Affordable CPL" value={`$${m.maxCpl.toFixed(2)}`} sub={`Current: $${inputs.cpl.toFixed(1)}`} />
            <BeRow label="Minimum Confirmation Rate" value={`${m.minCr.toFixed(1)}%`} sub={`Current: ${m.confirmationRatePct.toFixed(1)}%`} />
            <BeRow label="Maximum Product Cost" value={`$${m.maxPc.toFixed(2)}`} sub={`Per unit`} />
            <BeRow label="Break-even Selling Price" value={`${(m.beSellingPriceMad > 0 ? m.beSellingPriceMad : 0).toFixed(0)} MAD`} sub={`Min price`} />
            <BeRow label="Break-even AOV" value={`${(m.beAovMad > 0 ? m.beAovMad : 0).toFixed(0)} MAD`} sub={`Per delivered order`} />
          </div>
        </div>

        {/* Profit Projection */}
        <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5">
          <h2 className="text-xs font-bold text-white mb-4">Profit Projection</h2>
          {/* Funnel Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <FunnelStep label="Leads" value={inputs.leads.toLocaleString()} />
            <FunnelStep label="Confirmed" value={Math.round(m.confirmed).toLocaleString()} />
            <FunnelStep label="Delivered" value={Math.round(m.delivered).toLocaleString()} />
            <FunnelStep label="Returned" value={Math.round(m.returned).toLocaleString()} />
          </div>
          {/* Revenue */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4">
            <div className="text-[9px] text-gray-500">Revenue</div>
            <div className="text-xl font-bold text-emerald-400">${Math.round(m.revenue).toLocaleString()}</div>
          </div>
          {/* Expenses */}
          <div className="space-y-1.5 mb-4">
            {m.expenses.map(e => (
              <div key={e.label} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
                  <span className="text-gray-400">{e.label}</span>
                </div>
                <span className="text-gray-300">${Math.round(e.value).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-white/5 pt-1.5 flex items-center justify-between text-[10px] font-semibold">
              <span className="text-gray-500">Total Costs</span>
              <span className="text-red-400">${Math.round(m.totalCosts).toLocaleString()}</span>
            </div>
          </div>
          {/* Net Profit */}
          <div className={`rounded-xl p-3 border ${m.netProfit >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
            <div className="text-[9px] text-gray-500">Net Profit</div>
            <div className={`text-lg font-bold ${m.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {m.netProfit >= 0 ? "+" : ""}${Math.round(m.netProfit).toLocaleString()}
            </div>
          </div>
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            <MiniStat label="ROI" value={`${m.roi.toFixed(0)}%`} />
            <MiniStat label="Profit/Lead" value={`$${m.profitPerLead.toFixed(2)}`} />
            <MiniStat label="Profit/Delivery" value={`$${m.profitPerDelivery.toFixed(2)}`} />
            <MiniStat label="Net Margin" value={`${m.netMargin.toFixed(0)}%`} />
          </div>
        </div>
      </motion.div>

      {/* Section 5 — Sales Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5 mb-4"
      >
        <h2 className="text-xs font-bold text-white mb-4">Sales Funnel</h2>
        <div className="flex flex-col md:flex-row items-center gap-0 md:gap-1">
          <FunnelBar label="Leads" value={inputs.leads} pct={100} color="#6366F1" />
          <FunnelArrow />
          <FunnelBar label="Confirmed" value={Math.round(m.confirmed)} pct={(m.confirmed / inputs.leads) * 100} color="#3B82F6" />
          <FunnelArrow />
          <FunnelBar label="Delivered" value={Math.round(m.delivered)} pct={(m.delivered / inputs.leads) * 100} color="#10B981" />
          <FunnelArrow />
          <FunnelBar label="Returned" value={Math.round(m.returned)} pct={(m.returned / inputs.leads) * 100} color="#F97316" />
        </div>
        <div className="flex justify-center gap-4 md:gap-8 mt-3 text-[9px] text-gray-600">
          <span>CR: {m.confirmationRatePct.toFixed(1)}%</span>
          <span>DR: {m.deliveryRatePct.toFixed(1)}%</span>
          <span>Return: {m.confirmed > 0 ? ((m.returned / m.confirmed) * 100).toFixed(1) : "0"}%</span>
        </div>
      </motion.div>

      {/* Section 6 — Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4"
      >
        {/* Revenue vs Cost */}
        <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5">
          <h2 className="text-xs font-bold text-white mb-3">Revenue vs Cost</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueCostChart}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit by Lead Volume */}
        <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5">
          <h2 className="text-xs font-bold text-white mb-3">Profit by Lead Volume</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitByLeads}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="leads" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? (v / 1000) + "k" : String(v)} />
                <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v.toFixed(0))} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="profit" stroke="#C07040" strokeWidth={2} dot={{ r: 3, fill: "#C07040" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Rate Sensitivity */}
        <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5">
          <h2 className="text-xs font-bold text-white mb-3">Delivery Rate Sensitivity</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deliverySensitivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dr" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v.toFixed(0))} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: "#10B981" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CPL Sensitivity */}
        <div className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5">
          <h2 className="text-xs font-bold text-white mb-3">CPL Sensitivity</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cplSensitivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="cpl" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v.toFixed(0))} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="profit" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: "#F59E0B" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Section 7 — Scenario Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4"
      >
        <ScenarioCard title="Scenario A — Current" metrics={scenarioMetrics.a} inputs={scenarios.a} />
        <ScenarioCard title="Scenario B — Optimistic" metrics={scenarioMetrics.b} inputs={scenarios.b} accent="text-emerald-400" border="border-emerald-500/20" />
        <ScenarioCard title="Scenario C — Worst Case" metrics={scenarioMetrics.c} inputs={scenarios.c} accent="text-red-400" border="border-red-500/20" />
      </motion.div>

      {/* Section 8 — Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-[#0E0E10] rounded-2xl border border-white/5 p-5 mb-4"
      >
        <h2 className="text-xs font-bold text-white mb-3">Recommended Improvements</h2>
        {insights.length === 0 ? (
          <p className="text-[10px] text-gray-600">Adjust inputs to see insights.</p>
        ) : (
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className={`rounded-xl px-3.5 py-2.5 text-[10px] leading-relaxed border ${
                insight.type === "green" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" :
                insight.type === "yellow" ? "bg-amber-500/10 border-amber-500/20 text-amber-300" :
                "bg-red-500/10 border-red-500/20 text-red-300"
              }`}>
                {insight.type === "green" ? "🟢 " : insight.type === "yellow" ? "🟡 " : "🔴 "}
                {insight.text}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Sub-components ─── */

function InputField({ label, value, onChange, step, helper }: { label: string; value: number; onChange: (v: number) => void; step: number; helper?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-[9px] text-gray-500 mb-1 font-medium">{label}</label>
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} step={step}
        className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-brand-terracotta/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {helper && <p className="text-[7px] text-gray-700 mt-0.5">{helper}</p>}
    </motion.div>
  );
}

function KpiChip({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0A0A0A] rounded-xl border border-white/5 p-3"
    >
      <div className="text-[8px] text-gray-600 mb-0.5">{label}</div>
      <div className={`text-sm font-bold ${color || "text-white"}`}>{value}</div>
    </motion.div>
  );
}

function CostChip({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0A0A0A] rounded-xl border border-white/5 p-2.5"
    >
      <label className="block text-[7px] text-gray-600 mb-0.5">{label}</label>
      <div className="flex items-center gap-0.5">
        <span className="text-[8px] text-gray-600">$</span>
        <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} step={step} className="w-full bg-transparent text-xs text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
      </div>
    </motion.div>
  );
}

function BeRow({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
      <div>
        <div className="text-[10px] text-gray-400">{label}</div>
        <div className="text-[8px] text-gray-700">{sub}</div>
      </div>
      <div className="text-[11px] font-semibold text-white">{value}</div>
    </div>
  );
}

function FunnelStep({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0A0A0A] rounded-xl p-2.5 text-center border border-white/5">
      <div className="text-[8px] text-gray-600">{label}</div>
      <div className="text-xs font-bold text-white">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0A0A0A] rounded-lg p-2 text-center border border-white/5">
      <div className="text-[7px] text-gray-600">{label}</div>
      <div className="text-[10px] font-semibold text-white">{value}</div>
    </div>
  );
}

function FunnelBar({ label, value, pct, color }: { label: string; value: number; pct: number; color: string }) {
  const w = Math.max(pct, 15);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center w-full md:w-auto"
    >
      <div className="text-[9px] text-gray-500 mb-1">{label}</div>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${w}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:w-32 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white overflow-hidden"
        style={{ backgroundColor: color }}
      >
        {value.toLocaleString()}
      </motion.div>
      <div className="text-[8px] text-gray-700 mt-0.5">{pct.toFixed(1)}%</div>
    </motion.div>
  );
}

function FunnelArrow() {
  return (
    <div className="hidden md:flex items-center text-gray-700">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
    </div>
  );
}

function ScenarioCard({ title, metrics, inputs, accent, border }: { title: string; metrics: Metrics; inputs: Inputs & Costs; accent?: string; border?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4 }}
      className={`bg-[#0E0E10] rounded-2xl border ${border || "border-white/5"} p-4`}
    >
      <h3 className={`text-xs font-bold mb-3 ${accent || "text-white"}`}>{title}</h3>
      <div className="space-y-2">
        <ScRow label="Revenue" value={`$${Math.round(metrics.revenue).toLocaleString()}`} />
        <ScRow label="Net Profit" value={`${metrics.netProfit >= 0 ? "+" : ""}$${Math.round(metrics.netProfit).toLocaleString()}`} color={metrics.netProfit >= 0 ? "text-emerald-400" : "text-red-400"} />
        <ScRow label="ROI" value={`${metrics.roi.toFixed(0)}%`} />
        <ScRow label="Delivery Rate" value={`${metrics.deliveryRatePct.toFixed(1)}%`} />
        <ScRow label="Confirmation Rate" value={`${metrics.confirmationRatePct.toFixed(1)}%`} />
        <ScRow label="CPL" value={`$${inputs.cpl.toFixed(1)}`} />
      </div>
    </motion.div>
  );
}

function ScRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${color || "text-white"}`}>{value}</span>
    </div>
  );
}
