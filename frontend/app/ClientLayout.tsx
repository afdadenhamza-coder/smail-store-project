"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import UpsellTimer from "@/components/UpsellTimer";
import BackToTop from "@/components/BackToTop";

import { useRouter, usePathname } from "next/navigation";
import { trackClick } from "@/lib/admin-api";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [upsellData, setUpsellData] = useState<{
    customer_name: string;
    customer_phone: string;
    event_id: string;
  } | null>(null);
  const [, setOrderResult] = useState<{
    order_number: string;
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (pathname && !isAdmin) {
      trackClick(pathname);
    }
  }, [pathname, isAdmin]);

  const handleCheckout = useCallback(() => {
    setCheckoutOpen(true);
  }, []);

  const handleShowUpsell = useCallback(
    (data: {
      customer_name: string;
      customer_phone: string;
      event_id: string;
    }) => {
      setCheckoutOpen(false);
      setUpsellData(data);
    },
    [],
  );

  const handleUpsellComplete = useCallback(
    (result: { order_number: string }) => {
      setUpsellData(null);
      setOrderResult(result);
      sessionStorage.setItem("order_number", result.order_number);
      router.push("/thank-you");
    },
    [router],
  );

  const handleCloseUpsell = useCallback(() => {
    setUpsellData(null);
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        href="https://wa.me/212612345678?text=مرحبا%2C+عندي+سؤال+على+المنتجات"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-40 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all"
        aria-label="واتساب"
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
        />
      </motion.a>

      <CartDrawer onCheckout={handleCheckout} />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onShowUpsell={handleShowUpsell}
      />
      {upsellData && (
        <UpsellTimer
          {...upsellData}
          onComplete={handleUpsellComplete}
          onClose={handleCloseUpsell}
        />
      )}
      <BackToTop />
    </>
  );
}
