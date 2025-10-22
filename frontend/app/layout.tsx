import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { HeaderPremium as Header } from "@/components/layout/HeaderPremium";
import { Footer } from "@/components/layout/Footer";
import { ComparisonBar } from "@/components/productos/ComparisonBar";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { StructuredData } from "@/components/seo/StructuredData";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { CustomCursor } from "@/components/animations/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://aguamarina-mosaicos.com"),
  title: {
    default: "Aguamarina Mosaicos - Tu tienda de cerámicos de calidad",
    template: "%s | Aguamarina Mosaicos",
  },
  description:
    "Descubre la mejor selección de cerámicos para tu hogar. Calidad, diseño y precios accesibles en Aguamarina Mosaicos.",
  keywords:
    "cerámicos, azulejos, pisos, revestimientos, construcción, decoración, mosaicos, porcelanato",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <SmoothScroll>
            <CustomCursor />
            <SkipToContent />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">{children}</main>
              <Footer />
              <ComparisonBar />
            </div>
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
