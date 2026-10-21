import type { Metadata } from "next";
import { Gloock, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import Nav from "@/components/nav";
import SmoothScroll from "@/components/smooth-scroll";
import { Footer } from "@/components/sections";

const gloock = Gloock({
  variable: "--font-gloock",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  weight: ["600", "700"],
  style: "italic",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Coffero — Iced Coffee", template: "%s · Coffero" },
  description: "Slow-steeped cold brew, poured over ice and finished with a ribbon of salted caramel.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${gloock.variable} ${playfair.variable} ${manrope.variable} antialiased`}
    >
      <body className="font-sans">
        <CartProvider>
          <SmoothScroll />
          <Nav />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
