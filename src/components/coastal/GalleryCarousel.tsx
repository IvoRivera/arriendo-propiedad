"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Lightbox } from "./Lightbox";

export interface CarouselImage {
  readonly src: string;
  readonly alt: string;
}

interface GalleryCarouselProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly images: CarouselImage[];
  readonly ctaText?: string;
  readonly onAction?: () => void;
  readonly bgColor?: string;
}

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  title,
  subtitle,
  images = [],
  bgColor = "bg-[#faf7f2]",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // 1. Sanitize image array: filter out items with no valid src
  const validImages = React.useMemo(() => {
    return (images || []).filter(img => typeof img?.src === 'string' && img.src.trim() !== '');
  }, [images]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      if (itemWidth > 0) {
        const newIndex = Math.round(scrollLeft / itemWidth);
        setActiveIndex(newIndex);
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container || !validImages.length) return;
    container.scrollTo({ left: index * container.offsetWidth, behavior: "smooth" });
    setActiveIndex(index);
  }, [validImages.length]);

  const prev = useCallback(() => {
    const newIdx = Math.max(0, activeIndex - 1);
    scrollTo(newIdx);
  }, [activeIndex, scrollTo]);

  const next = useCallback(() => {
    const newIdx = Math.min(validImages.length - 1, activeIndex + 1);
    scrollTo(newIdx);
  }, [activeIndex, validImages.length, scrollTo]);

  const [tapStartPos, setTapStartPos] = useState<{ x: number, y: number } | null>(null);

  return (
    <div className={`${bgColor} py-14 md:py-16`}>
      <div className="px-6 mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-1">{title}</h2>
        {subtitle && <p className="text-[#8a7a6a] text-sm font-light">{subtitle}</p>}
      </div>

      <div className="relative">
        {!validImages.length ? (
          // Fallback UI if no valid images
          <div className="px-6 py-12 flex flex-col items-center justify-center bg-white/30 border border-dashed border-[#e2d9cc] rounded-3xl mx-6">
            <div className="w-12 h-12 rounded-full bg-[#faf7f2] flex items-center justify-center mb-3">
              <span className="text-xl">📷</span>
            </div>
            <p className="text-[#9a8a78] text-sm italic">Sin imágenes disponibles para esta sección.</p>
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 px-6 pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {validImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className="flex-none w-[85vw] sm:w-[420px] snap-start rounded-xl overflow-hidden cursor-pointer group outline-none"
                  onTouchStart={(e) => {
                    setTapStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                  }}
                  onTouchEnd={(e) => {
                    if (!tapStartPos) return;
                    const dx = Math.abs(e.changedTouches[0].clientX - tapStartPos.x);
                    const dy = Math.abs(e.changedTouches[0].clientY - tapStartPos.y);
                    if (dx < 10 && dy < 10) {
                      setLightboxIndex(index);
                    }
                    setTapStartPos(null);
                  }}
                  onClick={(e) => {
                    if (e.detail > 0 && !tapStartPos) {
                      setLightboxIndex(index);
                    }
                  }}
                >
                  <div className="relative aspect-[4/3] w-full bg-[#faf7f2]">
                    {image?.src?.trim() ? (
                      <Image
                        src={image.src}
                        alt={image.alt || "Imagen del listado"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#e2d9cc]">
                        <span className="text-xs italic">Cargando...</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
              <div className="flex-none w-4" aria-hidden />
            </div>

            {activeIndex > 0 && (
              <button onClick={prev} className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md items-center justify-center z-10 cursor-pointer border border-[#e2d9cc]">
                <ChevronLeft className="w-5 h-5 text-[#2c2416]" />
              </button>
            )}
            {activeIndex < validImages.length - 1 && (
              <button onClick={next} className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md items-center justify-center z-10 cursor-pointer border border-[#e2d9cc]">
                <ChevronRight className="w-5 h-5 text-[#2c2416]" />
              </button>
            )}

            {/* Mobile Navigation Counter */}
            <div className="flex justify-center items-center mt-4 md:hidden pb-2">
              <div className="bg-white px-4 py-1.5 rounded-full shadow-sm text-[10px] text-[#8a7a6a] font-sans font-medium uppercase tracking-widest border border-[#e2d9cc]/50">
                {activeIndex + 1} / {validImages.length}
              </div>
            </div>
          </>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox 
          images={validImages} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </div>
  );
};

export default GalleryCarousel;
