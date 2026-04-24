"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, ClipboardList } from "lucide-react";
import { supabasePublic } from "@/lib/supabase";
import { baseInventory } from "@/data/mockData";

export default function GuestCheckInPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryLog, setInventoryLog] = useState<any>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data, error: fetchError } = await supabasePublic
          .from("inventory_logs")
          .select("*")
          .eq("booking_id", id)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            // Not found - let's simulate or handle it
            setInventoryLog({
              booking_id: id,
              inventory_snapshot: baseInventory,
              accepted_at: null
            });
          } else {
            throw fetchError;
          }
        } else {
          setInventoryLog(data);
          if (data.accepted_at) setIsAccepted(true);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("No pudimos encontrar el registro de inventario para esta estadía.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInventory();
  }, [id]);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const { error: updateError } = await supabasePublic
        .from("inventory_logs")
        .upsert({
          booking_id: id,
          inventory_snapshot: inventoryLog.inventory_snapshot,
          accepted_at: now
        }, { onConflict: 'booking_id' });

      if (updateError) throw updateError;
      setIsAccepted(true);
    } catch (err) {
      console.error("Error accepting inventory:", err);
      alert("Hubo un error al confirmar el inventario. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6b7c4a] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h1 className="text-xl font-serif italic text-[#2c2416] mb-2">Ups, algo salió mal</h1>
        <p className="text-sm text-[#6b5d4f] max-w-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-[#e2d9cc] px-6 py-8 text-center sticky top-0 z-10 shadow-sm">
        <h1 className="font-serif text-2xl italic text-[#2c2416]">Check-in Digital</h1>
        <p className="text-[10px] uppercase tracking-widest text-[#9a8a78] mt-1 font-bold">Edificio Playa Serena</p>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-[32px] border border-[#e2d9cc] p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#6b7c4a]/10 rounded-2xl flex items-center justify-center text-[#6b7c4a]">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2c2416]">Validación de Inventario</h2>
              <p className="text-xs text-[#6b5d4f]">Por favor, verifica que el estado de los ítems coincida.</p>
            </div>
          </div>

          <div className="space-y-6">
            {inventoryLog?.inventory_snapshot.map((item: any, idx: number) => (
              <div key={item.id || idx} className="flex items-start justify-between py-4 border-b border-[#faf7f2] last:border-0">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-[#9a8a78] font-bold">{item.category}</span>
                  <h3 className="text-sm font-medium text-[#2c2416]">{item.name}</h3>
                </div>
                <div className="bg-[#f5f0e8] px-3 py-1 rounded-full border border-[#e2d9cc]">
                  <span className="text-[10px] text-[#6b5d4f] font-medium">{item.condition}</span>
                </div>
              </div>
            ))}
          </div>

          {!isAccepted ? (
            <div className="mt-12 space-y-6">
              <div className="bg-[#6b7c4a]/5 border border-[#6b7c4a]/20 rounded-2xl p-6">
                <div className="flex gap-4">
                  <ShieldCheck className="w-5 h-5 text-[#6b7c4a] shrink-0" />
                  <p className="text-xs text-[#6b5d4f] leading-relaxed">
                    Al confirmar, declaras que has recibido el departamento y sus implementos en las condiciones descritas anteriormente. Este registro protege tanto tu estadía como la propiedad.
                  </p>
                </div>
              </div>

              <button
                onClick={handleAccept}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#6b7c4a] text-white rounded-full font-bold uppercase tracking-[0.25em] text-[12px] hover:bg-[#5a6a3d] transition-all shadow-xl active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirmar Recepción"
                )}
              </button>
            </div>
          ) : (
            <div className="mt-12 py-8 bg-[#6b7c4a]/10 rounded-[32px] border border-[#6b7c4a]/20 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#6b7c4a] shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-xl italic text-[#2c2416]">Inventario Confirmado</h3>
                <p className="text-xs text-[#6b5d4f] mt-1">¡Gracias! Ya puedes disfrutar de tu estadía.</p>
                {inventoryLog.accepted_at && (
                  <p className="text-[9px] text-[#9a8a78] uppercase tracking-widest mt-4 font-bold">
                    Fecha: {new Date(inventoryLog.accepted_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-[9px] text-center text-[#9a8a78] uppercase tracking-widest leading-relaxed">
          * Si encuentras alguna discrepancia mayor,<br />por favor contáctanos de inmediato.
        </p>
      </main>
    </div>
  );
}
