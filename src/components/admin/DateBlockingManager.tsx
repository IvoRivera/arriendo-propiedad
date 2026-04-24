"use client";

import React, { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { Calendar, Trash2, Plus, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

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

        <div className="flex justify-center mb-8 bg-[#faf7f2] rounded-2xl p-4 border border-[#f0e8dc]">
          <DayPicker
            locale={es}
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: new Date() }}
            classNames={{
              root: "rdp-admin-root",
              day_selected: "bg-[#6b7c4a] text-white",
              day_range_middle: "bg-[#6b7c4a]/10 text-[#6b7c4a]",
              day_range_start: "bg-[#6b7c4a] text-white rounded-l-full",
              day_range_end: "bg-[#6b7c4a] text-white rounded-r-full",
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
