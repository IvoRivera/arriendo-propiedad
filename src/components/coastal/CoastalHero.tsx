"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, MessageCircle } from "lucide-react";
import { IMAGE_FALLBACKS } from "@/config/image-fallbacks";
import { SITE_CONTENT } from "@/config/site-content";
import { getWhatsAppHref } from "@/config/seo";
import { trackConversion } from "@/lib/analytics";
import { Property } from "@/types/property";

interface CoastalHeroProps {
  readonly className?: string;
  onAction?: () => void;
  onExplore?: () => void;
  dynamicImages?: any[];
  property?: Property | null;
}

export const CoastalHero: React.FC<CoastalHeroProps> = ({
  className = "",
  onAction,
  onExplore,
  dynamicImages = [],
  property,
}) => {
  const fallbackHero = IMAGE_FALLBACKS.hero?.[0];
  const heroRecord = (dynamicImages || [])
    .filter((img) => img.category === "hero" && img.url)
    .sort((a, b) => a.priority - b.priority)[0];
  const heroImage = heroRecord?.url || fallbackHero?.src;
  const heroAlt =
    heroRecord?.metadata?.alt ||
    fallbackHero?.alt ||
    "Vista al mar desde departamento en Cuatro Esquinas La Serena";
  const price = property?.base_price || 90000;
  const whatsappHref = getWhatsAppHref("hero");

  return (
    <section
      className={`relative w-full min-h-[92vh] md:min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden ${className}`}
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 z-0">
        {heroImage && (
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/45 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a150e]/95 via-[#1a150e]/20 to-black/20 z-[2]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-7 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:gap-x-3 text-[9px] md:text-xs tracking-[0.1em] md:tracking-[0.2em] font-medium text-[#e6d29c] uppercase text-center">
            <span>Primera linea</span>
            <span aria-hidden="true">·</span>
            <span>Piso 11</span>
            <span aria-hidden="true">·</span>
            <span>2 dormitorios</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 stroke-[1.8] opacity-90 -mt-[1px]" />
              {SITE_CONTENT.site.location}
            </span>
          </div>
        </motion.div>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif italic text-white leading-[1.04] mb-7 tracking-tight drop-shadow-2xl"
        >
          {SITE_CONTENT.hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-3xl text-white/90 text-base md:text-xl font-light leading-relaxed mb-8 drop-shadow-md px-2"
        >
          {SITE_CONTENT.hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-10 px-5 py-3 rounded-2xl bg-black/20 border border-white/10"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-[10px] tracking-luxury text-[#e6d29c]/80">Desde</span>
            <span className="text-base font-medium text-white">
              ${new Intl.NumberFormat("es-CL").format(price)}
            </span>
            <span className="text-[10px] text-white/75 tracking-luxury">/ noche</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-full sm:w-auto px-2 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.button
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              y: [0, -2, 0],
            }}
            transition={{
              backgroundPosition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={(event) => {
              event.preventDefault();
              if (onExplore) onExplore();
              else onAction?.();
            }}
            type="button"
            className="w-full sm:min-w-[280px] px-8 py-5 text-white text-base md:text-lg font-bold rounded-full cursor-pointer select-none flex items-center justify-center tracking-luxury-sm relative overflow-hidden bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(0,180,255,0.25),rgba(255,255,255,0.08))] bg-[length:200%_200%] border border-white/20 backdrop-blur-md shadow-lg shadow-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
              animate={{ x: ["-120%", "120%"] }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "linear",
              }}
            />
            <span className="relative z-10">{SITE_CONTENT.hero.ctaText}</span>
          </motion.button>

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversion("whatsapp_click", { placement: "hero" })}
              className="w-full sm:w-auto min-h-[56px] px-7 py-4 rounded-full bg-white text-[#003d5c] font-bold text-xs uppercase tracking-[0.18em] inline-flex items-center justify-center gap-2 shadow-lg shadow-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CoastalHero;
