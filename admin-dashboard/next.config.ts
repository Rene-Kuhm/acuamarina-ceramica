import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deshabilitar Strict Mode temporalmente debido a incompatibilidad conocida
  // entre React 19 y Radix UI Portals (AlertDialog, Popover, etc.)
  // Referencia: https://github.com/radix-ui/primitives/issues/2460
  // TODO: Re-habilitar cuando Radix UI tenga soporte completo para React 19
  reactStrictMode: false,
};

export default nextConfig;
