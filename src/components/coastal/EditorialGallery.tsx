"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import { AnimatePresence } from "framer-motion";

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
      <div className="px-6 md:px-12 mb-20 md:mb-32 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-7xl font-serif font-normal text-[#2c2416] mb-8 tracking-tight leading-[1.1] max-w-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#8a7a6a] text-lg md:text-2xl font-light max-w-2xl leading-relaxed opacity-80 italic">
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
                className="w-full md:w-[75%] relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-[3rem] aspect-[4/3] md:aspect-[16/9]"
                onClick={() => setLightboxIndex(index)}
              >
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
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#c8883a] mb-6 opacity-60">
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

        {/* Minimalist Footer / Navigation */}
        <div className="mt-24 md:mt-48 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-[#e2d9cc]/30 pt-16">
          <div className="flex items-center gap-6">
            <div className="h-[1px] w-20 bg-[#c8883a]/30" />
            <p className="text-[12px] font-mono uppercase tracking-[0.5em] text-[#8a7a6a] opacity-60">
              Exploración Completa
            </p>
          </div>
          <button
            onClick={() => setLightboxIndex(0)}
            className="group flex items-center gap-4 text-[13px] font-mono uppercase tracking-[0.3em] text-[#2c2416] transition-all"
          >
            <span className="border-b border-transparent group-hover:border-[#2c2416] pb-1 transition-all">
              Explorar más
            </span>
            <span className="text-[#8a7a6a] opacity-50">[{images.length}]</span>
          </button>
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
