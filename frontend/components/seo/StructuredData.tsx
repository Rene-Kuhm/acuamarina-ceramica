export function StructuredData() {
  // Local Comercial (ubicación principal)
  const localComercial = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": "https://aguamarinamosaicos.com/#local-comercial",
    name: "Aguamarina Mosaicos - Local Comercial",
    description: "Tu tienda de cerámicos de confianza en Sierra Grande. Calidad, diseño y precios accesibles.",
    url: "https://aguamarinamosaicos.com",
    logo: "https://aguamarinamosaicos.com/logo-aguamarina.png",
    image: "https://aguamarinamosaicos.com/logo-aguamarina.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Avenida Buccino y Piquillines",
      addressLocality: "Playas Doradas - Sierra Grande",
      addressRegion: "Río Negro",
      addressCountry: "AR",
    },
    telephone: ["+54 9 2334 404670", "+54 9 2334 404331"],
    email: "contacto@aguamarinamosaicos.com",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "17:00",
        closes: "23:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/aguamarinamosaicos",
      "https://www.instagram.com/aguamarina_mosaicos1980/",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://aguamarinamosaicos.com/buscar?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Showroom Eduardo Castex
  const showroom = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": "https://aguamarinamosaicos.com/#showroom",
    name: "Aguamarina Mosaicos - Showroom Eduardo Castex",
    description: "Showroom de cerámicos y mosaicos en Eduardo Castex, La Pampa.",
    url: "https://aguamarinamosaicos.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Palacios 254",
      addressLocality: "Eduardo Castex",
      addressRegion: "La Pampa",
      addressCountry: "AR",
    },
    telephone: ["+54 9 2334 404670", "+54 9 2334 404331"],
    email: "contacto@aguamarinamosaicos.com",
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
      description: "Horario a convenir - Contactar previamente",
    },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [localComercial, showroom],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
