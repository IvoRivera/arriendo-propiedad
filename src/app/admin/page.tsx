"use client";

import React, { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { XCircle, Calendar, LogOut, RefreshCw, Archive, ArchiveRestore, Eye, Filter, User, AlertCircle, Settings, Inbox as InboxIcon, DollarSign } from "lucide-react";
import { SystemConfigPanel } from "@/components/admin/SystemConfigPanel";
import { DateBlockingManager } from "@/components/admin/DateBlockingManager";
import { PricingManager } from "@/components/admin/PricingManager";
import { initConfig } from "@/lib/systemConfig";

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
  status: 'pending' | 'pre_approved' | 'confirmed' | 'rejected' | 'cancelled';
}

export default function AdminPage() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [showExceptions, setShowExceptions] = useState(false);
  const [activeView, setActiveView] = useState<'inbox' | 'config' | 'availability' | 'pricing'>('inbox');
  const router = useRouter();

  // Load archived IDs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('coastal_archived_requests');
    if (saved) {
      try {
        setArchivedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading archived IDs", e);
      }
    }
  }, []);

  // Save archived IDs to localStorage
  useEffect(() => {
    localStorage.setItem('coastal_archived_requests', JSON.stringify(archivedIds));
  }, [archivedIds]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user);
        initConfig();
        fetchRequests();
      }
    };

    checkUser();
  }, [router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabaseAdmin
        .from("booking_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("No se pudieron cargar las solicitudes. Verifica tus permisos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabaseAdmin.auth.signOut();
    router.push("/admin/login");
  };

  const updateStatus = async (id: string, newStatus: BookingRequest['status']) => {
    const messages = {
      pre_approved: "¿Pre-aprobar esta solicitud? Se enviarán los datos bancarios al huésped por correo.",
      confirmed: "¿Confirmar pago y cerrar reserva? Se enviará la confirmación final y el link de WhatsApp al huésped.",
      rejected: "¿Rechazar esta solicitud? Se enviará un correo de cortesía informando que no hay disponibilidad.",
      pending: "",
      cancelled: "¿Marcar esta solicitud como cancelada?"
    };

    if (!window.confirm(messages[newStatus])) return;

    try {
      const { error: updateError } = await supabaseAdmin
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
    } catch (err) {
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
      case 'cancelled': return { label: 'Cancelado', color: 'bg-rose-100 text-rose-700 border-rose-200' };
      default: return { label: status, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleArchive = (id: string) => {
    setArchivedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredRequests = requests.filter(req => {
    const isArchived = archivedIds.includes(req.id);
    const isCancelled = req.status === 'cancelled';

    if (showExceptions) return isCancelled;
    if (isCancelled) return false;
    if (showArchived && !isArchived) return false;
    if (!showArchived && isArchived) return false;
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(req.status)) return false;

    return true;
  });

  if (loading) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#6b7c4a]/20 border-t-[#6b7c4a] rounded-full animate-spin" />
        <p className="text-[#6b5d4f] text-sm font-medium">Cargando solicitudes...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] p-4 sm:p-8 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-[#2c2416] italic leading-none">
              {activeView === 'inbox' ? 'Inbox de Solicitudes' : activeView === 'config' ? 'Configuración' : activeView === 'availability' ? 'Calendario y Bloqueos' : 'Gestión de Precios'}
            </h1>
            <p className="text-[#6b5d4f] text-sm font-light flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6b7c4a] animate-pulse" />
              Sesión activa: {user?.email}
            </p>
          </div>

          <div className="flex bg-white border border-[#e2d9cc] rounded-2xl p-1 shadow-sm overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveView('inbox')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeView === 'inbox' ? 'bg-[#6b7c4a] text-white shadow-md' : 'text-[#9a8a78] hover:text-[#2c2416]'}`}>
              <InboxIcon className="w-4 h-4" /> Solicitudes
            </button>
            <button onClick={() => setActiveView('availability')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeView === 'availability' ? 'bg-[#6b7c4a] text-white shadow-md' : 'text-[#9a8a78] hover:text-[#2c2416]'}`}>
              <Calendar className="w-4 h-4" /> Disponibilidad
            </button>
            <button onClick={() => setActiveView('config')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeView === 'config' ? 'bg-[#6b7c4a] text-white shadow-md' : 'text-[#9a8a78] hover:text-[#2c2416]'}`}>
              <Settings className="w-4 h-4" /> Sistema
            </button>
            <button onClick={() => setActiveView('pricing')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeView === 'pricing' ? 'bg-[#6b7c4a] text-white shadow-md' : 'text-[#9a8a78] hover:text-[#2c2416]'}`}>
              <DollarSign className="w-4 h-4" /> Precios
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {activeView === 'inbox' && (
              <button onClick={fetchRequests} className="px-5 py-2.5 bg-white border border-[#e2d9cc] text-[#6b7c4a] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#faf7f2] transition-all flex items-center gap-2 shadow-sm">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sincronizar
              </button>
            )}
            <button onClick={handleLogout} className="px-5 py-2.5 bg-white border border-rose-100 text-rose-600 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2 shadow-sm">
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-2xl mb-10 text-sm flex items-center gap-3">
            <XCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {activeView === 'inbox' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78]">
                  <Filter className="w-3 h-3" /> Filtrar por Estado
                </div>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'pre_approved', 'confirmed', 'rejected'].map((status) => {
                    const isActive = selectedStatuses.includes(status);
                    const info = getStatusInfo(status);
                    return (
                      <button
                        key={status}
                        disabled={showArchived || showExceptions}
                        onClick={() => toggleStatusFilter(status)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${isActive ? 'bg-[#6b7c4a] text-white border-[#6b7c4a]' : 'bg-white text-[#6b5d4f] border-[#e2d9cc]'}`}
                      >
                        {info.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { setShowArchived(false); setShowExceptions(!showExceptions); }}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border transition-all ${showExceptions ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-[#6b5d4f] border-[#e2d9cc]'}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Excepciones</span>
                </button>

                <button
                  onClick={() => { setShowArchived(!showArchived); setShowExceptions(false); }}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border transition-all ${showArchived ? 'bg-[#2c2416] text-white' : 'bg-white text-[#2c2416] border-[#e2d9cc]'}`}
                >
                  {showArchived ? <Eye className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                  <span className="text-sm font-medium">{showArchived ? "Ver Inbox" : `Archivados (${archivedIds.length})`}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 animate-in fade-in duration-500">
              {filteredRequests.length === 0 ? (
                <div className="bg-white/50 border border-dashed border-[#e2d9cc] rounded-[32px] py-24 text-center">
                  <p className="text-[#6b5d4f] italic">No hay solicitudes en esta vista.</p>
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const statusInfo = getStatusInfo(req.status);
                  const isFinalState = req.status === 'confirmed' || req.status === 'rejected' || req.status === 'cancelled';
                  const isArchived = archivedIds.includes(req.id);
                  return (
                    <div key={req.id} className="group bg-white border border-[#e2d9cc]/50 rounded-[28px] p-6 hover:shadow-lg transition-all relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full ${statusInfo.color.split(' ')[0]}`} />
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusInfo.color}`}>{statusInfo.label}</span>
                            <span className="text-[10px] text-[#9a8a78]">{formatDateTime(req.created_at)}</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#faf7f2] rounded-2xl flex items-center justify-center text-[#6b7c4a] border border-[#e2d9cc]/30"><User className="w-6 h-6" /></div>
                            <div>
                              <h3 className="text-xl font-serif italic text-[#2c2416]">{req.full_name}</h3>
                              <p className="text-[#6b5d4f] text-sm">{req.check_in} — {req.check_out} | {req.phone}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!isFinalState && (
                            <div className="flex gap-2">
                              {req.status === 'pending' && <button onClick={() => updateStatus(req.id, 'pre_approved')} className="px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Pre-aprobar</button>}
                              {req.status === 'pre_approved' && <button onClick={() => updateStatus(req.id, 'confirmed')} className="px-4 py-2 bg-[#6b7c4a] text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Confirmar</button>}
                              <button onClick={() => updateStatus(req.id, 'rejected')} className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Rechazar</button>
                            </div>
                          )}
                          <button onClick={() => toggleArchive(req.id)} className={`p-3 rounded-2xl border transition-all ${isArchived ? 'bg-rose-50 text-rose-600' : 'bg-white text-[#9a8a78] border-[#e2d9cc]'}`}>
                            {isArchived ? <ArchiveRestore className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {activeView === 'config' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SystemConfigPanel />
          </div>
        )}

        {activeView === 'availability' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DateBlockingManager />
          </div>
        )}

        {activeView === 'pricing' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PricingManager />
          </div>
        )}
      </div>
    </div>
  );
}
