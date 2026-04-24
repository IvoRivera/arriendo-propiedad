// CoastalHero.tsx — Elegant version (No Animations)
"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { heroData, siteConfig } from "@/data/mockData";

import { useConfig } from "@/components/providers/ConfigProvider";

interface CoastalHeroProps {
    readonly className?: string;
    onAction?: () => void;
}

export const CoastalHero: React.FC<CoastalHeroProps> = ({ className = "", onAction }) => {
    const { getValue } = useConfig();
    const livePrice = getValue("PROPERTY_RENT_VALUE") || heroData.pricePerNight;

    // Helper to format price with dots (Chilean format)
    const formatPrice = (p: string) => {
        const num = parseInt(p.replace(/\D/g, ""));
        return isNaN(num) ? p : num.toLocaleString("es-CL");
    };

    const displayPrice = formatPrice(livePrice);
    return (
        <section 
            className={`relative w-full min-h-[560px] h-[78vh] md:h-[82vh] flex items-center justify-center text-center px-6 ${className}`}
        >
            {/* Background image — stays absolute behind everything */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroData.image}
                    alt={heroData.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover object-center"
                />
                {/* Gradient overlay — stronger on mobile for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/75 md:from-[#3a2e1e]/35 md:via-transparent md:to-[#1a1208]/75" />
            </div>

            {/* Content block — centered vertically, no animations for guaranteed mobile visibility */}
            <div className="relative z-10 max-w-xl">
                <p className="text-white/70 text-xs md:text-sm tracking-widest uppercase font-light mb-4 drop-shadow">
                    {heroData.tagline}
                </p>

                <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-white leading-tight tracking-tight mb-5 drop-shadow-lg"
                    style={{ fontFamily: "var(--font-newsreader), serif" }}
                >
                    {heroData.headline}
                </h1>

                {/* Price and context — Subtle & Premium */}
                <div className="flex flex-col items-center gap-2 mb-8">
                    <p className="text-white/80 text-sm md:text-base font-light tracking-wide drop-shadow">
                        Desde <span className="font-semibold text-white">${displayPrice}</span> por noche
                    </p>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium drop-shadow">
                        {(heroData as any).availabilityPrompt}
                    </p>
                </div>

                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-2.5 bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-sm md:text-base px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl relative z-20 mb-5 cursor-pointer"
                    style={{ touchAction: "manipulation" }}
                >
                    <span>{heroData.ctaText}</span>
                    <MessageCircle className="w-4 h-4" fill="currentColor" />
                </button>

                <p className="text-white/60 text-xs tracking-wide font-light">
                    {heroData.subheadline}
                </p>
            </div>
        </section>
    );
};

export default CoastalHero;