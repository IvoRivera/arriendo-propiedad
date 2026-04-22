// CoastalFooterCta.tsx — Final CTA and footer bar
// data-stitch-id: footer-cta-section

import React from "react";
import { MessageCircle } from "lucide-react";
import { footerCtaData, siteConfig } from "@/data/mockData";

interface CoastalFooterCtaProps {
  readonly className?: string;
}

export const CoastalFooterCta: React.FC<CoastalFooterCtaProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-[#f5f0e8] border-t border-[#e2d9cc] ${className}`}>
      {/* CTA block */}
      <div className="py-16 md:py-20 px-6 text-center">
        <h2
          className="text-3xl md:text-4xl font-serif font-normal text-[#2c2416] mb-3"
          style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
        >
          {footerCtaData.headline}
        </h2>
        <p className="text-[#6b5d4f] text-sm font-light mb-8 max-w-xs mx-auto">
          {footerCtaData.subheadline}
        </p>
        <a
          href={siteConfig.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-sm px-8 py-4 rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <MessageCircle className="w-4 h-4" fill="currentColor" />
          <span>{footerCtaData.ctaText}</span>
        </a>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#d4c9b8] py-4 px-6 text-center">
        <p className="text-[#9a8a78] text-xs font-light">
          Departamento Premium La Serena · {siteConfig.address}
        </p>
      </div>
    </footer>
  );
};

export default CoastalFooterCta;
