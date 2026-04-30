"use client";

import React from "react";
import { 
  TrendingUp, Calendar, AlertCircle, 
  ChevronDown, PlusCircle, Zap 
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface PricingHeaderProps {
  basePrice: number;
  activeRulesCount: number;
  nextHoliday?: { date: string, name: string };
  onQuickAction?: (action: string) => void;
}

export const PricingHeader: React.FC<PricingHeaderProps> = ({
  basePrice,
  activeRulesCount,
  nextHoliday,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-sand-dark shadow-sm">
      {/* Base Price Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 w-full">
        <div className="p-4 bg-primary-navy/5 rounded-[24px] border border-primary-navy/10 w-full sm:w-auto">
          <p className="text-[10px] font-bold uppercase tracking-luxury text-primary-navy/40 mb-1">Precio Base Actual</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-serif-luxury italic text-primary-navy tracking-tight">{formatCurrency(basePrice)}</span>
            <span className="text-[10px] text-primary-navy/40 font-bold tracking-luxury-sm">/ noche</span>
          </div>
        </div>

        <div className="h-10 w-px bg-sand-dark hidden sm:block" />

        <div className="space-y-2 flex-1 w-full">
          <p className="text-[10px] font-bold uppercase tracking-luxury text-primary-navy/40 ml-1">Estado del Sistema</p>
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-primary-navy bg-primary-navy/5 px-3 py-1.5 rounded-full border border-primary-navy/10 tracking-luxury-sm">
              <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
              <span className="text-[11px] md:text-sm font-bold">{activeRulesCount} Reglas Activas</span>
            </div>
            {nextHoliday && (
              <div className="flex items-center gap-1.5 text-primary-navy/80 bg-sand-light px-3 py-1.5 rounded-full border border-sand-dark tracking-luxury-sm">
                <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-sand-dark" />
                <span className="text-[11px] md:text-sm font-medium">
                  Próximo: <span className="font-bold">{format(parseISO(nextHoliday.date), "d 'de' MMM", { locale: es })}</span> ({nextHoliday.name})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

