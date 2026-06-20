import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";

interface CoastalDiscoverProps {
  readonly className?: string;
}

export const CoastalDiscover: React.FC<CoastalDiscoverProps> = ({ className = "" }) => {
  return (
    <section
      className={`bg-[#f5f0e8] py-14 md:py-20 px-6 border-t border-[#e2d9cc] ${className}`}
      id="ubicacion"
      aria-labelledby="local-seo-title"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="local-seo-title"
            className="text-3xl md:text-4xl font-serif-luxury text-[#2c2416] mb-4 tracking-tight"
          >
            {SITE_CONTENT.discover.sectionTitle}
          </h2>
          <p className="text-[#8a7a6a] text-sm md:text-lg font-light max-w-2xl mx-auto">
            {SITE_CONTENT.discover.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {SITE_CONTENT.discover.items.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col md:items-center md:text-center bg-[#faf7f2]/60 rounded-3xl p-6 md:p-8 border border-[#e2d9cc]/60 hover:bg-white hover:border-[#00628f]/20 hover:shadow-xl hover:shadow-[#00628f]/5 transition-all duration-500"
            >
              <div className="grid grid-cols-5 md:flex md:flex-col items-center gap-4 md:gap-0 w-full">
                <div className="col-span-1 flex justify-start md:justify-center w-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white border border-[#e2d9cc]/40 flex items-center justify-center md:mb-6 text-2xl sm:text-3xl md:text-4xl shadow-sm group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                    <span aria-hidden>{item.emoji}</span>
                  </div>
                </div>

                <div className="col-span-4 flex flex-col items-start md:items-center">
                  <h3 className="text-[11px] md:text-xs font-bold font-sans-luxury text-[#2c2416] tracking-luxury uppercase mb-2 md:mb-3 md:px-2">
                    {item.title}
                  </h3>
                  <p className="text-[#6b5d4f] text-xs md:text-sm font-light leading-relaxed opacity-90">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12 md:mb-16">
          {SITE_CONTENT.localHighlights.map((highlight) => (
            <article
              key={highlight.title}
              className="bg-white/70 border border-[#e2d9cc] rounded-2xl p-5"
            >
              <h3 className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#00628f] mb-2">
                {highlight.title}
              </h3>
              <p className="text-xs text-[#6b5d4f] leading-relaxed">{highlight.description}</p>
            </article>
          ))}
        </div>

        <div className="bg-[#faf7f2] rounded-[40px] border border-[#e2d9cc] shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="w-full md:w-3/5 h-[300px] md:h-[450px] relative">
            <iframe
              title="Mapa de ubicacion del departamento en Avenida del Mar 3500 La Serena"
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
            <h3 className="text-xl font-serif-luxury text-[#2c2416] mb-2">
              Ubicacion privilegiada
            </h3>
            <p className="text-[#2c2416] font-bold text-sm mb-1 font-sans-luxury tracking-luxury-sm uppercase">
              Edificio Playa Serena
            </p>
            <p className="text-[#6b5d4f] text-sm font-light mb-8">{SITE_CONTENT.site.address}</p>

            <a
              href={SITE_CONTENT.site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00628f] text-white text-[11px] font-bold uppercase tracking-luxury rounded-full hover:bg-[#003d5c] transition-all active:scale-95 shadow-lg shadow-[#00628f]/20 w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00628f]"
            >
              Abrir en Google Maps
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoastalDiscover;
