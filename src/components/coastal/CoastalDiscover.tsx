// CoastalDiscover.tsx — "Descubre La Serena y alrededores" section
// Now includes the location map to consolidate rational value.

import React from "react";
import { MapPin } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";

interface CoastalDiscoverProps {
  readonly className?: string;
}

export const CoastalDiscover: React.FC<CoastalDiscoverProps> = ({ className = "" }) => {
  return (
    <section className={`bg-[#f5f0e8] py-14 md:py-20 px-6 border-t border-[#e2d9cc] ${className}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl font-serif-luxury text-[#2c2416] mb-4 tracking-tight"
          >
            {SITE_CONTENT.discover.sectionTitle}
          </h2>
          <p className="text-[#8a7a6a] text-sm md:text-lg font-light max-w-2xl mx-auto">
            {SITE_CONTENT.discover.sectionSubtitle}
          </p>
        </div>

        {/* 4-column Experience Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {SITE_CONTENT.discover.items.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center bg-[#faf7f2]/50 rounded-3xl p-6 md:p-8 border border-[#e2d9cc]/60 hover:bg-white hover:border-[#00628f]/20 hover:shadow-xl hover:shadow-[#00628f]/5 transition-all duration-500"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border border-[#e2d9cc]/40 flex items-center justify-center mb-6 text-3xl md:text-4xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                <span aria-hidden>{item.emoji}</span>
              </div>
              <h3
                className="text-[11px] md:text-xs font-bold font-sans-luxury text-[#2c2416] tracking-luxury uppercase mb-3 px-2"
              >
                {item.title}
              </h3>
              <p className="text-[#6b5d4f] text-xs md:text-sm font-light leading-relaxed opacity-85">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Map Block */}
        <div className="bg-[#faf7f2] rounded-[40px] border border-[#e2d9cc] shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="w-full md:w-3/5 h-[300px] md:h-[450px] relative">
            <iframe
              src={SITE_CONTENT.site.googleMapsEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <div className="w-full md:w-2/5 p-8 md:p-12 bg-white/40 backdrop-blur-sm flex flex-col justify-center border-t md:border-t-0 md:border-l border-[#e2d9cc]">
            <div className="w-12 h-12 rounded-2xl bg-[#00628f]/10 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-[#00628f]" />
            </div>
            <h4 className="text-xl font-serif-luxury text-[#2c2416] mb-2">Ubicación Privilegiada</h4>
            <p className="text-[#2c2416] font-bold text-sm mb-1 font-sans-luxury tracking-luxury-sm uppercase">Edificio Playa Serena</p>
            <p className="text-[#6b5d4f] text-sm font-light mb-8">{SITE_CONTENT.site.address}</p>
            
            <a
              href={SITE_CONTENT.site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#00628f] text-white text-[11px] font-bold uppercase tracking-luxury rounded-full hover:bg-[#003d5c] transition-all active:scale-95 shadow-lg shadow-[#00628f]/20 w-fit"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CoastalDiscover;
