import { MetadataRoute } from "next";

interface Product {
  slug: string;
  updated_at?: string;
}

interface Category {
  slug: string;
  updated_at?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aguamarinamosaicos.com";
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

  // Fetch dynamic content from API
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
      console.warn('NEXT_PUBLIC_API_URL not configured, returning static sitemap');
      return staticPages;
    }

    const dynamicPages: MetadataRoute.Sitemap = [];

    // Fetch products
    try {
      const productsRes = await fetch(`${API_URL}/products?limit=1000`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const products = productsData.data || [];

        const productPages = products.map((product: Product) => ({
          url: `${baseUrl}/productos/${product.slug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));

        dynamicPages.push(...productPages);
      }
    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
    }

    // Fetch categories
    try {
      const categoriesRes = await fetch(`${API_URL}/categories`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];

        const categoryPages = categories.map((category: Category) => ({
          url: `${baseUrl}/categorias/${category.slug}`,
          lastModified: category.updated_at ? new Date(category.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }));

        dynamicPages.push(...categoryPages);
      }
    } catch (error) {
      console.error('Error fetching categories for sitemap:', error);
    }

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticPages;
  }
}
