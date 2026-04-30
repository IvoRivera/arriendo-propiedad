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

  // We take up to 3 images for the narrative editorial layout
  const displayImages = images.slice(0, 3);

  return (
    <section className={`${bgColor} py-20 md:pt-40 md:pb-10 overflow-hidden`}>
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
                className={`w-full md:w-[75%] relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-[3rem] aspect-[4/3] md:aspect-[16/9] ${index === displayImages.length - 1 && images.length > 3 ? "mask-fade-bottom" : ""
                  }`}
                onClick={() => setLightboxIndex(index)}
              >
                {index === displayImages.length - 1 && images.length > 3 && (
                  <>
                    {/* Fade-out gradient suggesting more content below */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/40 to-transparent z-20 pointer-events-none" />

                    {/* Discrete Glassmorphism CTA Overlay */}
                    <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-30 flex items-center gap-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full pl-3 pr-5 py-2 group-hover:bg-white/40 group-hover:border-white/50 transition-all duration-500 shadow-lg shadow-black/5 active:scale-95">
                      <div className="w-6 h-6 rounded-full bg-[#002a45] flex items-center justify-center">
                        <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-luxury text-[#002a45] whitespace-nowrap">
                        Ver más fotos destacadas <span className="opacity-60 ml-1">+{images.length - 3}</span>
                      </span>
                    </div>
                  </>
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
                  <span className="text-xs font-sans font-bold tracking-luxury text-[#c8883a] mb-6">
                    Momento {index + 1}
                  </span>
                  <p className="text-[#2c2416] text-xl md:text-2xl font-light leading-relaxed opacity-90">
                    {img.alt || "La esencia del descanso frente al mar."}
                  </p>
                  <div className="mt-8 h-[1px] w-12 bg-[#e2d9cc]" />
                </div>
              </div>
            </div>
          ))}
        </div>


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
