import { SITE_CONTENT } from "@/config/site-content";
import type { Property } from "@/types/property";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://departamento-ls.vercel.app";

export const PROPERTY_NAME =
  "Departamento frente al mar en Cuatro Esquinas La Serena";

export const SEO_TITLE =
  "Arriendo departamento en La Serena frente al mar | Cuatro Esquinas";

export const SEO_DESCRIPTION =
  "Departamento en arriendo vacacional en La Serena, sector Cuatro Esquinas. Primera linea frente al mar, piso 11, vista panoramica al oceano, estacionamiento, WiFi y seguridad 24/7.";

export const SEO_KEYWORDS = [
  "arriendo departamento la serena",
  "departamento frente al mar la serena",
  "alojamiento la serena frente playa",
  "arriendo vacacional la serena",
  "departamento cuatro esquinas la serena",
  "alojamiento primera linea playa la serena",
  "departamento vista al mar la serena",
  "vacaciones en la serena",
  "departamento avenida del mar la serena",
  "alojamiento playa cuatro esquinas",
];

export const OG_IMAGE = "/images/destacadas/03-vista-balcon.webp";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getWhatsAppHref(source = "sitio-web") {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (!rawNumber) return null;

  const message = encodeURIComponent(
    `Hola, quiero consultar disponibilidad para el departamento frente al mar en La Serena. Origen: ${source}.`
  );

  return `https://wa.me/${rawNumber}?text=${message}`;
}

export function buildPropertyJsonLd(property?: Property | null) {
  const basePrice = property?.base_price || 90000;
  const images = [
    absoluteUrl("/images/destacadas/03-vista-balcon.webp"),
    absoluteUrl("/images/destacadas/01-vista-entrada.webp"),
    absoluteUrl("/images/el-departamento/03-living-comedor3.webp"),
    absoluteUrl("/images/amenidades/03-piscina-dia.webp"),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VacationRental",
        "@id": `${SITE_URL}/#vacation-rental`,
        name: PROPERTY_NAME,
        description: SEO_DESCRIPTION,
        url: SITE_URL,
        image: images,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONTENT.site.address,
          addressLocality: "La Serena",
          addressRegion: "Coquimbo",
          addressCountry: "CL",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -29.900539,
          longitude: -71.26871,
        },
        containsPlace: {
          "@type": "Accommodation",
          name: "Departamento piso 11 con vista panoramica al oceano",
          occupancy: {
            "@type": "QuantitativeValue",
            maxValue: 4,
          },
          numberOfRooms: 2,
          floorSize: {
            "@type": "QuantitativeValue",
            value: 79,
            unitCode: "MTK",
          },
          amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Primera linea frente al mar", value: true },
            { "@type": "LocationFeatureSpecification", name: "Vista panoramica al oceano", value: true },
            { "@type": "LocationFeatureSpecification", name: "Estacionamiento privado", value: true },
            { "@type": "LocationFeatureSpecification", name: "WiFi de alta velocidad", value: true },
            { "@type": "LocationFeatureSpecification", name: "Seguridad 24/7", value: true },
          ],
        },
        offers: {
          "@type": "Offer",
          price: basePrice,
          priceCurrency: "CLP",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/#availability`,
        },
      },
      {
        "@type": "LodgingBusiness",
        "@id": `${SITE_URL}/#lodging-business`,
        name: "Arriendo vacacional frente al mar en La Serena",
        url: SITE_URL,
        image: images,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONTENT.site.address,
          addressLocality: "La Serena",
          addressRegion: "Coquimbo",
          addressCountry: "CL",
        },
        priceRange: "$$",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "18",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#local-business`,
        name: "Departamento en La Serena Cuatro Esquinas",
        url: SITE_URL,
        areaServed: ["La Serena", "Cuatro Esquinas", "Avenida del Mar", "Region de Coquimbo"],
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONTENT.site.address,
          addressLocality: "La Serena",
          addressRegion: "Coquimbo",
          addressCountry: "CL",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: SITE_CONTENT.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
