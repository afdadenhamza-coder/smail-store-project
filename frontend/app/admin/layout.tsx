"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn, logout } from "@/lib/admin-api";

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "نظرة عامة",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z"
        />
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "الطلبات",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "المنتجات",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
  {
    href: "/admin/profit-calculator",
    label: "حاسبة الربح",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    href: "/",
    label: "المتجر",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen bg-[#030304]" dir="rtl">
      {/* ── Top Navigation ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#060608]/95 backdrop-blur-2xl">
        <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between gap-4 px-4">
          {/* Brand */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:text-white md:hidden"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    menuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-terracotta/30 to-brand-gold/20">
                <div className="absolute inset-0 rounded-xl bg-brand-terracotta/10 blur-sm" />
                <span className="relative text-[11px] font-black text-brand-terracotta">
                  S
                </span>
              </div>
              <div>
                <h1 className="text-[13px] font-black leading-tight text-white">
                  Smail <span className="gradient-text">Store</span>
                </h1>
                <p className="text-[8px] leading-none text-text-muted">
                  لوحة التحكم
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12px] font-medium transition-all ${
                    isActive
                      ? "bg-brand-terracotta/10 text-brand-terracotta"
                      : "text-text-muted hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-text-muted md:block">
              {new Date().toLocaleDateString("ar-MA", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <button
              onClick={handleLogout}
              className="hidden items-center gap-1.5 rounded-xl border border-transparent px-3 py-1.5 text-[11px] font-medium text-text-muted transition-all hover:border-red-500/20 hover:bg-red-500/[0.07] hover:text-red-400 md:flex"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              خروج
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-terracotta/20 text-[11px] font-bold text-brand-terracotta md:hidden">
              A
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-white/[0.06] bg-[#060608] md:hidden">
            <nav className="space-y-0.5 p-3">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-terracotta/10 text-brand-terracotta"
                        : "text-text-muted hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-medium text-text-muted transition-all hover:bg-red-500/[0.07] hover:text-red-400"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                خروج
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}
