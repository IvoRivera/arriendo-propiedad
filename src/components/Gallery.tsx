"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

const images = [
  { src: "/images/hero.png", alt: "Vista frontal al mar desde el living" },
  { src: "/images/bedroom.png", alt: "Dormitorio principal con vista" },
  { src: "/images/terrace.png", alt: "Terraza privada frente al mar" }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  return (
    <section className="py-24 bg-slate-900" id="galeria">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">La belleza está en los <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">detalles</span></h2>
            <p className="text-slate-400 max-w-lg">Recorre los espacios diseñados para tu máximo confort y déjate sorprender por la vista panorámica.</p>
          </div>
        </div>

        {/* CSS Grid for images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="md:col-span-2 md:row-span-2 relative h-[300px] md:h-[616px] rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage(0)}
          >
            <Image 
              src={images[0].src} 
              alt={images[0].alt} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white">
                <Expand className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div 
            className="relative h-[300px] rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage(1)}
          >
            <Image 
              src={images[1].src} 
              alt={images[1].alt} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white">
                <Expand className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div 
            className="relative h-[300px] rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage(2)}
          >
            <Image 
              src={images[2].src} 
              alt={images[2].alt} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white">
                <Expand className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X className="w-8 h-8" />
            </button>
            
            <button 
              className="absolute left-6 text-white/70 hover:text-white p-3 rounded-full bg-slate-900/50 hover:bg-slate-800 transition-colors hidden md:block"
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <motion.div 
              key={selectedImage}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </motion.div>

            <button 
              className="absolute right-6 text-white/70 hover:text-white p-3 rounded-full bg-slate-900/50 hover:bg-slate-800 transition-colors hidden md:block"
              onClick={nextImage}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            
            {/* Mobile controls */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 md:hidden">
              <button 
                className="text-white p-3 rounded-full bg-slate-800/80"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                className="text-white p-3 rounded-full bg-slate-800/80"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="absolute bottom-6 left-0 w-full text-center text-white/60 text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
