// CoastalGallery.tsx — 3 separated gallery carousels
// Scalable: add images to mockData.ts galleryData arrays. No component changes needed.
// data-stitch-id: gallery-section (screen: 75756b60186b4c8da17437331f094caa)

import React from "react";
import { GalleryCarousel } from "@/components/coastal/GalleryCarousel";
import { galleryData } from "@/data/mockData";

interface CoastalGalleryProps {
  readonly className?: string;
  onAction?: () => void;
}

export const CoastalGallery: React.FC<CoastalGalleryProps> = ({ className = "", onAction }) => {
  const { featured, interiors, amenities } = galleryData;

  return (
    // data-stitch-id: gallery-root
    <section className={`border-t border-[#e2d9cc] ${className}`}>

      {/* A. DESTACADAS — emotional impact, alternating bg */}
      <GalleryCarousel
        title={featured.title}
        subtitle={featured.subtitle}
        images={featured.images}
        ctaText={featured.ctaText}
        onAction={onAction}
        bgColor="bg-[#f5f0e8]"
      />

      {/* B. EL DEPARTAMENTO — interior walkthrough */}
      <div className="border-t border-[#e2d9cc]">
        <GalleryCarousel
          title={interiors.title}
          subtitle={interiors.subtitle}
          images={interiors.images}
          ctaText={interiors.ctaText}
          onAction={onAction}
          bgColor="bg-[#faf7f2]"
        />
      </div>

      {/* C. AMENIDADES — building common areas */}
      <div className="border-t border-[#e2d9cc]">
        <GalleryCarousel
          title={amenities.title}
          subtitle={amenities.subtitle}
          images={amenities.images}
          ctaText={amenities.ctaText}
          onAction={onAction}
          bgColor="bg-[#f5f0e8]"
        />
      </div>

    </section>
  );
};

export default CoastalGallery;
