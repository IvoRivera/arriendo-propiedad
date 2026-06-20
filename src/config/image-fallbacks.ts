/**
 * Local fallback images used when Supabase gallery data is unavailable.
 * Alt text is descriptive because these images carry local SEO context.
 */

export interface FallbackImage {
  src: string;
  alt: string;
}

export const IMAGE_FALLBACKS: Record<string, FallbackImage[]> = {
  featured: [
    {
      src: "/images/destacadas/01-vista-entrada.webp",
      alt: "Vista panoramica del departamento frente al mar en Cuatro Esquinas La Serena",
    },
    {
      src: "/images/destacadas/02-cocina-sillon-ventana.webp",
      alt: "Living y cocina equipada de departamento en Avenida del Mar La Serena",
    },
    {
      src: "/images/destacadas/03-vista-balcon.webp",
      alt: "Vista al mar desde balcon de departamento en La Serena",
    },
  ],
  property: [
    {
      src: "/images/el-departamento/01-vista-entrada.webp",
      alt: "Entrada de departamento vacacional en sector Cuatro Esquinas La Serena",
    },
    {
      src: "/images/el-departamento/03-living-comedor3.webp",
      alt: "Living comedor luminoso de alojamiento frente a la playa en La Serena",
    },
    {
      src: "/images/el-departamento/08-habitacion1.webp",
      alt: "Dormitorio principal de departamento con vista al mar en La Serena",
    },
  ],
  amenities: [
    {
      src: "/images/amenidades/03-piscina-dia.webp",
      alt: "Piscina del Edificio Playa Serena en Avenida del Mar",
    },
    {
      src: "/images/amenidades/04-quincho.webp",
      alt: "Quincho y areas comunes del condominio frente al mar en La Serena",
    },
    {
      src: "/images/amenidades/frontis-condominio.webp",
      alt: "Frontis del Edificio Playa Serena en Cuatro Esquinas La Serena",
    },
  ],
  hero: [
    {
      src: "/images/destacadas/03-vista-balcon.webp",
      alt: "Vista al mar desde departamento en Cuatro Esquinas La Serena",
    },
  ],
};
