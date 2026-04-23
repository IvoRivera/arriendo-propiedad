"use client";

import React, { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, Calendar, Phone, LogOut, RefreshCw, Archive, ArchiveRestore, Eye, EyeOff, Filter, User, AlertCircle, Settings, Inbox as InboxIcon } from "lucide-react";
import { SystemConfigPanel } from "@/components/admin/SystemConfigPanel";
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
  const [user, setUser] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [hiddenStatuses, setHiddenStatuses] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [showExceptions, setShowExceptions] = useState(false);
  const [activeView, setActiveView] = useState<'inbox' | 'config'>('inbox');
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
      console.log("[DEBUG AdminPage] Checking auth session...");
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      
      if (!session) {
        console.log("[DEBUG AdminPage] No session found, redirecting to login");
        router.push("/admin/login");
      } else {
        console.log("[DEBUG AdminPage] Session valid for:", session.user.email);
        setUser(session.user);
        // Initialize system config once authenticated
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
    } catch (err: any) {
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

    // Exceptions view: ONLY cancelled
    if (showExceptions) {
      return isCancelled;
    }

    // Standard Inbox / Archive: EXCLUDE cancelled
    if (isCancelled) return false;

    // Archive logic
    if (showArchived && !isArchived) return false;
    if (!showArchived && isArchived) return false;

    // Status logic: multi-select
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(req.status)) return false;

    return true;
  });

  const activeFiltersCount = selectedStatuses.length;

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
              {activeView === 'inbox' ? 'Inbox de Solicitudes' : 'Configuración'}
            </h1>
            <p className="text-[#6b5d4f] text-sm font-light flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6b7c4a] animate-pulse" />
              Sesión activa: {user?.email}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white border border-[#e2d9cc] rounded-2xl p-1 shadow-sm">
            <button 
              onClick={() => setActiveView('inbox')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeView === 'inbox' ? 'bg-[#6b7c4a] text-white shadow-md' : 'text-[#9a8a78] hover:text-[#2c2416]'
              }`}
            >
              <InboxIcon className="w-4 h-4" /> Solicitudes
            </button>
            <button 
              onClick={() => setActiveView('config')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeView === 'config' ? 'bg-[#6b7c4a] text-white shadow-md' : 'text-[#9a8a78] hover:text-[#2c2416]'
              }`}
            >
              <Settings className="w-4 h-4" /> Sistema
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {activeView === 'inbox' && (
              <button
                onClick={fetchRequests}
                className="px-5 py-2.5 bg-white border border-[#e2d9cc] text-[#6b7c4a] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#faf7f2] transition-all flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sincronizar
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white border border-rose-100 text-rose-600 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2 shadow-sm"
            >
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

        {/* Operational Controls / Filters */}
        {activeView === 'inbox' && (
          <div className="flex flex-col gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Multi-status selector */}
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
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${isActive
                          ? 'bg-[#6b7c4a] text-white border-[#6b7c4a] shadow-md'
                          : 'bg-white text-[#6b5d4f] border-[#e2d9cc] hover:border-[#6b7c4a] disabled:opacity-30 disabled:cursor-not-allowed'
                          }`}
                      >
                        {info.label}
                      </button>
                    );
                  })}
                  {activeFiltersCount > 0 && !showExceptions && (
                    <button
                      onClick={() => setSelectedStatuses([])}
                      className="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:underline px-2"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* View Toggle (Inbox vs Archive vs Exceptions) */}
              <div className="flex flex-col gap-3 items-start md:items-end">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8a78]">
                  Vistas Operativas
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setShowArchived(false); setShowExceptions(!showExceptions); }}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border transition-all duration-300 ${showExceptions
                      ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
                      : 'bg-white text-[#6b5d4f] border-[#e2d9cc] hover:border-rose-200'
                      }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Excepciones</span>
                  </button>

                  <button
                    onClick={() => { setShowArchived(!showArchived); setShowExceptions(false); }}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border transition-all duration-300 ${showArchived
                      ? 'bg-[#2c2416] text-white border-[#2c2416] shadow-sm'
                      : 'bg-white text-[#2c2416] border-[#e2d9cc] hover:border-[#2c2416]'
                      }`}
                  >
                    {showArchived ? <Eye className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                    <span className="text-sm font-medium">{showArchived ? "Ver Inbox" : `Archivados (${archivedIds.length})`}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests List or Config Panel */}
        {activeView === 'inbox' ? (
          <div className="space-y-4 animate-in fade-in duration-500">
          {filteredRequests.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-[#e2d9cc] rounded-[32px] py-24 text-center">
              <div className="max-w-xs mx-auto space-y-3">
                <div className="w-16 h-16 bg-[#e2d9cc]/30 rounded-full flex items-center justify-center mx-auto text-[#9a8a78]">
                  {showArchived ? <Archive className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                </div>
                <h3 className="font-serif text-xl text-[#2c2416] italic">No hay solicitudes</h3>
                <p className="text-[#6b5d4f] text-sm font-light">
                  {showArchived
                    ? "Tu archivo está vacío por ahora."
                    : activeFiltersCount > 0
                      ? "No hay coincidencias con los filtros seleccionados."
                      : "Todas las solicitudes han sido gestionadas."}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => setSelectedStatuses([])}
                    className="text-[#6b7c4a] text-xs font-bold uppercase tracking-widest hover:underline pt-4"
                  >
                    Mostrar todo
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const statusInfo = getStatusInfo(req.status);
              const isFinalState = req.status === 'confirmed' || req.status === 'rejected' || req.status === 'cancelled';
              const isArchived = archivedIds.includes(req.id);

              return (
                <div
                  key={req.id}
                  className="group bg-white border border-[#e2d9cc]/50 rounded-[28px] p-6 hover:shadow-xl hover:shadow-[#2c2416]/5 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Status Strip */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${statusInfo.color.split(' ')[0]}`} />

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Main Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-[10px] text-[#9a8a78] font-medium flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Recibida: {formatDateTime(req.created_at)}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#faf7f2] rounded-2xl flex items-center justify-center text-[#6b7c4a] shrink-0 border border-[#e2d9cc]/30">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-serif italic text-[#2c2416]">{req.full_name}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#6b5d4f] text-sm font-light">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#6b7c4a]" />
                              {req.check_in} — {req.check_out}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#6b7c4a]" />
                              {req.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#faf7f2]/50 rounded-2xl p-4 border border-[#e2d9cc]/30">
                        <p className="text-[#6b5d4f] text-sm leading-relaxed font-light italic">
                          "{req.trip_reason}"
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-[#9a8a78] font-bold uppercase tracking-widest">
                          Referido por: <span className="text-[#2c2416]">{req.referred_by || "Sin referencia"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
                      {!isFinalState && (
                        <div className="flex flex-wrap justify-end gap-2">
                          {req.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(req.id, 'pre_approved')}
                              className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-all text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm active:scale-95"
                            >
                              Pre-aprobar
                            </button>
                          )}
                          {req.status === 'pre_approved' && (
                            <button
                              onClick={() => updateStatus(req.id, 'confirmed')}
                              className="px-5 py-2.5 bg-[#6b7c4a] text-white hover:bg-[#5a6a3d] rounded-full transition-all text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm active:scale-95"
                            >
                              Confirmar Pago
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(req.id, 'rejected')}
                            className="px-5 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-full transition-all text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {isFinalState && (
                          <span className="text-[10px] text-[#9a8a78] font-medium italic pr-2 flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3" /> Gestión completa
                          </span>
                        )}

                        {req.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatus(req.id, 'cancelled')}
                            title="Cancelar solicitud (Excepción)"
                            className="p-3 rounded-2xl border border-[#e2d9cc] text-[#9a8a78] hover:text-rose-600 hover:border-rose-200 transition-all"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}

                        <button
                          onClick={() => toggleArchive(req.id)}
                          title={isArchived ? "Mover a Inbox" : "Archivar (Ocultar)"}
                          className={`p-3 rounded-2xl border transition-all duration-300 ${isArchived
                              ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                              : 'bg-white text-[#9a8a78] border-[#e2d9cc] hover:text-[#2c2416] hover:border-[#2c2416]'
                            }`}
                        >
                          {isArchived ? <ArchiveRestore className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SystemConfigPanel />
          </div>
        )}
      </div>
    </div>
  );
}
