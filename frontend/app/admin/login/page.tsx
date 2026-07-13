"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, isAdminLoggedIn } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (typeof window !== "undefined" && isAdminLoggedIn()) {
    router.replace("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(email, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("البريد الإلكتروني أو كلمة السر غالطة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Smail Store</h1>
          <p className="text-sm text-gray-500 mt-1">اللوحة ديال التحكم</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-2.5 text-center">{error}</div>
          )}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-terracotta/50 transition-colors"
              placeholder="admin@smailstore.shop"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">كلمة السر</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-terracotta/50 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-terracotta text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm"
          >
            {loading ? "..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
