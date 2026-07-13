"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { toggleCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/collections/t-shirts", label: "تيشيرتات" },
    { href: "/collections/hoodies", label: "هوديات" },
    { href: "/collections/pants", label: "بناطل" },
    { href: "/collections/jackets", label: "جواكيط" },
    { href: "/location", label: "موقع المحل" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-3 md:px-4">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/70 px-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:h-16 md:px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <img
            src="/images/SmailStore Logo.jpg"
            alt="Smail Store"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-terracotta/20 shadow-[0_8px_24px_rgba(192,112,64,0.18)]"
          />
          <span className="text-base font-bold tracking-tight text-white md:text-lg">
            Smail <span className="text-brand-terracotta">Store</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.slice(0, 6).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm text-text-secondary transition-all hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>

          <button
            onClick={toggleCart}
            className="relative rounded-full border border-white/10 bg-white/10 p-2 text-gray-200 transition-all hover:bg-white/15"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {itemCount() > 0 && (
              <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-terracotta px-1 text-[10px] font-bold text-white shadow-sm">
                {itemCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mt-2 rounded-2xl border border-white/10 bg-[#0E0E12]/95 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-text-secondary transition-all hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
