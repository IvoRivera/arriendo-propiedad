// CoastalGallery.tsx — 3 separated gallery carousels
// Scalable: add images to mockData.ts galleryData arrays. No component changes needed.
// data-stitch-id: gallery-section (screen: 75756b60186b4c8da17437331f094caa)

import React from "react";
import { GalleryCarousel } from "@/components/coastal/GalleryCarousel";
import { galleryData } from "@/data/mockData";

interface CoastalGalleryProps {
  readonly className?: string;
  onAction?: () => void;
  dynamicImages?: any[];
}

export const CoastalGallery: React.FC<CoastalGalleryProps> = ({ className = "", onAction, dynamicImages = [] }) => {
  const { featured, interiors, amenities } = galleryData;

  // Helper to merge or replace images
  const getImages = (category: string, defaultImages: string[]) => {
    const dynamic = dynamicImages
      .filter(img => img.category === category)
      .sort((a, b) => a.priority - b.priority)
      .map(img => `${img.url}?v=${new Date(img.created_at).getTime()}`);

    return dynamic.length > 0 ? dynamic : defaultImages;
  };

  const featuredImages = getImages('featured', featured.images);
  const interiorsImages = getImages('property', interiors.images);
  const amenitiesImages = getImages('amenities', amenities.images);

  return (
    // data-stitch-id: gallery-root
    <section className={`border-t border-[#e2d9cc] ${className}`}>

      {/* A. DESTACADAS — emotional impact, alternating bg */}
      <GalleryCarousel
        title={featured.title}
        subtitle={featured.subtitle}
        images={featuredImages}
        ctaText={featured.ctaText}
        onAction={onAction}
        bgColor="bg-[#f5f0e8]"
      />

      {/* B. EL DEPARTAMENTO — interior walkthrough */}
      <div className="border-t border-[#e2d9cc]">
        <GalleryCarousel
          title={interiors.title}
          subtitle={interiors.subtitle}
          images={interiorsImages}
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
          images={amenitiesImages}
          ctaText={amenities.ctaText}
          onAction={onAction}
          bgColor="bg-[#f5f0e8]"
        />
      </div>

    </section>
  );
};

export default CoastalGallery;
