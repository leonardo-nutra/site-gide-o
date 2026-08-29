import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/CartDrawer";
import { MetaPixel } from "@/components/MetaPixel";
import { UtmCapture } from "@/components/UtmCapture";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Gideão Atacadão da Construção | Todo dia é dia de ofertas",
  description:
    "Pisos, porcelanatos, tintas, torneiras, portas, janelas e materiais de construção com preço de atacado em Mesquita, na Baixada Fluminense. Peça seu orçamento pelo WhatsApp.",
  appleWebApp: {
    title: "Gideão",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffdf8" },
    { media: "(prefers-color-scheme: dark)", color: "#16130d" },
  ],
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('gideao-theme');
    var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${archivo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <MetaPixel />
        <UtmCapture />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
