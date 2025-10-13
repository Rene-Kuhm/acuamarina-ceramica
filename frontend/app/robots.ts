import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aguamarina-mosaicos.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/cuenta/",
          "/carrito/",
          "/checkout/",
          "/pedidos/",
          "/auth/forgot-password",
          "/auth/reset-password",
          "/*?*", // Block query parameters from being indexed
        ],
        crawlDelay: 1,
      },
      // Special rules for major search engines
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/cuenta/", "/carrito/", "/checkout/", "/pedidos/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/cuenta/", "/carrito/", "/checkout/", "/pedidos/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
