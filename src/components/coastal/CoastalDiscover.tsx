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
    <section className={`bg-[#f5f0e8] py-14 md:py-16 px-6 border-t border-[#e2d9cc] ${className}`}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* LEFT: Experience Blocks */}
        <div>
          <div className="mb-10">
            <h2
              className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-2"
              style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
            >
              {SITE_CONTENT.discover.sectionTitle}
            </h2>
            <p className="text-[#8a7a6a] text-sm font-light">{SITE_CONTENT.discover.sectionSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SITE_CONTENT.discover.items.map((item, index) => (
              <div
                key={index}
                className="bg-[#faf7f2] rounded-xl p-5 border border-[#e2d9cc] hover:border-[#c8b89a] transition-colors duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl" aria-hidden>{item.emoji}</span>
                  <h3
                    className="text-base font-semibold text-[#2c2416]"
                    style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-[#8a7a6a] text-[13px] font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Map & Location */}
        <div className="bg-[#faf7f2] p-1 rounded-2xl border border-[#e2d9cc] shadow-sm overflow-hidden flex flex-col">
           <div className="w-full h-[300px] md:h-[400px] relative">
            <iframe
              src={SITE_CONTENT.site.googleMapsEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-90 hover:opacity-100 transition-opacity duration-300 min-h-[300px]"
            />
          </div>
          <div className="p-6 bg-white/50 backdrop-blur-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#00628f]/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#00628f]" />
            </div>
            <div>
              <p className="text-[#2c2416] font-semibold text-sm">Edificio Playa Serena</p>
              <p className="text-[#6b5d4f] text-xs font-light mt-0.5">{SITE_CONTENT.site.address}</p>
              <a
                href={SITE_CONTENT.site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00628f] hover:underline text-[11px] font-bold mt-2 inline-block uppercase tracking-wider"
              >
                Abrir en Google Maps →
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CoastalDiscover;
