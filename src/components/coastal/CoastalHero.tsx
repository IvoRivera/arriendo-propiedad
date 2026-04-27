// CoastalHero.tsx — Elegant version (No Animations)
"use client";

import React from "react";
import Image from "next/image";
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
            className={`relative z-10 w-full min-h-[600px] h-[85vh] md:h-[90vh] flex flex-col items-center justify-center px-6 ${className}`}
        >
            {/* Background image - Edge-to-edge */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {heroImage && heroImage.trim() !== "" ? (
                    <Image
                        src={heroImage}
                        alt="Vista principal del departamento frente al mar"
                        fill
                        sizes="100vw"
                        priority
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        className="object-cover object-center"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#001a2c] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#002a46] to-[#000d16] opacity-50" />
                    </div>
                )}
                {/* Minimalist Overlay - Only dark at the base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>

            {/* Content block - The Digital Sanctuary */}
            <div className="relative z-30 max-w-4xl w-full flex flex-col items-center text-center mt-auto mb-16 md:my-auto">
                {/* Emotional Subtitle */}
                <p className="text-white/90 text-sm md:text-base font-light tracking-[0.15em] uppercase mb-4 drop-shadow-sm">
                    {SITE_CONTENT.hero.tagline}
                </p>

                {/* Dominant Headline */}
                <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-8 drop-shadow-xl"
                    style={{ fontFamily: "var(--font-newsreader), serif" }}
                >
                    {SITE_CONTENT.hero.headline}
                </h1>

                {/* Price - Less visual weight */}
                <p className="text-white/70 text-lg md:text-xl font-light tracking-wide mb-12 drop-shadow-md">
                    Desde <span className="text-white font-medium">${displayPrice}</span> por noche
                </p>

                {/* Single Primary CTA */}
                <div className="w-full sm:w-auto px-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onAction?.();
                        }}
                        className="w-full sm:min-w-[280px] px-10 py-5 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-none border-none"
                    >
                        Explorar disponibilidad
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CoastalHero;