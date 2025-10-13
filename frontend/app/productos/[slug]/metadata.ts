import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // In production, fetch product data from API
  // const product = await fetch(`${API_URL}/products/${params.slug}`).then(res => res.json());

  return {
    title: `Producto - ${params.slug}`,
    description: `Descubre nuestro producto ${params.slug}. Calidad garantizada y los mejores precios del mercado.`,
    openGraph: {
      title: `Producto - ${params.slug} | Aguamarina Mosaicos`,
      description: `Descubre nuestro producto ${params.slug}. Calidad garantizada y los mejores precios del mercado.`,
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
      title: `Producto - ${params.slug} | Aguamarina Mosaicos`,
      description: `Descubre nuestro producto ${params.slug}. Calidad garantizada.`,
    },
  };
}
