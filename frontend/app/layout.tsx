import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootClientLayout from "./root-client-layout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smail Store | جودة عالمية، روح مغربية",
  description:
    "أول ماركة مغربية ديال الستريوير بشهادة الجودة. تيشيرتات، هوديات، بناطل و جواكيط. التوصيل ف 3-5 أيام و الدفع عند الإستلام.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable}`}>
      <body className="font-inter antialiased">
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
