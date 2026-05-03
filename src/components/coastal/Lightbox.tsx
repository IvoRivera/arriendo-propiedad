"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionValueEvent } from "framer-motion";

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
  zoomed: {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(1);
  const [currentScale, setCurrentScale] = useState(1);
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const springScale = useSpring(scale, { stiffness: 400, damping: 30 });

  useMotionValueEvent(scale, "change", (latest) => {
    setCurrentScale(latest);
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentIndex = page;

  const resetZoom = useCallback(() => {
    scale.set(1);
    setIsZoomed(false);
  }, [scale]);

  const paginate = useCallback((newDirection: number) => {
    resetZoom();
    setImgDims(null); // Reset dimensions for next image
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

  if (typeof document === "undefined" || !images.length) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl overscroll-none"
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

        {/* Navigation Buttons */}
        <AnimatePresence>
          {!isZoomed && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-2 sm:left-8 text-white/60 hover:text-white p-4 z-50 transition-all cursor-pointer group active:scale-95"
              onClick={(e) => { e.stopPropagation(); paginate(-1); }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-10 h-10 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform" strokeWidth={1} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Carousel / Image Container */}
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-0 sm:p-20 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate={isZoomed ? "zoomed" : "center"}
              exit="exit"
              transition={{
                x: {
                  type: "tween",
                  ease: [0.22, 1, 0.36, 1],
                  duration: 0.6
                },
                opacity: { duration: 0.4 }
              }}
              drag={isZoomed ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.05}
              dragListener={!isZoomed}
              onDragEnd={(e, { offset }) => {
                if (isZoomed || scale.get() > 1.05) return;
                const swipe = offset.x;
                if (swipe < -40) {
                  paginate(1);
                } else if (swipe > 40) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 flex items-center justify-center p-0 sm:p-20"
            >
              <motion.div
                drag={isZoomed}
                dragConstraints={(() => {
                  if (!containerRef.current) return { left: 0, right: 0, top: 0, bottom: 0 };
                  const containerW = containerRef.current.offsetWidth;
                  const containerH = containerRef.current.offsetHeight;
                  
                  // Use natural dimensions to calculate object-contain bounds
                  const imgW = imgDims?.w || containerW;
                  const imgH = imgDims?.h || containerH;
                  
                  const containerRatio = containerW / containerH;
                  const imgRatio = imgW / imgH;
                  
                  let displayedW, displayedH;
                  if (imgRatio > containerRatio) {
                    displayedW = containerW;
                    displayedH = containerW / imgRatio;
                  } else {
                    displayedH = containerH;
                    displayedW = containerH * imgRatio;
                  }

                  const xDist = Math.max(0, (displayedW * currentScale - containerW) / 2);
                  const yDist = Math.max(0, (displayedH * currentScale - containerH) / 2);
                  
                  return { left: -xDist, right: xDist, top: -yDist, bottom: yDist };
                })()}
                dragMomentum={isZoomed}
                dragElastic={0.1}
                animate={isZoomed ? {} : { x: 0, y: 0 }}
                onWheel={(e) => {
                  e.stopPropagation();
                  const currentScaleVal = scale.get();
                  const delta = -e.deltaY * 0.01;
                  const newScale = Math.min(Math.max(currentScaleVal + delta, 1), 4);
                  scale.set(newScale);
                  setIsZoomed(newScale > 1.01);
                }}
                onPointerDown={(e) => {
                  // Only handle primary pointer (first finger/mouse) for double-tap logic
                  if (!e.isPrimary) return;

                  const now = Date.now();
                  if (now - lastTap < 300) {
                    e.stopPropagation();
                    const currentScaleVal = scale.get();
                    const targetScale = currentScaleVal > 1.01 ? 1 : 2.5;
                    scale.set(targetScale);
                    setIsZoomed(targetScale > 1.01);
                  }
                  setLastTap(now);
                }}
                onTouchStart={(e) => {
                  if (e.touches.length > 1) e.stopPropagation();
                  if (e.touches.length === 2) {
                    const dist = Math.hypot(
                      e.touches[0].pageX - e.touches[1].pageX,
                      e.touches[0].pageY - e.touches[1].pageY
                    );
                    setLastPinchDistance(dist);
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length > 1) e.stopPropagation();
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
                onTouchEnd={(e) => {
                  setLastPinchDistance(null);
                  if (scale.get() < 1.05) resetZoom();
                }}
                style={{
                  touchAction: isZoomed ? "none" : "pan-y",
                  scale: springScale,
                  originX: 0.5,
                  originY: 0.5
                }}
                className="relative w-full h-full max-w-none sm:max-w-6xl flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
              >
                {images[currentIndex]?.src?.trim() && (
                  <Image
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt || "Vista ampliada"}
                    fill
                    className="object-contain pointer-events-none"
                    priority
                    sizes="100vw"
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      setImgDims({ w: img.naturalWidth, h: img.naturalHeight });
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!isZoomed && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-2 sm:right-8 text-white/60 hover:text-white p-4 z-50 transition-all cursor-pointer group active:scale-95"
              onClick={(e) => { e.stopPropagation(); paginate(1); }}
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-10 h-10 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform" strokeWidth={1} />
            </motion.button>
          )}
        </AnimatePresence>

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
    </motion.div>,
    document.body
  );
};

export default Lightbox;
