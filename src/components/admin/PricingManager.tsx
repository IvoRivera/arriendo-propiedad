"use client";

import React, { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { Plus, Trash2, Calendar, TrendingUp, Info, AlertCircle, Save } from "lucide-react";

interface SeasonalPricing {
  id: string;
  start_date: string;
  end_date: string;
  price_per_night: number;
  season_name: string;
  priority: number;
}

export const PricingManager: React.FC = () => {
  const [seasonalPrices, setSeasonalPrices] = useState<SeasonalPricing[]>([]);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state for new rule
  const [newRule, setNewRule] = useState({
    start_date: "",
    end_date: "",
    price_per_night: "",
    season_name: "",
    priority: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch seasonal prices
      const { data: prices, error: pricesError } = await supabaseAdmin
        .from("seasonal_pricing")
        .select("*")
        .order("start_date", { ascending: true });

      if (pricesError) {
        // Handle case where table might not exist yet during migration
        if (pricesError.code !== '42P01') throw pricesError;
      }
      setSeasonalPrices(prices || []);

      // Fetch base price from system_config
      const { data: config, error: configError } = await supabaseAdmin
        .from("system_config")
        .select("value")
        .eq("key", "PROPERTY_RENT_VALUE")
        .single();

      if (configError) throw configError;
      setBasePrice(parseInt(config.value.replace(/\D/g, '')));
    } catch (err) {
      console.error("Error fetching pricing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.start_date || !newRule.end_date || !newRule.price_per_night || !newRule.season_name) return;

    setIsSaving(true);
    try {
      const { error } = await supabaseAdmin
        .from("seasonal_pricing")
        .insert([{
          ...newRule,
          price_per_night: parseInt(newRule.price_per_night)
        }]);

      if (error) throw error;
      
      setNewRule({
        start_date: "",
        end_date: "",
        price_per_night: "",
        season_name: "",
        priority: 0
      });
      fetchData();
    } catch (err) {
      console.error("Error adding rule:", err);
      alert("Error al guardar la regla. Asegúrate de que las fechas sean válidas.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!window.confirm("¿Eliminar esta regla de precio?")) return;

    try {
      const { error } = await supabaseAdmin
        .from("seasonal_pricing")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Error deleting rule:", err);
      alert("Error al eliminar la regla.");
    }
  };

  if (loading) return (
    <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-[#6b7c4a]/20 border-t-[#6b7c4a] rounded-full animate-spin"></div>
      <p className="text-[#6b5d4f] text-sm font-medium">Cargando configuración de precios...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Base Price Info */}
      <div className="bg-white border border-[#e2d9cc] rounded-[32px] p-8 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#6b7c4a]/5 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-110 duration-700" />
        <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
          <div className="w-16 h-16 bg-[#6b7c4a]/10 rounded-2xl flex items-center justify-center text-[#6b7c4a] shrink-0 border border-[#6b7c4a]/20 shadow-inner">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9a8a78]">Configuración Actual</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif italic text-[#2c2416]">
                ${new Intl.NumberFormat('es-CL').format(basePrice)}
              </span>
              <span className="text-[#6b5d4f] text-sm font-light italic">por noche (base)</span>
            </div>
            <p className="text-xs text-[#6b5d4f] font-light max-w-xl mt-3 leading-relaxed">
              Este es el precio base definido en la configuración del sistema. Las reglas de temporada creadas a continuación <b>sobrescribirán</b> este valor para las fechas indicadas.
            </p>
          </div>
        </div>
      </div>

      {/* Seasonal Rules Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif italic text-[#2c2416]">Temporadas y Eventos</h2>
            <p className="text-[10px] text-[#9a8a78] uppercase tracking-[0.2em] font-bold">Gestión de precios dinámicos</p>
          </div>
        </div>

        <div className="bg-white border border-[#e2d9cc] rounded-[32px] shadow-sm overflow-hidden border-separate">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf7f2]/50 border-b border-[#e2d9cc]">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Nombre / Descripción</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Periodo</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Precio / Noche</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Prioridad</th>
                  <th className="px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2d9cc]/30">
                {seasonalPrices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-[#6b5d4f] italic font-light">
                      No hay reglas de temporada configuradas actualmente.
                    </td>
                  </tr>
                ) : (
                  seasonalPrices.map((rule) => (
                    <tr key={rule.id} className="hover:bg-[#faf7f2]/30 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-medium text-[#2c2416] group-hover:text-[#6b7c4a] transition-colors">{rule.season_name}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3 text-[#6b5d4f] text-sm font-light">
                          <div className="w-7 h-7 bg-[#faf7f2] rounded-lg flex items-center justify-center text-[#9a8a78] border border-[#e2d9cc]/30">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <span>{rule.start_date} <span className="text-[#e2d9cc] mx-1">→</span> {rule.end_date}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-serif italic text-lg text-[#2c2416]">${new Intl.NumberFormat('es-CL').format(rule.price_per_night)}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm ${
                            rule.priority > 0 
                              ? 'bg-[#6b7c4a] text-white' 
                              : 'bg-white text-[#9a8a78] border border-[#e2d9cc]'
                          }`}>
                            Prioridad {rule.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-2.5 text-[#9a8a78] hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Eliminar regla"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Rule Form */}
      <div className="bg-white border border-[#e2d9cc] rounded-[40px] p-10 shadow-sm space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#6b7c4a] rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-serif italic text-[#2c2416]">Agregar Nueva Regla</h3>
            <p className="text-[9px] text-[#9a8a78] uppercase tracking-[0.2em] font-bold">Configuración de temporada especial</p>
          </div>
        </div>

        <form onSubmit={handleAddRule} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1">Nombre de la Temporada</label>
              <input 
                required
                type="text" 
                placeholder="Ej: Temporada Alta Enero"
                value={newRule.season_name}
                onChange={e => setNewRule({...newRule, season_name: e.target.value})}
                className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-2xl px-5 py-4 text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1">Fecha de Inicio</label>
              <input 
                required
                type="date" 
                value={newRule.start_date}
                onChange={e => setNewRule({...newRule, start_date: e.target.value})}
                className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-2xl px-5 py-4 text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1">Fecha de Término</label>
              <input 
                required
                type="date" 
                value={newRule.end_date}
                onChange={e => setNewRule({...newRule, end_date: e.target.value})}
                className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-2xl px-5 py-4 text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1">Precio por Noche (CLP)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9a8a78] font-bold">$</span>
                <input 
                  required
                  type="number" 
                  placeholder="0"
                  value={newRule.price_per_night}
                  onChange={e => setNewRule({...newRule, price_per_night: e.target.value})}
                  className="w-full bg-[#faf7f2]/50 border border-[#6b7c4a]/30 rounded-2xl pl-10 pr-5 py-4 text-lg focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm font-serif italic text-[#2c2416]" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78] ml-1 flex items-center gap-2">
                Prioridad
                <div className="group relative cursor-help">
                  <Info className="w-3.5 h-3.5 text-[#9a8a78]" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#2c2416] text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 leading-relaxed font-light shadow-2xl border border-white/10">
                    <p className="font-bold mb-1 uppercase tracking-widest text-[#6b7c4a]">Lógica de Resolución</p>
                    Si un día tiene varias reglas:
                    <ol className="list-decimal ml-4 mt-1 space-y-1 text-white/80">
                      <li>Gana la de <b>mayor prioridad</b>.</li>
                      <li>A igual prioridad, gana la de <b>periodo más corto</b> (más específica).</li>
                    </ol>
                  </div>
                </div>
              </label>
              <input 
                type="number" 
                value={newRule.priority}
                onChange={e => setNewRule({...newRule, priority: parseInt(e.target.value) || 0})}
                className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-2xl px-5 py-4 text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" 
              />
            </div>

            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full py-4 bg-[#6b7c4a] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#5a6a3d] transition-all shadow-xl active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Guardando..." : "Activar Regla"}
              </button>
            </div>
          </div>
        </form>

        <div className="bg-[#faf7f2] border border-[#e2d9cc] rounded-3xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#6b7c4a] shrink-0" />
          <div className="space-y-1">
            <p className="text-[11px] text-[#2c2416] font-medium leading-relaxed">
              Las nuevas reglas se aplican instantáneamente al calendario de disponibilidad y al proceso de reserva. 
            </p>
            <p className="text-[10px] text-[#6b5d4f] font-light leading-relaxed">
              Las reservas ya recibidas mantienen el precio que tenían al momento de ser solicitadas (Snapshot).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
