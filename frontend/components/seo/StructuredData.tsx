export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Aguamarina Mosaicos",
    description: "Tu tienda de cerámicos de confianza. Calidad, diseño y precios accesibles.",
    url: "https://aguamarina-mosaicos.com",
    logo: "https://aguamarina-mosaicos.com/logo-aguamarina.png",
    image: "https://aguamarina-mosaicos.com/logo-aguamarina.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Corrientes 1234",
      addressLocality: "Buenos Aires",
      addressRegion: "CABA",
      postalCode: "C1043",
      addressCountry: "AR",
    },
    telephone: "+54 11 1234-5678",
    email: "info@aguamarina.com",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/aguamarinamosaicos",
      "https://www.instagram.com/aguamarinamosaicos",
      "https://twitter.com/aguamarinamosaicos",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://aguamarina-mosaicos.com/buscar?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
