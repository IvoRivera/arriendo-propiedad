// CoastalGallery.tsx — 3 separated gallery carousels
// data-stitch-id: gallery-section (screen: 75756b60186b4c8da17437331f094caa)

import React from "react";
import { GalleryCarousel } from "@/components/coastal/GalleryCarousel";
import { IMAGE_FALLBACKS } from "@/config/image-fallbacks";

interface CoastalGalleryProps {
  readonly className?: string;
  onAction?: () => void;
  dynamicImages?: any[];
}

export const CoastalGallery: React.FC<CoastalGalleryProps> = ({ className = "", onAction, dynamicImages = [] }) => {
  // Helper to merge or replace images with local fallbacks
  const getImages = (category: string, fallbackKey: string) => {
    const dynamic = (dynamicImages || [])
      .filter(img => img.category === category && img.url)
      .sort((a, b) => a.priority - b.priority)
      .map(img => ({
        src: `${img.url}?v=${new Date(img.created_at).getTime()}`,
        alt: img.metadata?.alt || "Vista de la propiedad"
      }));

    return dynamic.length > 0 ? dynamic : IMAGE_FALLBACKS[fallbackKey] || [];
  };

  const featuredImages = getImages('featured', 'featured');
  const interiorsImages = getImages('property', 'property');
  const amenitiesImages = getImages('amenities', 'amenities');

  return (
    // data-stitch-id: gallery-root
    <section className={`border-t border-[#e2d9cc] ${className}`}>

      {/* A. DESTACADAS — emotional impact, alternating bg */}
      <GalleryCarousel
        title="Vistas que se quedan contigo"
        subtitle="Lo primero que ves al abrir la puerta."
        images={featuredImages}
        ctaText="Solicitud de Reserva"
        onAction={onAction}
        bgColor="bg-[#f5f0e8]"
      />

      {/* B. EL DEPARTAMENTO — interior walkthrough */}
      <div className="border-t border-[#e2d9cc]">
        <GalleryCarousel
          title="Tu espacio frente al mar"
          subtitle="Luz natural, calma y todo listo para que simplemente llegues a disfrutar."
          images={interiorsImages}
          ctaText="Solicitud de Reserva"
          onAction={onAction}
          bgColor="bg-[#faf7f2]"
        />
      </div>

      {/* C. AMENIDADES — building common areas */}
      <div className="border-t border-[#e2d9cc]">
        <GalleryCarousel
          title="Donde empieza tu descanso"
          subtitle="Un lugar pensado para bajar el ritmo y sentirte cómodo desde el primer momento."
          images={amenitiesImages}
          ctaText="Solicitud de Reserva"
          onAction={onAction}
          bgColor="bg-[#f5f0e8]"
        />
      </div>

    </section>
  );
};

export default CoastalGallery;
