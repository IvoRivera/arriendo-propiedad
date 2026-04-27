// CoastalFooterCta.tsx — Final CTA and footer bar
// data-stitch-id: footer-cta-section

import React from "react";
import { ArrowRight } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";

interface CoastalFooterCtaProps {
  readonly className?: string;
  onAction?: () => void;
}

export const CoastalFooterCta: React.FC<CoastalFooterCtaProps> = ({ className = "", onAction }) => {
  return (
    <footer className={`bg-[#f5f0e8] border-t border-[#e2d9cc] ${className}`}>
      {/* CTA block */}
      <div className="py-20 md:py-32 px-6 text-center max-w-4xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-serif italic text-[#2c2416] mb-6"
          style={{ fontFamily: "var(--font-newsreader), serif" }}
        >
          Te esperamos frente al mar
        </h2>
        <p className="text-[#8a7a6a] text-lg font-light mb-10 max-w-md mx-auto leading-relaxed italic">
          Cada detalle está listo para que tu única preocupación sea disfrutar el sonido de las olas.
        </p>
        <button
          onClick={onAction}
          className="group flex items-center gap-4 mx-auto text-[13px] font-mono uppercase tracking-[0.3em] text-[#2c2416] transition-all"
        >
          <span className="border-b border-[#2c2416]/20 group-hover:border-[#2c2416] pb-2 transition-all">
            Volver a disponibilidad
          </span>
          <ArrowRight className="w-4 h-4 text-[#c8883a] group-hover:translate-x-1 transition-transform" />
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
