import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import React from "react";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aguamarina Mosaicos - Admin Dashboard",
  description: "Panel de administración para gestión de productos y pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning previene warning de hidratación por la clase 'dark' añadida dinámicamente
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Script que se ejecuta antes de React para prevenir FOUC y aplicar el tema inicial */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
            try{
              var t = null;
              try { t = localStorage.getItem('theme'); } catch(e) { t = null; }
              if(t === 'dark'){ document.documentElement.classList.add('dark'); return; }
              if(t === 'light'){ document.documentElement.classList.remove('dark'); return; }
              if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }catch(e){}
          })();`}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
