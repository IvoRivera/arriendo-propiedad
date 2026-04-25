/**
 * image-fallbacks.ts
 * Dedicated configuration for local image fallbacks.
 * These images are used only when Supabase data is unavailable or empty.
 * Paths point to assets in /public/images/.
 */

export interface FallbackImage {
  src: string;
  alt: string;
}

export const IMAGE_FALLBACKS: Record<string, FallbackImage[]> = {
  featured: [
    { src: "/images/destacadas/01-vista-entrada.webp", alt: "Vista desde la entrada" },
    { src: "/images/destacadas/02-cocina-sillon-ventana.webp", alt: "Cocina y estar" },
    { src: "/images/destacadas/03-vista-balcon.webp", alt: "Vista al mar desde el balcón" },
  ],
  property: [
    { src: "/images/el-departamento/01-vista-entrada.webp", alt: "Entrada del departamento" },
    { src: "/images/el-departamento/03-living-comedor3.webp", alt: "Living comedor" },
    { src: "/images/el-departamento/08-habitacion1.webp", alt: "Dormitorio principal" },
  ],
  amenities: [
    { src: "/images/amenidades/03-piscina-dia.webp", alt: "Piscina del condominio" },
    { src: "/images/amenidades/04-quincho.webp", alt: "Zona de quinchos" },
    { src: "/images/amenidades/frontis-condominio.webp", alt: "Fachada del edificio" },
  ],
  hero: [
    { src: "/images/destacadas/01-vista-entrada.webp", alt: "Vista principal frente al mar" }
  ]
};
