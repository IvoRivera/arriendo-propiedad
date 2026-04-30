// CoastalTrust.tsx — Real trust signals instead of fake testimonials
// data-stitch-id: trust-section

"use client";

import React from "react";
import { Building, UserCheck, ShieldCheck, Camera } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";
import { Sparkles } from "lucide-react";

interface CoastalTrustProps {
  readonly className?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  building: <Building className="w-5 h-5 md:w-6 md:h-6" />,
  "user-check": <UserCheck className="w-5 h-5 md:w-6 md:h-6" />,
  "shield-check": <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />,
  sparkles: <Sparkles className="w-5 h-5 md:w-6 md:h-6" />,
};

export const CoastalTrust: React.FC<CoastalTrustProps> = ({ className = "" }) => {
  return (
    <section className={`bg-[#faf7f2] py-12 md:py-16 px-6 border-t border-[#e2d9cc]/30 ${className}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2
            className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
          >
            {SITE_CONTENT.trust.sectionTitle}
          </h2>
          <div className="w-10 h-0.5 bg-[#00628f] mx-auto opacity-10"></div>
        </div>

        {/* Improved Responsive Grid: 2x2 on mobile, 4 in a row on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-12">
          {SITE_CONTENT.trust.items.slice(0, 4).map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/50 border border-[#e2d9cc]/50 flex items-center justify-center text-[#00628f] mb-4 md:mb-6 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
                <div className="scale-90 md:scale-100">
                  {ICON_MAP[item.icon] || <ShieldCheck className="w-6 h-6" />}
                </div>
              </div>
              <h3 
                className="text-sm md:text-lg font-serif font-medium text-[#2c2416] mb-1.5 md:mb-2 leading-tight"
                style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
              >
                {item.title}
              </h3>
              <p className="text-[#6b5d4f] text-xs md:text-sm font-light leading-relaxed opacity-85 px-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoastalTrust;
