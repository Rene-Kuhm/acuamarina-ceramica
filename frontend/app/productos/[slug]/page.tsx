import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import type { Producto } from "@/lib/api/productos";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchProduct(slug: string): Promise<Producto | null> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error(`Error fetching product ${slug}:`, res.statusText);
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

function buildDescription(description?: string) {
  if (!description) return "Descubre los mejores cerámicos de Aguamarina Mosaicos.";
  return description.length > 160 ? `${description.slice(0, 157)}...` : description;
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product || product.isActive === false) {
    return {
      title: "Producto no encontrado | Aguamarina Mosaicos",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = buildDescription(product.description);
  const canonical = `/productos/${product.slug}`;
  const image = product.images?.[0] || "/logo.png";

  return {
    title: `${product.name} | Aguamarina Mosaicos`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product || product.isActive === false) {
    notFound();
  }

  return <ProductDetailClient slug={slug} initialProduct={product} />;
}
