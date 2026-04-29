"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
};

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [[page, direction], setPage] = useState([initialIndex, 0]);

  const currentIndex = page;

  const paginate = useCallback((newDirection: number) => {
    setPage([((page + newDirection + images.length) % images.length), newDirection]);
  }, [page, images.length]);

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
          <div className="bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md border border-white/5 pointer-events-auto">
            <span className="text-white/70 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.4em]">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          <button
            className="text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/10 pointer-events-auto active:scale-90"
            onClick={onClose}
            aria-label="Cerrar galería"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation Buttons (Desktop) */}
        <button
          className="hidden md:flex absolute left-8 text-white/40 hover:text-white p-4 z-50 transition-all cursor-pointer group active:scale-95"
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
              animate="center"
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
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.05} // Very low elasticity to avoid "shake"
              dragMomentum={false} // Disable inertia to keep it stable
              onDragEnd={(e, { offset }) => {
                const swipe = offset.x;
                if (swipe < -40) {
                  paginate(1);
                } else if (swipe > 40) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 flex items-center justify-center p-0 sm:p-20"
            >
              <div className="relative w-full h-full max-w-none sm:max-w-6xl flex items-center justify-center select-none">
                {images[currentIndex]?.src?.trim() && (
                  <Image
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt || "Vista ampliada"}
                    fill
                    className="object-contain pointer-events-none drop-shadow-2xl"
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
