"use client";

import React from "react";
import { Plus, Info, Save, AlertCircle } from "lucide-react";

interface RuleFormProps {
  newRule: {
    start_date: string;
    end_date: string;
    price_per_night: string;
    weekend_price: string;
    season_name: string;
    priority: number;
  };
  isSaving: boolean;
  setNewRule: React.Dispatch<React.SetStateAction<any>>;
  onAddRule: (e: React.FormEvent) => void;
}

export const RuleForm: React.FC<RuleFormProps> = ({
  newRule,
  isSaving,
  setNewRule,
  onAddRule
}) => {
  return (
    <div className="bg-white border border-[#e2d9cc] rounded-[40px] p-10 shadow-sm space-y-8 relative overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#6b7c4a] rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-serif italic text-[#2c2416]">Agregar Nueva Regla</h3>
          <p className="text-[9px] text-[#9a8a78] uppercase tracking-[0.2em] font-bold text-left">Configuración de temporada especial</p>
        </div>
      </div>

      <form onSubmit={onAddRule} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1 flex">Nombre de la Temporada</label>
            <input 
              required
              type="text" 
              placeholder="Ej: Temporada Alta Enero"
              value={newRule.season_name}
              onChange={e => setNewRule({...newRule, season_name: e.target.value})}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-2xl px-5 py-4 text-sm focus:border-[#6b7c4a] outline-none transition-all shadow-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1 flex">Fecha de Inicio</label>
            <input 
              required
              type="date" 
              value={newRule.start_date}
              onChange={e => setNewRule({...newRule, start_date: e.target.value})}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-2xl px-5 py-4 text-sm focus:border-[#6b7c4a] outline-none transition-all shadow-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1 flex">Fecha de Término</label>
            <input 
              required
              type="date" 
              value={newRule.end_date}
              onChange={e => setNewRule({...newRule, end_date: e.target.value})}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-2xl px-5 py-4 text-sm focus:border-[#6b7c4a] outline-none transition-all shadow-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1 flex">Precio Semanal (Lun-Jue)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9a8a78] font-bold">$</span>
              <input 
                required
                type="number" 
                placeholder="0"
                value={newRule.price_per_night}
                onChange={e => setNewRule({...newRule, price_per_night: e.target.value})}
                className="w-full bg-[#faf7f2]/50 border border-[#6b7c4a]/30 rounded-2xl pl-10 pr-5 py-4 text-lg focus:border-[#6b7c4a] outline-none transition-all shadow-sm font-serif italic text-[#2c2416]" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7c4a] ml-1 flex">Precio Fin de Semana (Vie-Sáb)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6b7c4a] font-bold">$</span>
              <input 
                type="number" 
                placeholder="Opcional"
                value={newRule.weekend_price}
                onChange={e => setNewRule({...newRule, weekend_price: e.target.value})}
                className="w-full bg-[#6b7c4a]/5 border border-[#6b7c4a]/30 rounded-2xl pl-10 pr-5 py-4 text-lg focus:border-[#6b7c4a] outline-none transition-all shadow-sm font-serif italic text-[#2c2416]" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1 flex items-center gap-2">
              Prioridad
              <div className="group relative cursor-help">
                <Info className="w-3.5 h-3.5 text-[#9a8a78]" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#2c2416] text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 leading-relaxed font-light shadow-2xl border border-white/10">
                  Gana la regla de <b>mayor prioridad</b>. Si es igual, gana la más específica (rango corto).
                </div>
              </div>
            </label>
            <input 
              type="number" 
              value={newRule.priority}
              onChange={e => setNewRule({...newRule, priority: parseInt(e.target.value) || 0})}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-2xl px-5 py-4 text-sm focus:border-[#6b7c4a] outline-none transition-all shadow-sm" 
            />
          </div>

          <div className="flex items-end lg:col-span-3">
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full py-5 bg-[#6b7c4a] text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#5a6a3d] transition-all shadow-xl active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Guardando..." : "Activar Regla de Temporada"}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-[#faf7f2] border border-[#e2d9cc] rounded-3xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-[#6b7c4a] shrink-0" />
        <div className="space-y-1 text-left">
          <p className="text-[11px] text-[#2c2416] font-medium leading-relaxed">
            Las reglas se aplican instantáneamente. El sistema detectará automáticamente feriados y fines de semana largos si usas el <b>Calendario Avanzado</b>.
          </p>
        </div>
      </div>
    </div>
  );
};
