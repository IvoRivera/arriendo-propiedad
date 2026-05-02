"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

export interface LightboxImage {
  readonly src: string;
  readonly alt: string;
}

interface LightboxProps {
  readonly images: LightboxImage[];
  readonly initialIndex?: number;
  readonly onClose: () => void;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [[page, direction], setPage] = useState([initialIndex, 0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState(0);

  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 400, damping: 30 });

  const currentIndex = page;

  const resetZoom = useCallback(() => {
    scale.set(1);
    setIsZoomed(false);
  }, [scale]);

  const paginate = useCallback((newDirection: number) => {
    resetZoom();
    setPage([((page + newDirection + images.length) % images.length), newDirection]);
  }, [page, images.length, resetZoom]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent scrolling when open
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [paginate, onClose]);

  if (!images.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl"
      onClick={onClose}
    >
      {/* Container with scale/y entry animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-[100] pointer-events-none">
          <div className="bg-white px-4 py-1.5 rounded-full shadow-sm text-[10px] text-[#8a7a6a] font-sans font-medium uppercase tracking-widest border border-[#e2d9cc]/50 pointer-events-auto">
            {currentIndex + 1} / {images.length}
          </div>
          <button
            className="text-[#8a7a6a] bg-white hover:bg-neutral-50 p-3 rounded-full transition-all cursor-pointer shadow-sm border border-[#e2d9cc]/50 pointer-events-auto active:scale-90"
            onClick={onClose}
            aria-label="Cerrar galería"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation Buttons (Desktop) */}
        <button
          className="hidden md:flex absolute left-8 text-[#8a7a6a] hover:text-black p-4 z-50 transition-all cursor-pointer group active:scale-95"
          onClick={(e) => { e.stopPropagation(); paginate(-1); }}
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-12 h-12 group-hover:scale-110 transition-transform" strokeWidth={1} />
        </button>

        {/* Carousel / Image Container */}
        <div className="relative w-full h-full flex items-center justify-center p-0 sm:p-20 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              exit="exit"
              transition={{
                x: {
                  type: "tween",
                  ease: [0.22, 1, 0.36, 1],
                  duration: 0.6
                },
                opacity: { duration: 0.4 },
                scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }}
              drag={isZoomed ? true : "x"}
              dragConstraints={isZoomed ? false : { left: 0, right: 0 }}
              dragElastic={isZoomed ? 0.2 : 0.05}
              dragMomentum={isZoomed}
              onDragEnd={(e, { offset }) => {
                if (isZoomed) return;
                const swipe = offset.x;
                if (swipe < -40) {
                  paginate(1);
                } else if (swipe > 40) {
                  paginate(-1);
                }
              }}
              onTouchStart={(e) => {
                if (e.touches.length === 2) {
                  const dist = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                  );
                  setLastPinchDistance(dist);
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 2 && lastPinchDistance !== null) {
                  const dist = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                  );
                  const delta = dist / lastPinchDistance;
                  const newScale = Math.min(Math.max(scale.get() * delta, 1), 4);
                  scale.set(newScale);
                  setIsZoomed(newScale > 1.05);
                  setLastPinchDistance(dist);
                }
              }}
              onTouchEnd={() => {
                setLastPinchDistance(null);
                if (scale.get() < 1.05) resetZoom();
              }}
              onWheel={(e) => {
                const currentScale = scale.get();
                const delta = -e.deltaY * 0.01;
                const newScale = Math.min(Math.max(currentScale + delta, 1), 4);
                scale.set(newScale);
                setIsZoomed(newScale > 1.05);
              }}
              onDoubleClick={() => {
                const targetScale = scale.get() > 1.05 ? 1 : 2.5;
                scale.set(targetScale);
                setIsZoomed(targetScale > 1.05);
              }}
              onPointerDown={(e) => {
                // Keep tap logic for mobile devices where doubleClick might not fire as expected
                const now = Date.now();
                if (now - lastTap < 300) {
                  const targetScale = scale.get() > 1.05 ? 1 : 2.5;
                  scale.set(targetScale);
                  setIsZoomed(targetScale > 1.05);
                }
                setLastTap(now);
              }}
              animate={isZoomed ? undefined : "center"}
              style={{
                touchAction: isZoomed ? "none" : "pan-y",
                scale: springScale
              }}
              className="absolute inset-0 flex items-center justify-center p-0 sm:p-20"
            >
              <div className="relative w-full h-full max-w-none sm:max-w-6xl flex items-center justify-center select-none">
                {images[currentIndex]?.src?.trim() && (
                  <Image
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt || "Vista ampliada"}
                    fill
                    className="object-contain pointer-events-none"
                    priority
                    sizes="100vw"
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className="hidden md:flex absolute right-8 text-white/40 hover:text-white p-4 z-50 transition-all cursor-pointer group active:scale-95"
          onClick={(e) => { e.stopPropagation(); paginate(1); }}
          aria-label="Siguiente imagen"
        >
          <ChevronRight className="w-12 h-12 group-hover:scale-110 transition-transform" strokeWidth={1} />
        </button>

        {/* Bottom Caption */}
        <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 text-center px-6 pointer-events-none z-[100]">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-white/80 text-[11px] sm:text-base font-light italic max-w-xl mx-auto drop-shadow-md tracking-wide"
            >
              {images[currentIndex].alt || "Sin descripción"}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Swipe hint for mobile */}
        <div className="md:hidden absolute bottom-2 text-white/20 text-[8px] tracking-[0.3em] uppercase text-center w-full">
          Desliza para navegar
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Lightbox;
