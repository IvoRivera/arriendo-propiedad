// CoastalHero.tsx — Elegant version (No Animations)
"use client";

import React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";
import { IMAGE_FALLBACKS } from "@/config/image-fallbacks";
import { useConfig } from "@/components/providers/ConfigProvider";
import { Property } from "@/types/property";

interface CoastalHeroProps {
    readonly className?: string;
    onAction?: () => void;
    dynamicImages?: any[];
    property?: Property | null;
}

export const CoastalHero: React.FC<CoastalHeroProps> = ({ 
    className = "", 
    onAction, 
    dynamicImages = [],
    property 
}) => {
    const { getValue } = useConfig();
    const livePrice = property?.base_price?.toString() || getValue("PROPERTY_RENT_VALUE") || "80.000";

    // Helper to format price with dots (Chilean format)
    const formatPrice = (p: string) => {
        const num = parseInt(p.replace(/\D/g, ""));
        return isNaN(num) ? p : num.toLocaleString("es-CL");
    };

    // Base64 blur placeholder
    const blurDataURL = "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoKAAoAAUAmJaQAAuXc7XwAAP75R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665AAA=";

    const displayPrice = formatPrice(livePrice);

    // Get dynamic hero image from dedicated 'hero' category
    // Ref: Separation of Hero background from Gallery carousels
    const heroImage = (dynamicImages || [])
        .filter(img => img.category === 'hero' && img.url)
        .sort((a, b) => a.priority - b.priority)[0]?.url 
        || IMAGE_FALLBACKS.hero?.[0]?.src;
    
    return (
        <section 
            className={`relative z-10 w-full min-h-[560px] h-[78vh] md:h-[82vh] flex items-center justify-center text-center px-6 ${className}`}
        >
            {/* Background image */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {heroImage && heroImage.trim() !== "" ? (
                    <Image
                        src={heroImage}
                        alt="Vista principal del departamento frente al mar"
                        fill
                        sizes="(max-width: 768px) 100vw, 100vw"
                        priority
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        className="object-cover object-center"
                    />
                ) : (
                    /* Fallback background when no hero image is defined */
                    <div className="absolute inset-0 bg-[#2c2416] bg-opacity-90 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3a2e1e] to-[#1a1208] opacity-50" />
                        {/* Abstract subtle pattern or blur effect could go here */}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80 md:from-[#3a2e1e]/40 md:via-transparent md:to-[#1a1208]/85" />
            </div>

            {/* Content block */}
            <div className="relative z-30 max-w-2xl">
                <p className="text-white/80 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold mb-5 drop-shadow-md">
                    {SITE_CONTENT.hero.tagline}
                </p>

                <h1
                    className="text-4xl md:text-5xl lg:text-7xl font-serif font-normal text-white leading-tight tracking-tight mb-6 drop-shadow-2xl"
                    style={{ fontFamily: "var(--font-newsreader), serif" }}
                >
                    {SITE_CONTENT.hero.headline}
                </h1>

                <div className="flex flex-col items-center gap-3 mb-10">
                    <p className="text-white/90 text-base md:text-lg font-light tracking-wide drop-shadow-md">
                        Desde <span className="font-semibold text-white">${displayPrice}</span> por noche
                    </p>
                    <div className="h-px w-8 bg-[#00628f] opacity-50 my-1" />
                    <p className="text-white/60 text-[9px] uppercase tracking-[0.25em] font-bold">
                        {SITE_CONTENT.hero.availabilityPrompt}
                    </p>
                </div>

                <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onAction?.();
                        }}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-br from-[#00628f] to-[#007cb3] text-white font-semibold tracking-[-0.01em] rounded-full transition-all duration-200 hover:brightness-110 cursor-pointer inline-flex items-center justify-center gap-3 group relative z-50"
                    >
                        <span>Reservar ahora</span>
                        <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="currentColor" />
                    </button>
                    
                    <div className="mt-4 flex flex-col items-center gap-1.5">
                        <p className="text-white text-sm font-semibold flex items-center gap-2 drop-shadow-md">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Respuesta en menos de 1 hora
                        </p>
                        <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-medium">
                            Consulta disponibilidad sin compromiso
                        </p>
                    </div>
                </div>

                {SITE_CONTENT.hero.subheadline && (
                    <p className="text-white/40 text-[10px] tracking-widest uppercase font-light mt-8">
                        {SITE_CONTENT.hero.subheadline}
                    </p>
                )}
            </div>
        </section>
    );
};

export default CoastalHero;