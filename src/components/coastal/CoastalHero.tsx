"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { IMAGE_FALLBACKS } from "@/config/image-fallbacks";
import { Property } from "@/types/property";
import { MapPin } from 'lucide-react';

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
}) => {
    // Base64 blur placeholder
    const blurDataURL = "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoKAAoAAUAmJaQAAuXc7XwAAP75R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665AAA=";

    const heroImage = (dynamicImages || [])
        .filter(img => img.category === 'hero' && img.url)
        .sort((a, b) => a.priority - b.priority)[0]?.url
        || IMAGE_FALLBACKS.hero?.[0]?.src;

    return (
        <section
            className={`relative w-full h-[90vh] md:h-screen flex flex-col items-center justify-center px-6 overflow-hidden ${className}`}
        >
            {/* Background Layer with Parallax-ready feel */}
            <div className="absolute inset-0 z-0">
                {heroImage && (
                    <Image
                        src={heroImage}
                        alt="Vista al mar desde el departamento"
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover object-center scale-105"
                    />
                )}
                {/* 1. Cinematic Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 z-[1]" />
                {/* 2. Deep Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a150e]/90 via-transparent to-black/20 z-[2]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center">

                {/* 1. Eyebrow - Glassmorphism Capsule */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 px-5 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15"
                >
                    <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] md:text-xs font-medium text-[#e6d29c] tracking-[0.2em] uppercase">

                        <span>Primera Línea</span>
                        <span className="opacity-60">·</span>

                        <span>Piso 11</span>
                        <span className="opacity-60">·</span>

                        <span>2 Dormitorios</span>
                        <span className="opacity-60">·</span>

                        <span>79 m²</span>
                        <span className="opacity-60">·</span>

                        <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 stroke-[1.8] opacity-90" />
                            Cuatro Esquinas, La Serena
                        </span>

                    </span>
                </motion.div>

                {/* 2. Dominant Headline - Newsreader Serif with Soft Shadow */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-[#FFFFFF] leading-[1.05] mb-8 tracking-tight drop-shadow-2xl"
                    style={{ fontFamily: "var(--font-newsreader), serif" }}
                >
                    Tu refugio perfecto <br className="hidden md:block" />
                    frente al{" "}
                    <span className="text-[#66B8B6] drop-shadow-[0_0_12px_rgba(102,184,182,0.25)]">
                        mar
                    </span>
                </motion.h1>

                {/* 3. Emotional Subheadline - Off-white Newsreader Italic */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="max-w-3xl text-[rgba(255,255,255,0.92)]/70 text-xl md:text-2xl font-serif italic leading-relaxed mb-10 drop-shadow-md px-4"
                    style={{ fontFamily: "var(--font-newsreader), serif" }}
                >
                    Vista privilegiada, aire costero y atardeceres inolvidables en La Serena.
                </motion.p>

                {/* 3.5 Pricing Badge - Glassmorphism Style */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mb-12 px-5 py-3 rounded-2xl bg-black/15 border border-white/10"
                //"mb-12 px-6 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg"
                >
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-[10px] uppercase tracking-[0.28em] text-[#e6d29c]/80">
                            Desde
                        </span>

                        <span className="text-m font-medium text-white">
                            $90.000
                        </span>

                        <span className="text-xs text-white/70 uppercase tracking-[0.14em]">
                            / noche
                        </span>
                    </div>
                </motion.div>

                {/* 4. CTA - Restored to Previous State */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="w-full sm:w-auto px-4"
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
                        onClick={(e) => {
                            e.preventDefault();
                            if (onExplore) onExplore();
                            else onAction?.();
                        }}
                        className="
    w-full sm:min-w-[280px] px-10 py-5

    text-white text-lg font-semibold
    rounded-full cursor-pointer select-none
    flex items-center justify-center

    relative overflow-hidden

    bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(0,180,255,0.25),rgba(255,255,255,0.08))]
    bg-[length:200%_200%]

    border border-white/20
    backdrop-blur-md
    shadow-lg shadow-black/10
  "
                    >
                        {/* shimmer seguro (no bloquea clicks) */}
                        <motion.div
                            aria-hidden
                            className="
      absolute inset-0
      bg-gradient-to-r
      from-transparent via-white/10 to-transparent
      -skew-x-12
      pointer-events-none
    "
                            animate={{ x: ["-120%", "120%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: 6,
                                ease: "linear"
                            }}
                        />

                        <span className="relative z-10">
                            Explorar disponibilidad
                        </span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll Indicator - Bottom */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-10"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
            </motion.div>
        </section>
    );
};

export default CoastalHero;