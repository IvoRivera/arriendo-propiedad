// CoastalFooterCta.tsx — Final CTA and footer bar
// data-stitch-id: footer-cta-section

import React from "react";
import { MessageCircle } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";

interface CoastalFooterCtaProps {
  readonly className?: string;
  onAction?: () => void;
}

export const CoastalFooterCta: React.FC<CoastalFooterCtaProps> = ({ className = "", onAction }) => {
  return (
    <footer className={`bg-[#f5f0e8] border-t border-[#e2d9cc] ${className}`}>
      {/* CTA block */}
      <div className="py-16 md:py-20 px-6 text-center">
        <h2
          className="text-3xl md:text-4xl font-serif font-normal text-[#2c2416] mb-3"
          style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
        >
          {SITE_CONTENT.footerCta.headline}
        </h2>
        <p className="text-[#6b5d4f] text-sm font-light mb-8 max-w-xs mx-auto">
          {SITE_CONTENT.footerCta.subheadline}
        </p>
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2.5 bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-sm px-8 py-4 rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" fill="currentColor" />
          <span>{SITE_CONTENT.footerCta.ctaText}</span>
        </button>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#d4c9b8] py-4 px-6 text-center">
        <p className="text-[#9a8a78] text-xs font-light">
          Departamento Premium La Serena · {SITE_CONTENT.site.address}
        </p>
      </div>
    </footer>
  );
};

export default CoastalFooterCta;
