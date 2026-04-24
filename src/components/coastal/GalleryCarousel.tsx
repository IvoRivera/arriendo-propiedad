"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  images,
  bgColor = "bg-[#faf7f2]",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const lightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  };

  const lightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));
  };

  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    if (Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > minSwipeDistance) {
      setLightboxIndex(null);
      return;
    }

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isLeftSwipe) {
      setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));
    } else if (isRightSwipe) {
      setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, images.length]);

  return (
    <div className={`${bgColor} py-14 md:py-16`}>
      <div className="px-6 mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-1">{title}</h2>
        {subtitle && <p className="text-[#8a7a6a] text-sm font-light">{subtitle}</p>}
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 px-6 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              className="flex-none w-[85vw] sm:w-[420px] snap-start rounded-xl overflow-hidden cursor-pointer group outline-none"
              onClick={() => {
                console.log("Gallery Image Clicked:", index);
                setLightboxIndex(index);
              }}
              onPointerDown={(e) => {
                // Only trigger if not a drag (very basic check: immediate down)
                // Actually, for a gallery click, we can be aggressive and then let them scroll
                // but let's just use the same pattern
                e.stopPropagation();
                setLightboxIndex(index);
              }}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </button>
          ))}
          <div className="flex-none w-4" aria-hidden />
        </div>

        {activeIndex > 0 && (
          <button onClick={prev} className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md items-center justify-center z-10 cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {activeIndex < images.length - 1 && (
          <button onClick={next} className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md items-center justify-center z-10 cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Navigation Counter */}
        <div className="flex justify-center items-center mt-4 md:hidden pb-2">
          <div className="bg-white/70 px-4 py-1.5 rounded-full shadow-sm text-[10px] text-[#8a7a6a] font-mono uppercase tracking-widest border border-[#e2d9cc]/50">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-black/98 backdrop-blur-sm animate-in fade-in duration-300" 
          onClick={() => setLightboxIndex(null)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
            <span className="text-white/50 text-xs font-mono uppercase tracking-[0.3em]">
              {lightboxIndex + 1} / {images.length}
            </span>
            <button 
              className="text-white hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all cursor-pointer z-[99999]" 
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            >
              <X className="w-8 h-8" strokeWidth={2} />
            </button>
          </div>

          {/* Navigation Buttons (Desktop Only) */}
          <button 
            className="hidden md:flex absolute left-6 text-white/40 hover:text-white p-4 z-50 transition-all cursor-pointer" 
            onClick={lightboxPrev}
          >
            <ChevronLeft className="w-12 h-12" strokeWidth={1} />
          </button>

          {/* Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 md:p-20" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-6xl flex items-center justify-center select-none">
              <Image 
                src={images[lightboxIndex].src} 
                alt={images[lightboxIndex].alt} 
                fill 
                className="object-contain pointer-events-none" 
                priority
              />
            </div>
          </div>

          <button 
            className="hidden md:flex absolute right-6 text-white/40 hover:text-white p-4 z-50 transition-all cursor-pointer" 
            onClick={lightboxNext}
          >
            <ChevronRight className="w-12 h-12" strokeWidth={1} />
          </button>

          {/* Bottom Caption */}
          <div className="absolute bottom-8 left-0 right-0 text-center px-6 pointer-events-none">
            <p className="text-white/80 text-sm font-light italic max-w-md mx-auto">
              {images[lightboxIndex].alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryCarousel;
