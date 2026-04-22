// CoastalDiscover.tsx — "Descubre La Serena y alrededores" section
// 4 scannable blocks in 2×2 grid. No images needed — emoji + text keeps it light.

import React from "react";
import { discoverData } from "@/data/mockData";

interface CoastalDiscoverProps {
  readonly className?: string;
}

export const CoastalDiscover: React.FC<CoastalDiscoverProps> = ({ className = "" }) => {
  return (
    <section className={`bg-[#f5f0e8] py-14 md:py-16 px-6 border-t border-[#e2d9cc] ${className}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2
            className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-2"
            style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
          >
            {discoverData.sectionTitle}
          </h2>
          <p className="text-[#8a7a6a] text-sm font-light">{discoverData.sectionSubtitle}</p>
        </div>

        {/* 2×2 grid of experience blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {discoverData.items.map((item, index) => (
            <div
              key={index}
              className="bg-[#faf7f2] rounded-xl p-6 border border-[#e2d9cc] hover:border-[#c8b89a] transition-colors duration-200"
            >
              <span className="text-3xl mb-3 block" aria-hidden>{item.emoji}</span>
              <h3
                className="text-base font-semibold text-[#2c2416] mb-2"
                style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
              >
                {item.title}
              </h3>
              <p className="text-[#8a7a6a] text-sm font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoastalDiscover;
