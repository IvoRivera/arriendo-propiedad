"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, Calendar, Phone, LogOut, RefreshCw } from "lucide-react";

interface BookingRequest {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  trip_reason: string;
  referred_by: string;
  status: 'pending' | 'pre_approved' | 'confirmed' | 'rejected';
}

export default function AdminPage() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user);
        fetchRequests();
      }
    };

    checkUser();
  }, [router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("booking_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setRequests(data || []);
    } catch (err: any) {
      console.error("Error fetching requests:", err);
      setError("No se pudieron cargar las solicitudes. Verifica tus permisos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const updateStatus = async (id: string, newStatus: BookingRequest['status']) => {
    const messages = {
      pre_approved: "¿Pre-aprobar esta solicitud? Se enviarán los datos bancarios al huésped por correo.",
      confirmed: "¿Confirmar pago y cerrar reserva? Se enviará la confirmación final y el link de WhatsApp al huésped.",
      rejected: "¿Rechazar esta solicitud? Se enviará un correo de cortesía informando que no hay disponibilidad.",
      pending: "" // Not used for transitions
    };

    if (!window.confirm(messages[newStatus])) return;

    try {
      const { error: updateError } = await supabase
        .from("booking_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (updateError) throw updateError;
      
      const requestData = requests.find(r => r.id === id);
      if (requestData) {
        try {
          fetch("/api/send-status-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: requestData.full_name,
              email: requestData.email,
              status: newStatus,
              check_in: requestData.check_in,
              check_out: requestData.check_out
            }),
          });
        } catch (emailErr) {
          console.error("Failed to send guest notification email:", emailErr);
        }
      }

      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert("Error al actualizar el estado.");
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'pre_approved': return { label: 'Esperando Pago', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'confirmed': return { label: 'Confirmado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'rejected': return { label: 'Rechazado', color: 'bg-gray-100 text-gray-500 border-gray-200' };
      default: return { label: status, color: 'bg-gray-100 text-gray-700' };
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#6b7c4a]/20 border-t-[#6b7c4a] rounded-full animate-spin" />
        <p className="text-[#6b5d4f] text-sm font-medium">Cargando solicitudes...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-3xl text-[#2c2416] italic mb-1">Panel de Administración</h1>
            <p className="text-[#6b5d4f] text-sm italic">{user?.email}</p>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={fetchRequests}
              className="text-[10px] font-bold uppercase tracking-widest text-[#6b7c4a] hover:text-[#5a6a3d] transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" /> Sincronizar
            </button>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" /> Salir
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm">
            {error}
          </div>
        )}

        {/* Desktop Table */}
        <div className="bg-white border border-[#e2d9cc]/50 rounded-[32px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf7f2]/50 border-b border-[#e2d9cc]/30">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Huésped</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Estadía</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Contacto</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#9a8a78] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2d9cc]/20">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-[#9a8a78] text-sm italic">
                      No hay solicitudes pendientes.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => {
                    const statusInfo = getStatusInfo(req.status);
                    const isFinalState = req.status === 'confirmed' || req.status === 'rejected';

                    return (
                      <tr key={req.id} className="hover:bg-[#faf7f2]/30 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-[#2c2416] font-semibold text-sm">{req.full_name}</span>
                            <span className="text-[#9a8a78] text-[11px] mt-0.5">{req.referred_by || "Sin referencia"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-[#6b5d4f] text-[11px]">
                              <Calendar className="w-3 h-3" />
                              <span>{req.check_in} — {req.check_out}</span>
                            </div>
                            <div className="text-[10px] text-[#9a8a78]">
                              {req.guests_count} huéspedes · {req.trip_reason?.substring(0, 30)}...
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <a href={`tel:${req.phone}`} className="flex items-center gap-1.5 text-[#6b7c4a] text-[11px] hover:underline">
                              <Phone className="w-3 h-3" />
                              {req.phone}
                            </a>
                            <span className="text-[#9a8a78] text-[11px]">{req.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 transition-opacity">
                            {!isFinalState && (
                              <>
                                {req.status === 'pending' && (
                                  <button 
                                    onClick={() => updateStatus(req.id, 'pre_approved')}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    Pre-aprobar y enviar datos de pago
                                  </button>
                                )}
                                {req.status === 'pre_approved' && (
                                  <button 
                                    onClick={() => updateStatus(req.id, 'confirmed')}
                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    Confirmar pago y cerrar reserva
                                  </button>
                                )}
                                <button 
                                  onClick={() => updateStatus(req.id, 'rejected')}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider"
                                >
                                  Rechazar solicitud
                                </button>
                              </>
                            )}
                            {isFinalState && (
                              <span className="text-[10px] text-[#9a8a78] italic">Sin acciones pendientes</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
