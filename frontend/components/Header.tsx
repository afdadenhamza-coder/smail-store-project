"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const { toggleCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/collections/t-shirts", label: "تيشيرتات" },
    { href: "/collections/hoodies", label: "هوديات" },
    { href: "/collections/pants", label: "بناطل" },
    { href: "/collections/jackets", label: "جواكيط" },
    { href: "/location", label: "موقع المحل" },
  ];

  const count = itemCount();

  return (
    <>
      {/* ── Announcement Bar ──────────────────────────────── */}
      <AnimatePresence></AnimatePresence>

      {/* ── Main Header ───────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "px-3 pt-2 md:px-4" : "px-0 pt-0"}`}
      >
        <div
          className={`transition-all duration-300 ${
            scrolled
              ? "mx-auto max-w-7xl rounded-2xl border border-white/[0.08] bg-[#030304]/85 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
              : "border-b border-white/[0.06] bg-[#030304]/80 backdrop-blur-xl"
          }`}
        >
          <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-4 md:h-[64px] md:px-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5 shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-brand-terracotta/20 blur-md group-hover:bg-brand-terracotta/30 transition-all duration-300" />
                <img
                  src="/images/SmailStore Logo.jpg"
                  alt="Smail Store"
                  className="relative h-9 w-9 rounded-full object-cover ring-2 ring-brand-terracotta/30 shadow-[0_0_20px_rgba(192,112,64,0.2)] md:h-10 md:w-10"
                />
              </div>
              <div>
                <span className="block text-[15px] font-black tracking-tight text-white md:text-base">
                  Smail <span className="gradient-text">Store</span>
                </span>
                <span className="block text-[9px] text-text-muted leading-none">
                  جودة عالمية، روح مغربية
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-xl px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-text-secondary hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-brand-terracotta"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <motion.button
                onClick={toggleCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-sm font-medium text-gray-200 transition-all hover:border-white/15 hover:bg-white/[0.10]"
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
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                  />
                </svg>
                <AnimatePresence mode="wait">
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="hidden min-w-[18px] items-center justify-center rounded-full bg-brand-terracotta px-1.5 py-0.5 text-[10px] font-bold text-white sm:flex"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-terracotta text-[9px] font-bold text-white shadow-terracotta-sm sm:hidden">
                    {count}
                  </span>
                )}
              </motion.button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.06] p-2.5 text-gray-300 transition-colors hover:bg-white/[0.10] hover:text-white md:hidden"
                aria-label="Menu"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </motion.svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mx-3 mt-1.5 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0A0A0E]/96 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden"
            >
              <div className="p-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                        pathname === link.href
                          ? "bg-brand-terracotta/10 text-brand-terracotta"
                          : "text-text-secondary hover:bg-white/[0.07] hover:text-white"
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-terracotta" />
                      )}
                    </Link>
                  </motion.div>
                ))}
                <div className="my-2 h-px bg-white/[0.07]" />
                <div className="flex gap-2 px-2 pb-1">
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl py-2.5 text-center text-xs font-medium text-text-muted hover:text-white transition-colors"
                  >
                    من نحن
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl py-2.5 text-center text-xs font-medium text-text-muted hover:text-white transition-colors"
                  >
                    اتصل بنا
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
