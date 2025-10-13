import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ComparisonBar } from "@/components/productos/ComparisonBar";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { StructuredData } from "@/components/seo/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  authors: [{ name: "Aguamarina Mosaicos" }],
  creator: "Aguamarina Mosaicos",
  publisher: "Aguamarina Mosaicos",
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
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Aguamarina Mosaicos",
    title: "Aguamarina Mosaicos - Tu tienda de cerámicos de calidad",
    description:
      "Descubre la mejor selección de cerámicos para tu hogar. Calidad, diseño y precios accesibles en Aguamarina Mosaicos.",
    images: [
      {
        url: "/logo-aguamarina.png",
        width: 1200,
        height: 630,
        alt: "Aguamarina Mosaicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aguamarina Mosaicos - Tu tienda de cerámicos de calidad",
    description:
      "Descubre la mejor selección de cerámicos para tu hogar. Calidad, diseño y precios accesibles.",
    images: ["/logo-aguamarina.png"],
    creator: "@aguamarinamosaicos",
  },
  icons: {
    icon: [
      { url: '/logo-aguamarina.png' },
      { url: '/logo-aguamarina.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-aguamarina.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-aguamarina.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo-aguamarina.png',
  },
  verification: {
    google: "google-site-verification-code-here",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aguamarina Mosaicos",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SkipToContent />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <ComparisonBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
