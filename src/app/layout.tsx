import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteTitle, siteDescription } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";
import "./base.css";

const playfair = localFont({
  src: "../fonts/playfair-display.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl ?? "http://localhost:3000"),
  title: {
    default: siteTitle,
    template: "%s | Gültekin Peyzaj",
  },
  description: siteDescription,
  openGraph: {
    locale: "tr_TR",
    type: "website",
    siteName: "Gültekin Peyzaj",
    title: "Gültekin Peyzaj",
    description:
      "Doğaya değer katarız. Samsun ve çevresinde peyzaj ve bahçe bakımı.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth" className={playfair.variable}>
      <body>{children}</body>
    </html>
  );
}
