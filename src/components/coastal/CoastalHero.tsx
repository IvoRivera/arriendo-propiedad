// CoastalHero.tsx — Elegant version (No Animations)
"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { heroData } from "@/data/mockData";

import { useConfig } from "@/components/providers/ConfigProvider";

interface CoastalHeroProps {
    readonly className?: string;
    onAction?: () => void;
}

export const CoastalHero: React.FC<CoastalHeroProps> = ({ className = "", onAction }) => {
    const { getValue } = useConfig();
    const livePrice = getValue("PROPERTY_RENT_VALUE") || "80.000";

    // Helper to format price with dots (Chilean format)
    const formatPrice = (p: string) => {
        const num = parseInt(p.replace(/\D/g, ""));
        return isNaN(num) ? p : num.toLocaleString("es-CL");
    };

    // Base64 blur placeholder
    const blurDataURL = "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAQCdASoKAAoAAUAmJaQAAuXc7XwAAP75R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665R+V0C665AAA=";

    const displayPrice = formatPrice(livePrice);
    
    return (
        <section 
            className={`relative z-10 w-full min-h-[560px] h-[78vh] md:h-[82vh] flex items-center justify-center text-center px-6 ${className}`}
        >
            {/* Background image */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src={heroData.image}
                    alt={heroData.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 100vw"
                    priority
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80 md:from-[#3a2e1e]/40 md:via-transparent md:to-[#1a1208]/85" />
            </div>

            {/* Content block */}
            <div className="relative z-30 max-w-2xl">
                <p className="text-white/80 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold mb-5 drop-shadow-md">
                    {heroData.tagline}
                </p>

                <h1
                    className="text-4xl md:text-5xl lg:text-7xl font-serif font-normal text-white leading-tight tracking-tight mb-6 drop-shadow-2xl"
                    style={{ fontFamily: "var(--font-newsreader), serif" }}
                >
                    {heroData.headline}
                </h1>

                <div className="flex flex-col items-center gap-3 mb-10">
                    <p className="text-white/90 text-base md:text-lg font-light tracking-wide drop-shadow-md">
                        Desde <span className="font-semibold text-white">${displayPrice}</span> por noche
                    </p>
                    <div className="h-px w-8 bg-[#6b7c4a] opacity-50 my-1" />
                    <p className="text-white/60 text-[9px] uppercase tracking-[0.25em] font-bold">
                        {(heroData as Record<string, string>).availabilityPrompt}
                    </p>
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onAction?.();
                    }}
                    className="bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-bold text-[11px] md:text-xs uppercase tracking-[0.2em] px-10 py-4.5 rounded-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 cursor-pointer inline-flex items-center gap-3 group relative z-50"
                >
                    <span>{getValue("hero_cta_text") || heroData.ctaText}</span>
                    <MessageCircle className="w-4 h-4" fill="currentColor" />
                </button>

                <p className="text-white/60 text-xs tracking-wide font-light mt-6">
                    {heroData.subheadline}
                </p>
            </div>
        </section>
    );
};

export default CoastalHero;