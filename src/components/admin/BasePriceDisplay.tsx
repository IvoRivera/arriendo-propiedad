"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface BasePriceDisplayProps {
  basePrice: number;
}

export const BasePriceDisplay: React.FC<BasePriceDisplayProps> = ({ basePrice }) => {
  return (
    <div className="bg-white border border-[#e2d9cc] rounded-[32px] p-8 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#6b7c4a]/5 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-110 duration-700" />
      <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
        <div className="w-16 h-16 bg-[#6b7c4a]/10 rounded-2xl flex items-center justify-center text-[#6b7c4a] shrink-0 border border-[#6b7c4a]/20 shadow-inner">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9a8a78] text-left">Configuración Actual</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif italic text-[#2c2416]">
              {formatCurrency(basePrice)}
            </span>
            <span className="text-[#6b5d4f] text-sm font-light italic">por noche (base)</span>
          </div>
          <p className="text-xs text-[#6b5d4f] font-light max-w-xl mt-3 leading-relaxed text-left">
            Este es el precio base. Las reglas de temporada <b>sobrescribirán</b> este valor. 
            Ahora puedes definir precios diferenciados para **fines de semana** (Vie, Sáb) dentro de cada temporada.
          </p>
        </div>
      </div>
    </div>
  );
};
