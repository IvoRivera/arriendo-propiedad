"use client";

import React from "react";
import { 
  X, Save, Trash2, Calendar, 
  ChevronRight, AlertCircle, Check 
} from "lucide-react";
import { PRICING_COLORS } from "@/lib/constants";
import { SeasonalPricing } from "@/types/pricing";

interface PricingSidebarProps {
  mode: 'create' | 'edit' | 'idle';
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const PricingSidebar: React.FC<PricingSidebarProps> = ({
  mode,
  data,
  setData,
  onSave,
  onDelete,
  onCancel,
  isSaving
}) => {
  const isEdit = mode === 'edit';

  return (
    <div className="flex flex-col bg-[#faf7f2] h-full">
      {/* Header */}
      <div className="px-6 py-12 sm:px-12 sm:pt-20 sm:pb-12 text-center relative border-b border-sand-dark/10">
        <h3 className="font-serif text-3xl sm:text-4xl text-primary-navy italic tracking-tight">
          {isEdit ? 'Editar Temporada' : 'Nueva Temporada'}
        </h3>
        <p className="text-[#9a8a78] text-[10px] uppercase tracking-widest mt-2 font-bold">
          {isEdit ? 'Modificar regla existente' : 'Configurar nuevo periodo tarifario'}
        </p>
        
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-primary-navy/40 hover:text-primary-navy transition-colors rounded-full hover:bg-black/5"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8 sm:px-12 sm:py-12 flex-1 space-y-10">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#9a8a78] ml-1">Nombre de la Temporada</label>
          <input 
            type="text"
            placeholder="Ej: Verano 2024"
            value={data.season_name}
            onChange={e => setData({...data, season_name: e.target.value})}
            className="w-full bg-[#fdfbf7] border border-sand-dark/20 rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-primary-navy/30 outline-none transition-all shadow-sm font-medium text-primary-navy placeholder:text-[#9a8a78]/50"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#9a8a78] ml-1">Fecha de Inicio</label>
            <input 
              type="date"
              value={data.start_date}
              onChange={e => setData({...data, start_date: e.target.value})}
              className="w-full min-w-0 bg-[#fdfbf7] border border-sand-dark/20 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 text-sm focus:border-primary-navy/30 outline-none shadow-sm text-primary-navy appearance-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#9a8a78] ml-1">Fecha de Término</label>
            <input 
              type="date"
              value={data.end_date}
              onChange={e => setData({...data, end_date: e.target.value})}
              className="w-full min-w-0 bg-[#fdfbf7] border border-sand-dark/20 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 text-sm focus:border-primary-navy/30 outline-none shadow-sm text-primary-navy appearance-none"
            />
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#9a8a78] ml-1">Precio Semana (L-J)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-navy/40 font-bold">$</span>
              <input 
                type="number"
                value={data.price_per_night}
                onChange={e => setData({...data, price_per_night: e.target.value})}
                className="w-full bg-[#fdfbf7] border border-sand-dark/20 rounded-xl pl-8 pr-4 py-4 text-2xl font-serif italic focus:border-primary-navy/30 outline-none shadow-sm text-primary-navy"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#9a8a78] ml-1">Precio Finde (V-S)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-navy/60 font-bold">$</span>
              <input 
                type="number"
                value={data.weekend_price}
                onChange={e => setData({...data, weekend_price: e.target.value})}
                className="w-full bg-primary-navy/5 border border-primary-navy/10 rounded-xl pl-8 pr-4 py-4 text-2xl font-serif italic focus:border-primary-navy outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Category / Color */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-navy/40 ml-1">Categoría Visual</label>
          <div className="grid grid-cols-3 gap-2">
            {PRICING_COLORS.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => setData({...data, color_hex: color.hex})}
                className={`
                  flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all
                  ${data.color_hex === color.hex 
                    ? 'border-primary-navy bg-primary-navy/5 ring-1 ring-primary-navy' 
                    : 'border-sand-dark hover:bg-sand-light'}
                `}
              >
                <div 
                  className="w-6 h-6 rounded-full shadow-sm flex items-center justify-center text-white"
                  style={{ backgroundColor: color.hex }}
                >
                  {data.color_hex === color.hex && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-tighter text-primary-navy/60">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-navy/40">Prioridad</label>
            <div className="group relative">
              <AlertCircle className="w-3.5 h-3.5 text-primary-navy/40 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-primary-navy text-white text-[9px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl leading-relaxed">
                Prioridad alta (ej: 100) gana sobre prioridad baja (ej: 0).
              </div>
            </div>
          </div>
          <input 
            type="number"
            value={data.priority}
            onChange={e => setData({...data, priority: parseInt(e.target.value) || 0})}
            className="w-full bg-[#fdfbf7] border border-sand-dark/20 rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-primary-navy/30 outline-none shadow-sm text-primary-navy"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-8 sm:px-12 sm:pb-12 border-t border-sand-dark bg-sand-light/30 space-y-4">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="w-full py-4 bg-gradient-to-br from-[#00628f] to-[#007cb3] text-white rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isEdit ? 'Guardar Cambios' : 'Crear Nueva Temporada'}
        </button>

        {isEdit && onDelete && (
          <button 
            onClick={() => onDelete(data.id)}
            className="w-full py-3 text-rose-500 hover:bg-rose-50 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar permanentemente
          </button>
        )}
      </div>
    </div>
  );
};
