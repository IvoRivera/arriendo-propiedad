// CoastalSpecs.tsx — Property specifications section
// data-stitch-id: specs-section (screen: 75756b60186b4c8da17437331f094caa)

import React from "react";
import { Maximize2, BedDouble, Sun, Car } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";

interface CoastalSpecsProps {
  readonly className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  area: <Maximize2 className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.2} />,
  bed: <BedDouble className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.2} />,
  terrace: <Sun className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.2} />,
  car: <Car className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.2} />,
};

export const CoastalSpecs: React.FC<CoastalSpecsProps> = ({ className = "" }) => {
  return (
    // data-stitch-id: specs-root
    <section className={`bg-[#f5f0e8] py-12 md:py-16 px-6 border-t border-[#e2d9cc]/30 ${className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {/* data-stitch-id: specs-header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="text-2xl md:text-3xl font-serif-luxury text-[#2c2416] mb-3 tracking-tight"
          >
            {SITE_CONTENT.specs.sectionTitle}
          </h2>
          <p className="text-[#6b5d4f] text-sm md:text-lg font-light leading-relaxed max-w-2xl mx-auto opacity-85">
            {SITE_CONTENT.specs.sectionSubtitle}
          </p>
        </div>

        {/* 2x2 on Mobile, 4 columns on Desktop with dividers */}
        {/* data-stitch-id: specs-grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-0 md:divide-x divide-[#d4c9b8]/40">
          {SITE_CONTENT.specs.items.map((item, index) => (
            // data-stitch-id: specs-card
            <div
              key={index}
              className="flex flex-col items-center text-center px-4 md:px-8 py-2 md:py-4"
            >
              <div className="text-[#00628f] mb-4 md:mb-6 opacity-80">
                <div className="scale-90 md:scale-100">
                  {iconMap[item.icon]}
                </div>
              </div>
              <h3
                className="text-[10px] md:text-xs font-medium font-sans-luxury text-[#2c2416] mb-2 md:mb-3 tracking-luxury uppercase opacity-90"
              >
                {item.sublabel}
              </h3>
              <p className="text-[#8a7a6a] text-xs md:text-[15px] font-light leading-relaxed opacity-85">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoastalSpecs;
