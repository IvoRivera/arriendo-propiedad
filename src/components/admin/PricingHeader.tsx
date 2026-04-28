"use client";

import React from "react";
import { 
  TrendingUp, Calendar, AlertCircle, 
  ChevronDown, PlusCircle, Zap 
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

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
  onQuickAction
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-sand-dark shadow-sm">
      {/* Left: Base Price Context */}
      <div className="flex items-center gap-6">
        <div className="p-4 bg-primary-navy/5 rounded-[24px] border border-primary-navy/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-navy/40 mb-1">Precio Base Actual</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif italic text-primary-navy">{formatCurrency(basePrice)}</span>
            <span className="text-[10px] text-primary-navy/40">/ noche</span>
          </div>
        </div>

        <div className="h-10 w-px bg-sand-dark hidden md:block" />

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-navy/40">Estado del Sistema</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-primary-navy">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-sm font-bold">{activeRulesCount} Reglas Activas</span>
            </div>
            {nextHoliday && (
              <div className="flex items-center gap-1.5 text-primary-navy/60">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-sm">Próximo: {nextHoliday.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative group flex-1 md:flex-none">
          <button className="w-full md:w-auto px-6 py-4 bg-sand-light border border-sand-dark rounded-2xl flex items-center justify-between gap-3 hover:bg-sand-DEFAULT transition-all">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-primary-navy" />
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary-navy">Acciones Rápidas</span>
            </div>
            <ChevronDown className="w-4 h-4 text-primary-navy/40" />
          </button>
          
          <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-sand-dark rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            {[
              { id: 'jan', label: 'Enero Completo', icon: '❄️' },
              { id: 'feb', label: 'Febrero Completo', icon: '🔥' },
              { id: 'winter', label: 'Vacaciones Invierno', icon: '🏔️' },
              { id: 'easter', label: 'Semana Santa', icon: '🕊️' },
              { id: 'holidays', label: 'Todos los Feriados', icon: '🇨🇱' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onQuickAction?.(item.id)}
                className="w-full px-5 py-3.5 text-left text-[11px] font-medium text-primary-navy hover:bg-sand-light transition-colors flex items-center gap-3 border-b border-sand-dark last:border-0"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button className="flex-1 md:flex-none px-6 py-4 bg-primary-navy text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary-navy/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          Guardar Todo
        </button>
      </div>
    </div>
  );
};
