// CoastalSpecs.tsx — Property specifications section
// data-stitch-id: specs-section (screen: 75756b60186b4c8da17437331f094caa)

import React from "react";
import { Maximize2, BedDouble, Sun, Car } from "lucide-react";
import { specificationsData } from "@/data/mockData";

interface CoastalSpecsProps {
  readonly className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  area: <Maximize2 className="w-7 h-7" strokeWidth={1.5} />,
  bed: <BedDouble className="w-7 h-7" strokeWidth={1.5} />,
  terrace: <Sun className="w-7 h-7" strokeWidth={1.5} />,
  car: <Car className="w-7 h-7" strokeWidth={1.5} />,
};

export const CoastalSpecs: React.FC<CoastalSpecsProps> = ({ className = "" }) => {
  return (
    // data-stitch-id: specs-root
    <section className={`bg-[#f5f0e8] py-16 md:py-20 px-6 border-t border-[#e2d9cc] ${className}`}>
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        {/* data-stitch-id: specs-title */}
        <h2
          className="text-3xl md:text-4xl font-serif font-normal text-[#2c2416] text-center mb-12"
          style={{ fontFamily: "'Newsreader', 'Georgia', serif" }}
        >
          {specificationsData.sectionTitle}
        </h2>

        {/* 4-column specs row */}
        {/* data-stitch-id: specs-grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {specificationsData.items.map((item, index) => (
            // data-stitch-id: specs-item
            <div key={index} className="flex flex-col items-center text-center gap-3">
              <div className="text-[#6b7c4a]">
                {iconMap[item.icon]}
              </div>
              <div>
                <p
                  className="text-[#2c2416] font-semibold text-base"
                  style={{ fontFamily: "'Newsreader', 'Georgia', serif" }}
                >
                  {item.label}
                </p>
                <p className="text-[#9a8a78] text-xs font-light mt-0.5 tracking-wide uppercase">
                  {item.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoastalSpecs;
