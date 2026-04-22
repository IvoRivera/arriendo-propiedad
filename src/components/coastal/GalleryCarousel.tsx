// GalleryCarousel.tsx — Reusable horizontal carousel for all 3 gallery sections
// Mobile-first: touch/swipe, snap scrolling, dot indicators, lightbox on tap

"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselImage {
  readonly src: string;
  readonly alt: string;
}

interface GalleryCarouselProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly images: CarouselImage[];
  readonly ctaText?: string;
  readonly ctaHref: string;
  readonly bgColor?: string; // e.g. "bg-[#f5f0e8]" or "bg-[#faf7f2]"
}

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  title,
  subtitle,
  images,
  ctaText,
  ctaHref,
  bgColor = "bg-[#faf7f2]",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Track active dot via IntersectionObserver on the scroll container
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ left: index * container.offsetWidth, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const prev = useCallback(() => {
    const newIdx = Math.max(0, activeIndex - 1);
    scrollTo(newIdx);
  }, [activeIndex, scrollTo]);

  const next = useCallback(() => {
    const newIdx = Math.min(images.length - 1, activeIndex + 1);
    scrollTo(newIdx);
  }, [activeIndex, images.length, scrollTo]);

  // Lightbox navigation
  const lightboxPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);

  const lightboxNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));
  }, [images.length]);

  return (
    <div className={`${bgColor} py-14 md:py-16`}>
      {/* Section header */}
      <div className="px-6 mb-6">
        <h2
          className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-1"
          style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#8a7a6a] text-sm font-light">{subtitle}</p>
        )}
      </div>

      {/* Carousel track — full-bleed, snap scroll */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 px-6 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              // Each slide: 85vw on mobile, up to 420px on desktop
              className="flex-none w-[85vw] sm:w-[420px] snap-start rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setLightboxIndex(index)}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 85vw, 420px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </div>
          ))}
          {/* Trailing spacer so last card scrolls fully into view on mobile */}
          <div className="flex-none w-4" aria-hidden />
        </div>

        {/* Desktop arrow controls */}
        {activeIndex > 0 && (
          <button
            onClick={prev}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md items-center justify-center transition-all duration-200 z-10"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-5 h-5 text-[#2c2416]" />
          </button>
        )}
        {activeIndex < images.length - 1 && (
          <button
            onClick={next}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md items-center justify-center transition-all duration-200 z-10"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-5 h-5 text-[#2c2416]" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4 px-6">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Ir a imagen ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-5 h-2 bg-[#6b7c4a]"
                  : "w-2 h-2 bg-[#d4c9b8] hover:bg-[#9a8a78]"
              }`}
            />
          ))}
        </div>
      )}

      {/* Contextual CTA */}
      {ctaText && (
        <div className="px-6 mt-8 flex justify-center">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#6b7c4a] hover:text-[#5a6a3d] border border-[#6b7c4a] hover:bg-[#6b7c4a] hover:text-white text-sm font-medium px-6 py-3 rounded-full transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{ctaText}</span>
          </a>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/95"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              aria-label="Cerrar"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-3 md:left-6 text-white/60 hover:text-white p-2 z-10"
              onClick={lightboxPrev}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-9 h-9" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-4xl max-h-[85vh] aspect-[4/3]">
                <Image
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].alt}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-3 md:right-6 text-white/60 hover:text-white p-2 z-10"
              onClick={lightboxNext}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-9 h-9" />
            </button>

            {/* Counter */}
            <p className="absolute bottom-5 text-white/40 text-xs tracking-wider">
              {lightboxIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryCarousel;
