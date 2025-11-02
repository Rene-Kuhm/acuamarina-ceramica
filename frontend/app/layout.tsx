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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aguamarinamosaicos.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Aguamarina Mosaicos - Tu tienda de cerámicos de calidad",
    template: "%s | Aguamarina Mosaicos",
  },
  description:
    "Descubre la mejor selección de cerámicos para tu hogar. Calidad, diseño y precios accesibles en Aguamarina Mosaicos.",
  keywords:
    "cerámicos, azulejos, pisos, revestimientos, construcción, decoración, mosaicos, porcelanato",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/android-icon-192x192.png',
      },
    ],
  },
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
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
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
