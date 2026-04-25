"use client";

import React, { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { Calendar, Trash2, Plus, Clock, AlertCircle, DollarSign } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { getPriceForDate } from "@/lib/pricingClient";

interface BlockedDate {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export function DateBlockingManager() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [reason, setReason] = useState("");
  const [blocks, setBlocks] = useState<BlockedDate[]>([]);
  const [seasonalPrices, setSeasonalPrices] = useState<any[]>([]);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchBlocks = async () => {
    try {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      if (!session) return;

      const response = await fetch("/api/admin/blocked-dates", {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBlocks(data.data);
      }

      // Fetch seasonal prices for visualization
      const { data: prices } = await supabaseAdmin
        .from("seasonal_pricing")
        .select("*");
      setSeasonalPrices(prices || []);

      // Fetch base price
      const { data: config } = await supabaseAdmin
        .from("system_config")
        .select("value")
        .eq("key", "PROPERTY_RENT_VALUE")
        .single();
      if (config) {
        setBasePrice(parseInt(config.value.replace(/\D/g, '')));
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleBlock = async () => {
    if (!range?.from || !range?.to) return;
    
    setLoading(true);
    try {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      const response = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          start_date: range.from.toISOString().split('T')[0],
          end_date: range.to.toISOString().split('T')[0],
          reason: reason || "Bloqueo manual"
        })
      });

      const data = await response.json();
      if (data.success) {
        setRange(undefined);
        setReason("");
        fetchBlocks();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error blocking dates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este bloqueo de fechas?")) return;

    try {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      const response = await fetch(`/api/admin/blocked-dates?id=${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchBlocks();
      }
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left: Selection */}
      <div className="bg-white border border-[#e2d9cc]/50 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#6b7c4a]/10 rounded-xl flex items-center justify-center text-[#6b7c4a]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#2c2416] italic">Bloquear Fechas</h3>
            <p className="text-[10px] text-[#9a8a78] font-bold uppercase tracking-widest mt-0.5">Gestión manual de disponibilidad</p>
          </div>
        </div>

        <div className="mb-8 bg-[#faf7f2]/50 rounded-2xl p-6 border border-[#e2d9cc]/30">
          <style jsx global>{`
            .rdp-admin-root {
              --rdp-cell-size: 40px;
              --rdp-accent-color: #6b7c4a;
              --rdp-background-color: #faf7f2;
              margin: 0;
            }
            .rdp-admin-root .rdp-day {
              border: 1px solid #f0e8dc;
              border-radius: 0;
              margin: 0;
              height: var(--rdp-cell-size);
              width: var(--rdp-cell-size);
              font-size: 0.8rem;
              transition: all 0.2s;
            }
            .rdp-admin-root .rdp-day:hover {
              background-color: #f0e8dc !important;
              color: #2c2416;
            }
            .rdp-admin-root .rdp-day_selected {
              background-color: #6b7c4a !important;
              color: white !important;
              border-color: #6b7c4a;
              z-index: 10;
            }
            .rdp-admin-root .rdp-day_range_middle {
              background-color: #6b7c4a15 !important;
              color: #6b7c4a !important;
            }
            .rdp-admin-root .rdp-months {
              justify-content: center;
            }
            .rdp-admin-root .rdp-head_cell {
              font-size: 0.65rem;
              font-weight: 700;
              text-transform: uppercase;
              color: #9a8a78;
              padding-bottom: 0.5rem;
            }
          `}</style>
          <DayPicker
            locale={es}
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: new Date() }}
            className="rdp-admin-root"
            classNames={{
              root: "mx-auto",
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-between pt-1 relative items-center mb-2",
              caption_label: "text-sm font-semibold text-[#2c2416] font-serif italic",
              nav: "flex items-center gap-1",
              nav_button: "h-7 w-7 bg-white border border-[#e2d9cc] rounded-lg flex items-center justify-center text-[#9a8a78] hover:text-[#6b7c4a] hover:border-[#6b7c4a] transition-all",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell: "text-[#9a8a78] rounded-md w-10 font-bold text-[10px] uppercase",
              row: "flex w-full mt-0",
              cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day: "h-12 w-10 p-0 font-normal aria-selected:opacity-100",
            }}
            components={{
              DayContent: ({ date }) => {
                const { price, isSeasonal } = getPriceForDate(date, seasonalPrices, basePrice);
                const formatted = price >= 1000 
                  ? new Intl.NumberFormat('es-CL').format(Math.floor(price / 1000)) + 'k'
                  : price;
                
                return (
                  <div className="flex flex-col items-center justify-center w-full h-full pt-1.5">
                    <span className="text-[10px] font-medium leading-none">{date.getDate()}</span>
                    {price > 0 && (
                      <span className={`text-[7px] mt-1 leading-none font-bold tracking-tighter ${isSeasonal ? 'text-amber-600' : 'text-gray-400'}`}>
                        ${formatted}
                      </span>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8a78] ml-1">
              Motivo del bloqueo (Opcional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Mantenimiento, Limpieza, Uso personal..."
              className="w-full bg-[#faf7f2] border border-[#e2d9cc] rounded-xl px-4 py-3 text-sm text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none"
            />
          </div>

          <button
            onClick={handleBlock}
            disabled={loading || !range?.from || !range?.to}
            className="w-full py-4 bg-[#6b7c4a] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#5a6a3d] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Plus className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Confirmar Bloqueo
          </button>
        </div>
      </div>

      {/* Right: List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2 px-2">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78]">Bloqueos Activos</h4>
          <span className="text-[10px] font-bold text-[#6b7c4a] bg-[#6b7c4a]/10 px-2 py-0.5 rounded-full">
            {blocks.length} registros
          </span>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {fetching ? (
            <div className="py-12 text-center text-[#9a8a78]">Cargando...</div>
          ) : blocks.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-[#e2d9cc] rounded-2xl py-12 text-center">
              <p className="text-sm text-[#9a8a78] italic">No hay bloqueos manuales activos</p>
            </div>
          ) : (
            blocks.map((block) => (
              <div
                key={block.id}
                className="group bg-white border border-[#e2d9cc]/50 rounded-2xl p-4 hover:border-[#6b7c4a]/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#faf7f2] rounded-xl flex items-center justify-center text-[#9a8a78] group-hover:text-[#6b7c4a] transition-colors">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2c2416]">
                        {new Date(block.start_date).toLocaleDateString("es-CL", { day: 'numeric', month: 'short' })} — {new Date(block.end_date).toLocaleDateString("es-CL", { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-[10px] text-[#9a8a78] font-medium">{block.reason}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(block.id)}
                    className="p-2 text-[#9a8a78] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 leading-relaxed">
            <strong>Nota:</strong> Los bloqueos manuales deshabilitan las fechas inmediatamente para los huéspedes. Las reservas confirmadas se bloquean automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
}
