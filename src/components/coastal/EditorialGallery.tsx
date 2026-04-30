"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface EditorialGalleryProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly images: { src: string; alt: string }[];
  readonly bgColor?: string;
}

export const EditorialGallery: React.FC<EditorialGalleryProps> = ({
  title,
  subtitle,
  images = [],
  bgColor = "bg-[#faf7f2]",
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) return null;

  // We take up to 5 images for the narrative editorial layout
  const displayImages = images.slice(0, 5);

  return (
    <section className={`${bgColor} py-20 md:py-40 overflow-hidden`}>
      {/* Header with generous spacing */}
      <div className="px-6 md:px-12 mb-20 md:mb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-7xl font-serif font-normal text-[#2c2416] mb-8 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#8a7a6a] text-lg md:text-2xl font-light max-w-2xl leading-relaxed opacity-80 italic mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Narrative Vertical Stack */}
        <div className="flex flex-col gap-24 md:gap-48">
          {displayImages.map((img, index) => (
            <div
              key={index}
              className={`flex flex-col gap-8 md:gap-16 items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
            >
              {/* Image Block (70-80% width) */}
              <div
                className={`w-full md:w-[75%] relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-[3rem] aspect-[4/3] md:aspect-[16/9] ${
                  index === displayImages.length - 1 && images.length > 5 ? "mask-fade-bottom" : ""
                }`}
                onClick={() => setLightboxIndex(index)}
              >
                {index === displayImages.length - 1 && images.length > 5 && (
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/40 to-transparent z-20 pointer-events-none" />
                )}
                <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority={index === 0}
                />
              </div>

              {/* Narrative Text Block (20-25% width) */}
              <div className="w-full md:w-[25%] px-4 md:px-0">
                <div className={`flex flex-col ${index % 2 === 0 ? "md:items-start" : "md:items-end text-right"}`}>
                  <span className="text-xs font-sans font-medium uppercase tracking-[0.4em] text-[#c8883a] mb-6">
                    Momento {index + 1}
                  </span>
                  <p className="text-[#2c2416] text-xl md:text-2xl font-serif font-light leading-relaxed italic opacity-90">
                    {img.alt || "La esencia del descanso frente al mar."}
                  </p>
                  <div className="mt-8 h-[1px] w-12 bg-[#e2d9cc]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Immersive Gallery Climax */}
        {images.length > 5 && (
          <div className="mt-8 md:mt-12 flex justify-center">
            <button
              onClick={() => setLightboxIndex(0)}
              className="w-full md:w-[75%] group relative flex flex-col items-center justify-center py-10 md:py-16 px-8 rounded-2xl md:rounded-[3rem] bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl border border-[#e2d9cc]/40 shadow-xl shadow-[#002a45]/5 hover:shadow-2xl hover:shadow-[#002a45]/10 transition-all duration-700 active:scale-[0.99] overflow-hidden"
            >
              {/* Subtle accent light */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00628f]/5 blur-[80px] rounded-full group-hover:bg-[#00628f]/10 transition-colors duration-700" />
              
              <div className="relative flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full border border-[#002a45]/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500 bg-white/50">
                  <Plus className="w-5 h-5 text-[#002a45]" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-sm md:text-base font-sans font-bold uppercase tracking-[0.3em] text-[#002a45]">
                  Explorar galería completa
                </h3>
                
                <p className="text-[10px] md:text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#8a7a6a] mt-1">
                  Ver {images.length - 5} fotos adicionales
                </p>
              </div>

              {/* Hover highlight border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#002a45]/5 rounded-2xl md:rounded-[3rem] transition-colors pointer-events-none" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {lightboxIndex !== null && (
          <Lightbox
            key="editorial-lightbox"
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default EditorialGallery;
