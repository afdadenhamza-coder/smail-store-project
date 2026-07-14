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
    <div
      className="relative min-h-screen overflow-hidden bg-[#030304] flex items-center justify-center p-4"
      dir="rtl"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-terracotta/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-brand-gold/[0.05] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-terracotta/25 to-brand-gold/15">
            <span className="text-2xl font-black text-brand-terracotta">S</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Smail <span className="gradient-text">Store</span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">لوحة التحكم</p>
        </div>

        {/* Card */}
        <div className="rounded-[24px] border border-white/[0.08] bg-[#0A0A0D] p-7 shadow-premium backdrop-blur-xl">
          <h2 className="mb-6 text-center text-sm font-semibold text-text-secondary">
            سجل الدخول لمتابعة متجرك
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-2.5 text-center text-sm text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input"
                placeholder="admin@smailstore.shop"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">
                كلمة السر
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="premium-input"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-brand-terracotta to-brand-terracotta-light py-3.5 text-sm font-bold text-white shadow-terracotta transition-all hover:shadow-terracotta-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  جاري الدخول...
                </span>
              ) : (
                "دخول"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
