"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn, logout } from "@/lib/admin-api";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "نظرة عامة" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/profit-calculator", label: "حاسبة الربح" },
  { href: "/", label: "المتجر" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setMounted(true);
    if (!isLoginPage && typeof window !== "undefined" && !isAdminLoggedIn()) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, router]);

  if (!mounted) return null;
  if (isLoginPage) return <>{children}</>;

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#070708]" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0E0E10]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-terracotta/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-brand-terracotta">S</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-[13px] leading-tight">Smail Store</h1>
                <p className="text-[8px] text-gray-600 leading-tight">لوحة التحكم</p>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-brand-terracotta/10 text-brand-terracotta"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:block text-[9px] text-gray-700 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/5">
              {new Date().toLocaleDateString("ar-MA", { day: "numeric", month: "short" })}
            </span>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              خروج
            </button>
            <div className="w-7 h-7 rounded-full bg-brand-terracotta/20 flex items-center justify-center text-[10px] text-brand-terracotta font-bold md:hidden">
              A
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0E0E10]">
            <nav className="px-3 py-2 space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-brand-terracotta/10 text-brand-terracotta"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                خروج
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-5 md:py-6">
        {children}
      </main>
    </div>
  );
}
