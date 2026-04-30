"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { XCircle, Calendar, LogOut, RefreshCw, Archive, ArchiveRestore, Eye, Filter, User, AlertCircle, Settings, Inbox as InboxIcon, DollarSign, Image as ImageIcon, Menu, X, Check, CheckSquare, Square, Trash2, Mail, Users, Briefcase, Share2, Clock } from "lucide-react";
import { AdminNavigationDrawer } from "@/components/admin/AdminNavigationDrawer";
import { SystemConfigPanel } from "@/components/admin/SystemConfigPanel";
import { DateBlockingManager } from "@/components/admin/DateBlockingManager";
import { PricingManager } from "@/components/admin/PricingManager";
import { ImageManager } from "@/components/admin/ImageManager";
import { initConfig } from "@/lib/systemConfig";

type ActiveView = 'inbox' | 'config' | 'availability' | 'pricing' | 'images';

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
  total_price?: number;
  price_breakdown?: any[];
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
  const [activeView, setActiveView] = useState<ActiveView>('inbox');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

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
      const { data: { session } } = await supabase.auth.getSession();

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
      const { data, error: fetchError } = await supabase
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
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
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
      const { error: updateError } = await supabase
        .from("booking_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (updateError) throw updateError;

      const requestData = requests.find(r => r.id === id);
      if (requestData) {
        try {
          const response = await fetch("/api/send-status-email", {
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

          if (!response.ok) {
            console.error("Failed to send guest notification email");
          }
        } catch (emailErr) {
          console.error("Failed to send guest notification email:", emailErr);
        }
      }

      setRequests(prev => prev.map(req =>
        req.id === id ? { ...req, status: newStatus } : req
      ));

      toast.success(`Solicitud ${newStatus === 'confirmed' ? 'confirmada' : newStatus === 'rejected' ? 'rechazada' : 'actualizada'} con éxito`, {
        style: {
          borderRadius: '32px',
          background: '#2c2416',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        },
        iconTheme: {
          primary: '#6b7c4a',
          secondary: '#fff',
        },
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) return;

    setArchivedIds(prev => {
      const next = [...new Set([...prev, ...selectedIds])];
      localStorage.setItem('coastal_archived_requests', JSON.stringify(next));
      return next;
    });

    toast.success(`${selectedIds.length} solicitudes archivadas`, {
      style: {
        borderRadius: '32px',
        background: '#2c2416',
        color: '#fff',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }
    });

    setSelectedIds([]);
  };

  const handleBulkUnarchive = () => {
    if (selectedIds.length === 0) return;

    setArchivedIds(prev => {
      const next = prev.filter(id => !selectedIds.includes(id));
      localStorage.setItem('coastal_archived_requests', JSON.stringify(next));
      return next;
    });

    toast.success(`${selectedIds.length} solicitudes restauradas`, {
      style: {
        borderRadius: '32px',
        background: '#2c2416',
        color: '#fff',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }
    });

    setSelectedIds([]);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'pre_approved': return { label: 'Esperando Pago', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'confirmed': return { label: 'Confirmado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'rejected': return { label: 'Rechazada', color: 'bg-rose-50 text-rose-600 border-rose-100' };
      case 'cancelled': return { label: 'Cancelada', color: 'bg-gray-100 text-gray-500 border-gray-200' };
      case 'lead': return { label: 'Lead Estadía Larga', color: 'bg-purple-50 text-purple-600 border-purple-100' };
      default: return { label: status, color: 'bg-gray-50 text-gray-600 border-gray-100' };
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
        {/* Navigation Drawer */}
        <AdminNavigationDrawer
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          activeView={activeView}
          setActiveView={setActiveView}
          userEmail={user?.email}
          onLogout={handleLogout}
        />

        {/* Header */}
        <div className="flex items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsNavOpen(true)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-[#e2d9cc]/60 shadow-sm flex items-center justify-center text-[#6b7c4a] hover:bg-[#f5f0e8] transition-all group"
            >
              <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            <div className="space-y-1">
              <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#2c2416] italic leading-tight">
                {activeView === 'inbox' ? 'Inbox de Solicitudes' : activeView === 'config' ? 'Configuración' : activeView === 'availability' ? 'Calendario y Bloqueos' : activeView === 'pricing' ? 'Gestión de Precios' : 'Galería de Imágenes'}
              </h1>
              <p className="hidden md:flex text-[#6b5d4f] text-[10px] font-medium items-center gap-2 uppercase tracking-luxury">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b7c4a] animate-pulse" />
                Santuario Interno · <span className="text-[#2c2416]">{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeView === 'inbox' && (
              <button onClick={fetchRequests} className="w-10 h-10 md:w-auto md:px-5 md:py-2.5 bg-white border border-[#e2d9cc]/60 text-[#6b7c4a] rounded-full flex items-center justify-center gap-2 shadow-sm hover:bg-[#faf7f2] transition-all">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline text-[10px] font-bold uppercase tracking-luxury">Sincronizar</span>
              </button>
            )}
            <button onClick={handleLogout} className="w-10 h-10 md:w-auto md:px-5 md:py-2.5 bg-white border border-rose-100 text-rose-600 rounded-full flex items-center justify-center gap-2 shadow-sm hover:bg-rose-50 transition-all">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-luxury">Salir</span>
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
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78]">
                  <Filter className="w-3 h-3" /> Filtrar por Estado
                </div>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'pre_approved', 'confirmed', 'rejected', 'lead'].map((status) => {
                    const isActive = selectedStatuses.includes(status);
                    const info = getStatusInfo(status);
                    return (
                      <button
                        key={status}
                        disabled={showArchived || showExceptions}
                        onClick={() => toggleStatusFilter(status)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-luxury-sm transition-all duration-300 border ${isActive ? 'bg-[#6b7c4a] text-white border-[#6b7c4a]' : 'bg-white text-[#6b5d4f] border-[#e2d9cc]'}`}
                      >
                        {info.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={() => {
                    if (selectedIds.length === filteredRequests.length && filteredRequests.length > 0) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(filteredRequests.map(r => r.id));
                    }
                  }}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all ${selectedIds.length > 0 ? 'bg-[#6b7c4a] text-white border-[#6b7c4a]' : 'bg-white text-[#6b7c4a] border-[#e2d9cc]'}`}
                >
                  {selectedIds.length === filteredRequests.length && filteredRequests.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  <span className="text-[10px] font-bold uppercase tracking-luxury">
                    {selectedIds.length === filteredRequests.length && filteredRequests.length > 0 ? 'Deseleccionar' : 'Seleccionar Todo'}
                  </span>
                </button>

                <div className="h-6 w-px bg-[#e2d9cc]/40 mx-1" />

                <button
                  onClick={() => { setShowArchived(false); setShowExceptions(!showExceptions); }}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all ${showExceptions ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-[#6b5d4f] border-[#e2d9cc]'}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-luxury">Excepciones</span>
                </button>

                <button
                  onClick={() => { setShowArchived(!showArchived); setShowExceptions(false); }}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all ${showArchived ? 'bg-[#2c2416] text-white border-[#2c2416]' : 'bg-white text-[#2c2416] border-[#e2d9cc]'}`}
                >
                  {showArchived ? <Eye className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                  <span className="text-[10px] font-bold uppercase tracking-luxury">{showArchived ? "Ver Inbox" : `Archivados (${archivedIds.length})`}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 animate-in fade-in duration-500 pb-32">
              {filteredRequests.length === 0 ? (
                <div className="bg-white/50 border border-dashed border-[#e2d9cc] rounded-[32px] py-24 text-center">
                  <p className="text-[#6b5d4f] italic">No hay solicitudes en esta vista.</p>
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const statusInfo = getStatusInfo(req.status);
                  const isFinalState = req.status === 'confirmed' || req.status === 'rejected' || req.status === 'cancelled';
                  const isArchived = archivedIds.includes(req.id);
                  const isSelected = selectedIds.includes(req.id);
                  return (
                    <div
                      key={req.id}
                      className={`group bg-white border rounded-[32px] p-6 hover:shadow-xl hover:shadow-[#1a150e]/5 transition-all relative overflow-hidden ${isSelected ? 'border-[#6b7c4a] ring-1 ring-[#6b7c4a]/30 bg-[#fdfbf7]' : 'border-[#e2d9cc]/40'}`}
                    >
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${statusInfo.color.split(' ')[0]}`} />

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                setSelectedIds(prev =>
                                  prev.includes(req.id)
                                    ? prev.filter(id => id !== req.id)
                                    : [...prev, req.id]
                                );
                              }}
                              className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${isSelected ? 'bg-[#6b7c4a] border-[#6b7c4a] text-white' : 'bg-white border-[#e2d9cc] text-transparent hover:border-[#6b7c4a]'}`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-luxury-sm border ${statusInfo.color}`}>{statusInfo.label}</span>
                              <span className="text-[10px] text-[#9a8a78] font-medium tracking-luxury-sm">{formatDateTime(req.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#faf7f2] rounded-2xl flex items-center justify-center text-[#6b7c4a] border border-[#e2d9cc]/30"><User className="w-6 h-6" /></div>
                            <div>
                              <h3 className="text-2xl font-serif-luxury italic text-[#2c2416] tracking-tight">{req.full_name}</h3>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5">
                                {req.check_in && req.check_out ? (
                                  <p className="text-[#6b5d4f] text-[13px] flex items-center gap-1.5 font-medium tracking-luxury-sm">
                                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                                    {req.check_in} — {req.check_out}
                                  </p>
                                ) : (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#6b7c4a]/10 text-[#6b7c4a] rounded-full text-[9px] font-bold uppercase tracking-luxury-sm border border-[#6b7c4a]/20">
                                    <Clock className="w-3 h-3" />
                                    Postulación Estadía Larga
                                  </div>
                                )}
                                <p className="text-[#6b5d4f] text-[13px] flex items-center gap-1.5 font-medium tracking-luxury-sm">
                                  <Mail className="w-3.5 h-3.5 opacity-70" />
                                  {req.email}
                                </p>
                                <p className="text-[#6b5d4f] text-[13px] font-bold tracking-luxury-sm">| {req.phone}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[#e2d9cc]/30">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] rounded-full border border-[#e2d9cc]/40">
                                  <Users className="w-3.5 h-3.5 text-[#6b7c4a]" />
                                  <span className="text-[10px] font-bold uppercase tracking-luxury-sm text-[#6b5d4f]">{req.guests_count} Huéspedes</span>
                                </div>
                                
                                {req.trip_reason && req.trip_reason.includes('[LONG STAY LEAD]') ? (
                                  <div className="w-full space-y-3 mt-1">
                                    <div className="flex flex-wrap gap-2">
                                      {req.trip_reason.split('\n').filter(line => line.startsWith('- ')).map((line, i) => {
                                        const [label, value] = line.substring(2).split(': ');
                                        const icons: Record<string, any> = {
                                          'Inicio': <Calendar className="w-3 h-3" />,
                                          'Duración': <Clock className="w-3 h-3" />,
                                          'Tipo': <Briefcase className="w-3 h-3" />,
                                          'Presupuesto': <DollarSign className="w-3 h-3" />,
                                          'Flexibilidad': <RefreshCw className="w-3 h-3" />,
                                          'Necesidades': <CheckSquare className="w-3 h-3" />
                                        };

                                        // Try to format as currency if it looks like a large raw number
                                        let displayValue = value;
                                        if (label === 'Presupuesto' || /^\d+$/.test(value.replace(/[\$\.]/g, ''))) {
                                          const numeric = parseInt(value.replace(/[^\d]/g, ''));
                                          if (!isNaN(numeric) && numeric > 1000) {
                                            displayValue = `$${new Intl.NumberFormat('es-CL').format(numeric)}`;
                                            if (value.toLowerCase().includes('/ mes')) displayValue += ' / mes';
                                          }
                                        }

                                        return (
                                          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#e2d9cc]/60 rounded-full shadow-sm">
                                            <span className="text-[#6b7c4a]">{icons[label] || <Check className="w-3 h-3" />}</span>
                                            <span className="text-[9px] font-bold uppercase tracking-luxury-sm text-[#9a8a78]">{label}:</span>
                                            <span className="text-[10px] font-medium text-[#2c2416]">{displayValue}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <div className="bg-white/50 p-4 rounded-2xl border border-dashed border-[#e2d9cc] relative">
                                      <span className="absolute -top-2 left-4 px-2 bg-[#faf7f2] text-[8px] font-bold uppercase tracking-luxury text-[#9a8a78]">Mensaje del Interesado</span>
                                      <p className="text-[#6b5d4f] text-[13px] leading-relaxed italic">
                                        {req.trip_reason.split('- Mensaje: ')[1] || req.trip_reason}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {req.trip_reason && (
                                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] rounded-full border border-[#e2d9cc]/40">
                                        <Briefcase className="w-3.5 h-3.5 text-[#6b7c4a]" />
                                        <span className="text-[10px] font-bold uppercase tracking-luxury-sm text-[#6b5d4f]">{req.trip_reason}</span>
                                      </div>
                                    )}
                                  </>
                                )}

                                {req.referred_by && (
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] rounded-full border border-[#e2d9cc]/40">
                                    <Share2 className="w-3.5 h-3.5 text-[#6b7c4a]" />
                                    <span className="text-[10px] font-bold uppercase tracking-luxury-sm text-[#6b5d4f]">Vía: {req.referred_by}</span>
                                  </div>
                                )}
                              </div>

                              {(req.total_price || req.price_breakdown) && (
                                <div className="mt-4 p-4 bg-[#6b7c4a]/5 rounded-2xl border border-[#6b7c4a]/10">
                                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#6b7c4a]/10">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="w-4 h-4 text-[#6b7c4a]" />
                                      <span className="text-[10px] font-bold uppercase tracking-luxury text-[#2c2416]">Valor Total de Estadía</span>
                                    </div>
                                    <span className="text-lg font-serif-luxury font-bold text-[#2c2416]">
                                      ${new Intl.NumberFormat('es-CL').format(req.total_price || 0)}
                                    </span>
                                  </div>
                                  
                                  {req.price_breakdown && req.price_breakdown.length > 0 && (
                                    <div className="space-y-1.5 mt-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                                      {req.price_breakdown.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between text-[10px]">
                                          <span className="text-[#9a8a78] font-medium">{item.date}</span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-[#6b7c4a] font-bold">${new Intl.NumberFormat('es-CL').format(item.price)}</span>
                                            <span className="text-[8px] text-[#6b5d4f] uppercase tracking-tighter opacity-60">({item.seasonName || item.season})</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!isFinalState && (
                            <div className="flex gap-2">
                              {req.status === 'pending' && <button onClick={() => updateStatus(req.id, 'pre_approved')} className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-luxury shadow-md hover:bg-blue-700 transition-all">Pre-aprobar</button>}
                              {req.status === 'pre_approved' && <button onClick={() => updateStatus(req.id, 'confirmed')} className="px-5 py-2.5 bg-[#6b7c4a] text-white rounded-full text-[10px] font-bold uppercase tracking-luxury shadow-md hover:bg-[#5a6b3f] transition-all">Confirmar</button>}
                              <button onClick={() => updateStatus(req.id, 'rejected')} className="px-5 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-luxury hover:bg-rose-50 transition-all">Rechazar</button>
                            </div>
                          )}
                          <button onClick={() => toggleArchive(req.id)} className={`p-3.5 rounded-full border transition-all ${isArchived ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-white text-[#9a8a78] border-[#e2d9cc]/60 hover:bg-[#faf7f2]'}`}>
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
        {activeView === 'images' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ImageManager />
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && activeView === 'inbox' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
          >
            <div className="bg-[#faf7f2]/90 backdrop-blur-xl border border-[#e2d9cc] shadow-2xl rounded-[32px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 rounded-full bg-[#6b7c4a] text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {selectedIds.length}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-luxury text-[#2c2416]">Solicitudes Seleccionadas</p>
                  <p className="text-[10px] text-[#9a8a78] font-medium tracking-luxury-sm">Acciones en lote disponibles</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIds([])}
                  className="px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78] hover:bg-[#e2d9cc]/30 transition-all"
                >
                  Cancelar
                </button>

                {showArchived ? (
                  <button
                    onClick={handleBulkUnarchive}
                    className="px-6 py-3 bg-[#2c2416] text-white rounded-full text-[10px] font-bold uppercase tracking-luxury flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    <ArchiveRestore className="w-4 h-4" />
                    Restaurar Seleccionados
                  </button>
                ) : (
                  <button
                    onClick={handleBulkArchive}
                    className="px-6 py-3 bg-[#6b7c4a] text-white rounded-full text-[10px] font-bold uppercase tracking-luxury flex items-center gap-2 shadow-lg hover:bg-[#5a6b3f] active:scale-95 transition-all"
                  >
                    <Archive className="w-4 h-4" />
                    Archivar Seleccionados
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
