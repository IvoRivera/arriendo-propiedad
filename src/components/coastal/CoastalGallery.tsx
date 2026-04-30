"use client";

import React, { useState } from "react";
import Image from "next/image";
import { EditorialGallery } from "@/components/coastal/EditorialGallery";
import { Lightbox } from "@/components/coastal/Lightbox";
import { IMAGE_FALLBACKS } from "@/config/image-fallbacks";
import { SITE_CONTENT } from "@/config/site-content";
import { ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface CoastalGalleryProps {
  readonly className?: string;
  onAction?: () => void;
  dynamicImages?: any[];
}

export const CoastalGallery: React.FC<CoastalGalleryProps> = ({ className = "", onAction, dynamicImages = [] }) => {
  const [openGallery, setOpenGallery] = useState<'interiors' | 'amenities' | null>(null);

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

      {/* A. DESTACADAS — emotional impact, static editorial grid */}
      <EditorialGallery
        title={SITE_CONTENT.gallery.featured.title}
        subtitle={SITE_CONTENT.gallery.featured.subtitle}
        images={featuredImages}
        bgColor="bg-[#f5f0e8]"
      />

      {/* B. SECONDARY EXPLORATION — Minimalist editorial cards */}
      <div className="bg-[#f5f0e8] px-6 pb-20 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          
          {/* Card: Interiors */}
          <button
            onClick={() => setOpenGallery('interiors')}
            className="flex items-center gap-6 p-6 md:p-8 rounded-[2rem] bg-[#faf7f2] hover:bg-white transition-all duration-700 group border border-[#e2d9cc]/30 text-left"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-2xl flex-shrink-0">
              <Image 
                src={interiorsImages[0]?.src || ""} 
                alt="Interiores" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#8a7a6a] mb-2 block">Recorrido</span>
              <h3 className="text-xl md:text-2xl font-serif italic text-[#2c2416] leading-tight">
                Recorrer el departamento
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#e2d9cc] flex items-center justify-center group-hover:bg-[#00628f] group-hover:border-[#00628f] transition-all duration-500">
              <ChevronRight className="w-4 h-4 text-[#8a7a6a] group-hover:text-white transition-colors" />
            </div>
          </button>

          {/* Card: Amenities */}
          <button
            onClick={() => setOpenGallery('amenities')}
            className="flex items-center gap-6 p-6 md:p-8 rounded-[2rem] bg-[#faf7f2] hover:bg-white transition-all duration-700 group border border-[#e2d9cc]/30 text-left"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-2xl flex-shrink-0">
              <Image 
                src={amenitiesImages[0]?.src || ""} 
                alt="Amenidades" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-[#8a7a6a] mb-2 block">Espacios Comunes</span>
              <h3 className="text-xl md:text-2xl font-serif italic text-[#2c2416] leading-tight">
                Explorar amenidades
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#e2d9cc] flex items-center justify-center group-hover:bg-[#00628f] group-hover:border-[#00628f] transition-all duration-500">
              <ChevronRight className="w-4 h-4 text-[#8a7a6a] group-hover:text-white transition-colors" />
            </div>
          </button>

        </div>
      </div>

      {/* Lightbox Overlays — Fullscreen immersion */}
      <AnimatePresence mode="wait">
        {openGallery === 'interiors' && (
          <Lightbox 
            key="interiors-lightbox"
            images={interiorsImages} 
            onClose={() => setOpenGallery(null)} 
          />
        )}
        {openGallery === 'amenities' && (
          <Lightbox 
            key="amenities-lightbox"
            images={amenitiesImages} 
            onClose={() => setOpenGallery(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CoastalGallery;
