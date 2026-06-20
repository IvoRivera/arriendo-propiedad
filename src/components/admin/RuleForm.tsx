"use client";

import React from "react";
import { AlertCircle, Check, Info, Plus, Save } from "lucide-react";
import { PRICING_COLORS } from "@/lib/constants";

interface RuleDraft {
  start_date: string;
  end_date: string;
  price_per_night: string;
  weekend_price: string;
  season_name: string;
  priority: number;
  color_hex: string;
}

interface RuleFormProps {
  newRule: RuleDraft;
  isSaving: boolean;
  setNewRule: React.Dispatch<React.SetStateAction<RuleDraft>>;
  onAddRule: (event: React.FormEvent) => void;
}

export const RuleForm: React.FC<RuleFormProps> = ({
  newRule,
  isSaving,
  setNewRule,
  onAddRule,
}) => {
  const updateRule = (patch: Partial<RuleDraft>) => {
    setNewRule((current) => ({ ...current, ...patch }));
  };

  return (
    <div className="bg-white border border-[#e2d9cc] rounded-[40px] p-10 shadow-sm space-y-8 relative overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#6b7c4a] rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-serif-luxury italic text-[#2c2416] tracking-tight">
            Agregar nueva regla
          </h3>
          <p className="text-[9px] text-[#9a8a78] uppercase tracking-luxury font-bold text-left">
            Configuracion de temporada especial
          </p>
        </div>
      </div>

      <form onSubmit={onAddRule} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78] ml-1 flex">
              Nombre de la temporada
            </label>
            <input
              required
              type="text"
              placeholder="Ej: Temporada Alta Enero"
              value={newRule.season_name}
              onChange={(event) => updateRule({ season_name: event.target.value })}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-full px-5 py-4 text-sm focus:border-[#6b7c4a] outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78] ml-1 flex">
              Fecha de inicio
            </label>
            <input
              required
              type="date"
              value={newRule.start_date}
              onChange={(event) => updateRule({ start_date: event.target.value })}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-full px-5 py-4 text-sm focus:border-[#6b7c4a] outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78] ml-1 flex">
              Fecha de termino
            </label>
            <input
              required
              type="date"
              value={newRule.end_date}
              onChange={(event) => updateRule({ end_date: event.target.value })}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-full px-5 py-4 text-sm focus:border-[#6b7c4a] outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78] ml-1 flex">
              Precio semanal (Lun-Jue)
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9a8a78] font-bold">
                $
              </span>
              <input
                required
                type="number"
                placeholder="0"
                value={newRule.price_per_night}
                onChange={(event) => updateRule({ price_per_night: event.target.value })}
                className="w-full bg-[#faf7f2]/50 border border-[#6b7c4a]/30 rounded-full pl-10 pr-5 py-4 text-lg focus:border-[#6b7c4a] outline-none transition-all shadow-sm font-serif-luxury italic text-[#2c2416]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-luxury text-[#6b7c4a] ml-1 flex">
              Precio fin de semana (Vie-Sab)
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6b7c4a] font-bold">
                $
              </span>
              <input
                type="number"
                placeholder="Opcional"
                value={newRule.weekend_price}
                onChange={(event) => updateRule({ weekend_price: event.target.value })}
                className="w-full bg-[#6b7c4a]/5 border border-[#6b7c4a]/30 rounded-full pl-10 pr-5 py-4 text-lg focus:border-[#6b7c4a] outline-none transition-all shadow-sm font-serif-luxury italic text-[#2c2416]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78] ml-1 flex items-center gap-2">
              Prioridad
              <span className="group relative cursor-help">
                <Info className="w-3.5 h-3.5 text-[#9a8a78]" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#2c2416] text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 leading-relaxed font-light shadow-2xl border border-white/10">
                  Gana la regla de mayor prioridad. Si es igual, gana la mas especifica.
                </span>
              </span>
            </label>
            <input
              type="number"
              value={newRule.priority}
              onChange={(event) => updateRule({ priority: parseInt(event.target.value, 10) || 0 })}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-full px-5 py-4 text-sm focus:border-[#6b7c4a] outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3 lg:col-span-3">
            <label className="text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78] ml-1 flex">
              Color en calendario
            </label>
            <div className="flex flex-wrap gap-4">
              {PRICING_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => updateRule({ color_hex: color.hex })}
                  className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all border-2 ${
                    newRule.color_hex === color.hex
                      ? "border-[#6b7c4a] bg-[#6b7c4a]/5"
                      : "border-transparent hover:bg-[#faf7f2]"
                  }`}
                  aria-pressed={newRule.color_hex === color.hex}
                >
                  <span
                    className="w-10 h-10 rounded-full shadow-md flex items-center justify-center text-white"
                    style={{ backgroundColor: color.hex }}
                  >
                    {newRule.color_hex === color.hex && <Check className="w-5 h-5 drop-shadow-md" />}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-luxury-sm text-[#9a8a78]">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-5 bg-[#6b7c4a] text-white rounded-full text-[11px] font-bold uppercase tracking-luxury hover:bg-[#5a6a3d] transition-all shadow-xl active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Guardando..." : "Activar regla de temporada"}
        </button>
      </form>

      <div className="bg-[#faf7f2] border border-[#e2d9cc] rounded-[24px] p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-[#6b7c4a] shrink-0" />
        <div className="space-y-1 text-left">
          <p className="text-[11px] text-[#2c2416] font-medium leading-relaxed tracking-luxury-sm">
            Las reglas se aplican instantaneamente. El sistema detectara feriados y fines de semana largos si usas el calendario avanzado.
          </p>
        </div>
      </div>
    </div>
  );
};
