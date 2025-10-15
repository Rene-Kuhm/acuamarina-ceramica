import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deshabilitar Strict Mode temporalmente debido a incompatibilidad conocida
  // entre React 19 y Radix UI Portals (AlertDialog, Popover, etc.)
  // Referencia: https://github.com/radix-ui/primitives/issues/2460
  // TODO: Re-habilitar cuando Radix UI tenga soporte completo para React 19
  reactStrictMode: false,

  // Permitir imágenes de dominios externos
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
