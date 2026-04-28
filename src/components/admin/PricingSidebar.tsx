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
  if (mode === 'idle') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 bg-sand-light border-l border-sand-dark transition-all duration-500">
        <div className="w-16 h-16 bg-sand-DEFAULT rounded-full flex items-center justify-center text-primary-navy/20">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-primary-navy/40 uppercase tracking-widest">Editor de Precios</h3>
          <p className="text-xs text-primary-navy/30 leading-relaxed max-w-[200px]">
            Selecciona un rango en el calendario o una regla existente para comenzar a editar.
          </p>
        </div>
      </div>
    );
  }

  const isEdit = mode === 'edit';

  return (
    <div className="h-full flex flex-col bg-white border-l border-sand-dark shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-sand-dark flex items-center justify-between bg-sand-light">
        <div>
          <h3 className="text-lg font-serif italic text-primary-navy">
            {isEdit ? 'Editar Temporada' : 'Nueva Temporada'}
          </h3>
          <p className="text-[10px] text-primary-navy/40 uppercase tracking-widest font-bold">
            {isEdit ? 'Modificar regla existente' : 'Configurar nuevo periodo'}
          </p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-sand-DEFAULT rounded-full transition-colors text-primary-navy/40 hover:text-primary-navy"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-navy/40 ml-1">Nombre</label>
          <input 
            type="text"
            placeholder="Ej: Verano 2024"
            value={data.season_name}
            onChange={e => setData({...data, season_name: e.target.value})}
            className="w-full bg-sand-light border border-sand-dark rounded-xl px-4 py-3 text-sm focus:border-primary-navy outline-none transition-all shadow-sm font-medium"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-navy/40 ml-1">Inicio</label>
            <input 
              type="date"
              value={data.start_date}
              onChange={e => setData({...data, start_date: e.target.value})}
              className="w-full bg-sand-light border border-sand-dark rounded-xl px-3 py-3 text-xs focus:border-primary-navy outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-navy/40 ml-1">Término</label>
            <input 
              type="date"
              value={data.end_date}
              onChange={e => setData({...data, end_date: e.target.value})}
              className="w-full bg-sand-light border border-sand-dark rounded-xl px-3 py-3 text-xs focus:border-primary-navy outline-none"
            />
          </div>
        </div>

        {/* Prices */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-navy/40 ml-1">Precio Semana (Lun-Jue)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-navy/40 font-bold">$</span>
              <input 
                type="number"
                value={data.price_per_night}
                onChange={e => setData({...data, price_per_night: e.target.value})}
                className="w-full bg-sand-light border border-sand-dark rounded-xl pl-8 pr-4 py-4 text-xl font-serif italic focus:border-primary-navy outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-navy/60 ml-1">Precio Fin de Semana (Vie-Sáb)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-navy/60 font-bold">$</span>
              <input 
                type="number"
                value={data.weekend_price}
                onChange={e => setData({...data, weekend_price: e.target.value})}
                className="w-full bg-primary-navy/5 border border-primary-navy/20 rounded-xl pl-8 pr-4 py-4 text-xl font-serif italic focus:border-primary-navy outline-none"
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
                    ? 'border-primary-navy bg-primary-navy/5' 
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
            className="w-full bg-sand-light border border-sand-dark rounded-xl px-4 py-3 text-sm focus:border-primary-navy outline-none"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-sand-dark bg-sand-light space-y-3">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="w-full py-4 bg-primary-navy text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary-navy/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEdit ? 'Actualizar Regla' : 'Crear Regla'}
        </button>

        {isEdit && onDelete && (
          <button 
            onClick={() => onDelete(data.id)}
            className="w-full py-3 text-rose-500 hover:bg-rose-50 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar Regla
          </button>
        )}
      </div>
    </div>
  );
};
