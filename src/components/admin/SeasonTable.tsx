"use client";

import React from "react";
import { Calendar, Edit2, Trash2, Save, X } from "lucide-react";
import { SeasonalPricing } from "@/types/pricing";
import { formatCurrency } from "@/lib/formatters";

interface SeasonTableProps {
  seasonalPrices: SeasonalPricing[];
  editingId: string | null;
  editForm: SeasonalPricing | null;
  isSaving: boolean;
  onEditStart: (rule: SeasonalPricing) => void;
  onEditCancel: () => void;
  onUpdateRule: () => void;
  onDeleteRule: (id: string) => void;
  setEditForm: React.Dispatch<React.SetStateAction<SeasonalPricing | null>>;
}

export const SeasonTable: React.FC<SeasonTableProps> = ({
  seasonalPrices,
  editingId,
  editForm,
  isSaving,
  onEditStart,
  onEditCancel,
  onUpdateRule,
  onDeleteRule,
  setEditForm
}) => {
  return (
    <div className="bg-white border border-[#e2d9cc] rounded-[32px] shadow-sm overflow-hidden border-separate">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#faf7f2]/50 border-b border-[#e2d9cc]">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Temporada</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Periodo</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Semana</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Fin de Semana</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Prioridad</th>
              <th className="px-8 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2d9cc]/30">
            {seasonalPrices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center text-[#6b5d4f] italic font-light">
                  No hay reglas de temporada configuradas actualmente.
                </td>
              </tr>
            ) : (
              seasonalPrices.map((rule) => (
                <tr key={rule.id} className={`${editingId === rule.id ? 'bg-[#6b7c4a]/5' : 'hover:bg-[#faf7f2]/30'} transition-colors group`}>
                  <td className="px-8 py-5">
                    {editingId === rule.id ? (
                      <input 
                        type="text"
                        value={editForm?.season_name}
                        onChange={e => setEditForm(f => f ? {...f, season_name: e.target.value} : null)}
                        className="w-full bg-white border border-[#e2d9cc] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#6b7c4a]"
                      />
                    ) : (
                      <span className="font-medium text-[#2c2416] group-hover:text-[#6b7c4a] transition-colors">{rule.season_name}</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {editingId === rule.id ? (
                      <div className="flex flex-col gap-2">
                        <input 
                          type="date"
                          value={editForm?.start_date}
                          onChange={e => setEditForm(f => f ? {...f, start_date: e.target.value} : null)}
                          className="w-full bg-white border border-[#e2d9cc] rounded-lg px-2 py-1 text-[10px] outline-none"
                        />
                        <input 
                          type="date"
                          value={editForm?.end_date}
                          onChange={e => setEditForm(f => f ? {...f, end_date: e.target.value} : null)}
                          className="w-full bg-white border border-[#e2d9cc] rounded-lg px-2 py-1 text-[10px] outline-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-[#6b5d4f] text-sm font-light">
                        <Calendar className="w-3.5 h-3.5 text-[#9a8a78]" />
                        <span>{rule.start_date} → {rule.end_date}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {editingId === rule.id ? (
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#9a8a78]">$</span>
                        <input 
                          type="number"
                          value={editForm?.price_per_night}
                          onChange={e => setEditForm(f => f ? {...f, price_per_night: Number(e.target.value)} : null)}
                          className="w-full bg-white border border-[#e2d9cc] rounded-lg pl-5 pr-2 py-2 text-xs outline-none"
                        />
                      </div>
                    ) : (
                      <span className="font-serif italic text-lg text-[#2c2416]">{formatCurrency(rule.price_per_night)}</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {editingId === rule.id ? (
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#9a8a78]">$</span>
                        <input 
                          type="number"
                          value={editForm?.weekend_price || ''}
                          placeholder="Opcional"
                          onChange={e => setEditForm(f => f ? {...f, weekend_price: e.target.value ? Number(e.target.value) : null} : null)}
                          className="w-full bg-white border border-[#e2d9cc] rounded-lg pl-5 pr-2 py-2 text-xs outline-none"
                        />
                      </div>
                    ) : (
                      <span className="font-serif italic text-lg text-[#6b7c4a]">
                        {rule.weekend_price ? formatCurrency(rule.weekend_price) : '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {editingId === rule.id ? (
                      <input 
                        type="number"
                        value={editForm?.priority}
                        onChange={e => setEditForm(f => f ? {...f, priority: Number(e.target.value)} : null)}
                        className="w-16 bg-white border border-[#e2d9cc] rounded-lg px-2 py-2 text-xs outline-none"
                      />
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        rule.priority > 0 
                          ? 'bg-[#6b7c4a] text-white' 
                          : 'bg-white text-[#9a8a78] border border-[#e2d9cc]'
                      }`}>
                        P{rule.priority}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === rule.id ? (
                        <>
                          <button 
                            onClick={onUpdateRule}
                            disabled={isSaving}
                            className="p-2 text-[#6b7c4a] hover:bg-[#6b7c4a]/10 rounded-xl transition-all"
                            title="Guardar cambios"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={onEditCancel}
                            className="p-2 text-[#9a8a78] hover:bg-gray-100 rounded-xl transition-all"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => onEditStart(rule)}
                            className="p-2 text-[#9a8a78] hover:text-[#6b7c4a] hover:bg-[#6b7c4a]/5 rounded-xl transition-all"
                            title="Editar regla"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteRule(rule.id)}
                            className="p-2 text-[#9a8a78] hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            title="Eliminar regla"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
