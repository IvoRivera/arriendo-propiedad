// CoastalExperience.tsx — "Experience" section: 3-column feature grid
// data-stitch-id: experience-section (screen: 75756b60186b4c8da17437331f094caa)

import React from "react";
import { Waves, Sofa, ShieldCheck } from "lucide-react";
import { experienceData } from "@/data/mockData";

interface CoastalExperienceProps {
  readonly className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  waves: <Waves className="w-8 h-8" strokeWidth={1.5} />,
  sofa: <Sofa className="w-8 h-8" strokeWidth={1.5} />,
  shield: <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />,
};

export const CoastalExperience: React.FC<CoastalExperienceProps> = ({ className = "" }) => {
  return (
    // data-stitch-id: experience-root
    <section className={`bg-[#f5f0e8] py-16 md:py-20 px-6 ${className}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        {/* data-stitch-id: experience-header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-serif font-normal text-[#2c2416] mb-4"
            style={{ fontFamily: "'Newsreader', 'Georgia', serif" }}
          >
            {experienceData.sectionTitle}
          </h2>
          <p className="text-[#6b5d4f] text-sm md:text-base font-light leading-relaxed max-w-md mx-auto">
            {experienceData.sectionSubtitle}
          </p>
        </div>

        {/* 3-column grid with dividers — matches Stitch layout */}
        {/* data-stitch-id: experience-grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-[#d4c9b8]">
          {experienceData.features.map((feature, index) => (
            // data-stitch-id: experience-card
            <div
              key={index}
              className="flex flex-col items-center text-center px-8 py-8 md:py-4 border-b md:border-b-0 border-[#d4c9b8] last:border-b-0"
            >
              <div className="text-[#6b7c4a] mb-5">
                {iconMap[feature.icon]}
              </div>
              <h3
                className="text-base font-semibold text-[#2c2416] mb-3 tracking-wide"
                style={{ fontFamily: "'Newsreader', 'Georgia', serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-[#8a7a6a] text-sm font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoastalExperience;
