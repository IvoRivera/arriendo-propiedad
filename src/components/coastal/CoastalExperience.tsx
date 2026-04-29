// CoastalExperience.tsx — "Experience" section: 3-column feature grid
// data-stitch-id: experience-section (screen: 75756b60186b4c8da17437331f094caa)

import React from "react";
import { SITE_CONTENT } from "@/config/site-content";
import { Waves, Sofa, ShieldCheck, Maximize } from "lucide-react";

interface CoastalExperienceProps {
  readonly className?: string;
}



const iconMap: Record<string, React.ReactNode> = {
  waves: <Waves className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.2} />,
  sofa: <Sofa className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.2} />,
  shield: <ShieldCheck className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.2} />,
  maximize: <Maximize className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.2} />,
};

export const CoastalExperience: React.FC<CoastalExperienceProps> = ({ className = "" }) => {
  return (
    // data-stitch-id: experience-root
    <section className={`bg-[#f5f0e8] py-12 md:py-16 px-6 ${className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {/* data-stitch-id: experience-header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-3 tracking-tight"
            style={{ fontFamily: "'Newsreader', 'Georgia', serif" }}
          >
            {SITE_CONTENT.experience.sectionTitle}
          </h2>
          <p className="text-[#6b5d4f] text-xs md:text-base font-light leading-relaxed max-w-md mx-auto opacity-70">
            {SITE_CONTENT.experience.sectionSubtitle}
          </p>
        </div>

        {/* 2x2 on Mobile, 4 columns on Desktop */}
        {/* data-stitch-id: experience-grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-0 md:divide-x divide-[#d4c9b8]/40">
          {SITE_CONTENT.experience.features.slice(0, 4).map((feature, index) => (
            // data-stitch-id: experience-card
            <div
              key={index}
              className="flex flex-col items-center text-center px-4 md:px-8 py-2 md:py-4"
            >
              <div className="text-[#00628f] mb-4 md:mb-6 opacity-80">
                {iconMap[feature.icon]}
              </div>
              <h3
                className="text-sm md:text-base font-semibold text-[#2c2416] mb-2 md:mb-3 tracking-wide"
                style={{ fontFamily: "'Newsreader', 'Georgia', serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-[#8a7a6a] text-[11px] md:text-sm font-light leading-relaxed opacity-70">
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
