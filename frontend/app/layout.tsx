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
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://aguamarinamosaicos.com"),
  title: {
    default: "Aguamarina Mosaicos - Tu tienda de cerámicos de calidad",
    template: "%s | Aguamarina Mosaicos",
  },
  description:
    "Descubre la mejor selección de cerámicos para tu hogar. Calidad, diseño y precios accesibles en Aguamarina Mosaicos.",
  keywords:
    "cerámicos, azulejos, pisos, revestimientos, construcción, decoración, mosaicos, porcelanato",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://aguamarinamosaicos.com",
    siteName: "Aguamarina Mosaicos",
    title: "Aguamarina Mosaicos - Tu tienda de cerámicos de calidad",
    description: "Descubre la mejor selección de cerámicos para tu hogar. Calidad, diseño y precios accesibles.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Aguamarina Mosaicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aguamarina Mosaicos - Tu tienda de cerámicos de calidad",
    description: "Descubre la mejor selección de cerámicos para tu hogar",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
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
            <Toaster position="bottom-right" richColors />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
