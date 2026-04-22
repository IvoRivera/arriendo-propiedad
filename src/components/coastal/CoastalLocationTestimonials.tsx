// CoastalLocationTestimonials.tsx — Map + Testimonials, with post-testimonial CTA
// data-stitch-id: location-testimonials-section

import React from "react";
import { Star, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, testimonialsData } from "@/data/mockData";

interface CoastalLocationTestimonialsProps {
  readonly className?: string;
}

export const CoastalLocationTestimonials: React.FC<CoastalLocationTestimonialsProps> = ({ className = "" }) => {
  return (
    <section className={`bg-[#faf7f2] py-14 md:py-16 px-6 border-t border-[#e2d9cc] ${className}`}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

        {/* LEFT: Location */}
        {/* data-stitch-id: location-block */}
        <div>
          <h2
            className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-6"
            style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
          >
            Ubicación
          </h2>

          <div className="w-full h-56 rounded-xl overflow-hidden border border-[#d4c9b8] mb-5">
            <iframe
              src={siteConfig.googleMapsEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          <div className="flex items-start gap-2 text-[#6b5d4f] text-sm">
            <MapPin className="w-4 h-4 mt-0.5 text-[#6b7c4a] flex-shrink-0" />
            <div>
              <p className="font-medium text-[#2c2416]">Edificio Playa Serena</p>
              <p className="font-light">{siteConfig.address}</p>
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6b7c4a] hover:underline text-xs mt-1 inline-block"
              >
                Ver en Google Maps →
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: Testimonials */}
        {/* data-stitch-id: testimonials-block */}
        <div>
          <h2
            className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-6"
            style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
          >
            {testimonialsData.sectionTitle}
          </h2>

          <div className="flex flex-col gap-4 mb-8">
            {testimonialsData.items.map((item, index) => (
              // data-stitch-id: testimonial-card
              <div key={index} className="bg-[#f5f0e8] rounded-xl p-5 border border-[#e2d9cc]">
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#c8b89a] flex items-center justify-center text-[#2c2416] text-sm font-semibold flex-shrink-0">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-[#2c2416] text-sm font-semibold">{item.name}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#c8883a] text-[#c8883a]" />
                        ))}
                      </div>
                      <span className="text-[#9a8a78] text-xs">{item.source}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[#6b5d4f] text-sm font-light leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>
            ))}
          </div>

          {/* Post-testimonials CTA — trust-based */}
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-md w-full justify-center md:w-auto"
          >
            <MessageCircle className="w-4 h-4" fill="currentColor" />
            <span>{testimonialsData.ctaText}</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default CoastalLocationTestimonials;
