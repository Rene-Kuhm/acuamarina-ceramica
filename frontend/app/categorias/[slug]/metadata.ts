import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // In production, fetch category data from API
  // const category = await fetch(`${API_URL}/categories/${params.slug}`).then(res => res.json());

  return {
    title: `Categoría - ${params.slug}`,
    description: `Explora nuestra categoría de ${params.slug}. Encuentra los mejores productos de cerámicos y revestimientos.`,
    openGraph: {
      title: `Categoría - ${params.slug} | Aguamarina Mosaicos`,
      description: `Explora nuestra categoría de ${params.slug}. Encuentra los mejores productos.`,
      type: "website",
      images: [
        {
          url: "/logo-aguamarina.png",
          width: 1200,
          height: 630,
          alt: params.slug,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Categoría - ${params.slug} | Aguamarina Mosaicos`,
      description: `Explora nuestra categoría de ${params.slug}.`,
    },
  };
}
