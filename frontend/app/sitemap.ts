import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aguamarina-mosaicos.com";
  const now = new Date();

  // All static pages with optimized priorities
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage - Highest priority
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Main product pages
    {
      url: `${baseUrl}/productos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Categories
    {
      url: `${baseUrl}/categorias`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Important pages
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // User features
    {
      url: `${baseUrl}/carrito`,
      lastModified: now,
      changeFrequency: "always",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/favoritos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/comparar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // Search
    {
      url: `${baseUrl}/buscar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    // Auth pages
    {
      url: `${baseUrl}/auth/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic pages can be added here when backend is connected
  // Example for production:
  /*
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Fetch products
    const productsRes = await fetch(`${API_URL}/products?limit=1000`);
    const products = await productsRes.json();
    const productPages = products.data.map((product: any) => ({
      url: `${baseUrl}/productos/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Fetch categories
    const categoriesRes = await fetch(`${API_URL}/categories`);
    const categories = await categoriesRes.json();
    const categoryPages = categories.map((category: any) => ({
      url: `${baseUrl}/categorias/${category.slug}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
  } catch (error) {
    console.error('Error fetching dynamic sitemap data:', error);
    return staticPages;
  }
  */

  return staticPages;
}
