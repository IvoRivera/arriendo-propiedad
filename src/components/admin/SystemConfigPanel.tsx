"use client";

import React, { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { setLocalConfig, initConfig } from "@/lib/systemConfig";
import { Save, RefreshCw, Check, AlertCircle, User, CreditCard, DollarSign, Clock, Info } from "lucide-react";

const CONFIG_WHITELIST = [
  { key: 'OWNER_NAME', label: 'Nombre del Propietario', category: 'Identidad del Propietario', icon: <User className="w-4 h-4" />, type: 'text' },
  { key: 'OWNER_EMAIL', label: 'Email del Propietario', category: 'Identidad del Propietario', icon: <User className="w-4 h-4" />, type: 'email' },
  { key: 'OWNER_PHONE', label: 'Teléfono', category: 'Identidad del Propietario', icon: <User className="w-4 h-4" />, type: 'tel' },
  { key: 'OWNER_WHATSAPP_LINK', label: 'Link de WhatsApp', category: 'Identidad del Propietario', icon: <User className="w-4 h-4" />, type: 'url' },
  
  { key: 'OWNER_BANK_NAME', label: 'Nombre del Titular', category: 'Datos Bancarios', icon: <CreditCard className="w-4 h-4" />, type: 'text' },
  { key: 'OWNER_BANK_RUT', label: 'RUT del Titular', category: 'Datos Bancarios', icon: <CreditCard className="w-4 h-4" />, type: 'text' },
  { key: 'OWNER_BANK_NAME_ENTITY', label: 'Banco / Entidad', category: 'Datos Bancarios', icon: <CreditCard className="w-4 h-4" />, type: 'text' },
  { key: 'OWNER_BANK_ACCOUNT_TYPE', label: 'Tipo de Cuenta', category: 'Datos Bancarios', icon: <CreditCard className="w-4 h-4" />, type: 'text' },
  { key: 'OWNER_BANK_ACCOUNT_NUMBER', label: 'Número de Cuenta', category: 'Datos Bancarios', icon: <CreditCard className="w-4 h-4" />, type: 'text' },
  { key: 'OWNER_BANK_EMAIL', label: 'Email para Comprobantes', category: 'Datos Bancarios', icon: <CreditCard className="w-4 h-4" />, type: 'email' },
  
  { key: 'PROPERTY_RENT_VALUE', label: 'Valor del Arriendo (Noche)', category: 'Configuración de Negocio', icon: <DollarSign className="w-4 h-4" />, type: 'currency' },
];

export function SystemConfigPanel() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Historial
  const [openHistoryKey, setOpenHistoryKey] = useState<string | null>(null);
  const [history, setHistory] = useState<Record<string, any[]>>({});
  const [loadingHistory, setLoadingHistory] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session }, error: sessionError } = await supabaseAdmin.auth.getSession();
      
      if (sessionError || !session) {
        setError({ message: "Sesión no válida. Por favor, reingresa.", type: 'error' });
        return;
      }

      await initConfig(true); 
      const { data, error: dbError } = await supabaseAdmin.from("system_config").select("*");
      
      if (dbError) throw dbError;

      const mappedConfig: Record<string, string> = {};
      data?.forEach(item => {
        if (CONFIG_WHITELIST.some(w => w.key === item.key)) {
          mappedConfig[item.key] = item.value;
        }
      });
      
      setConfig(mappedConfig);
      setEditValues(mappedConfig);
    } catch (err) {
      console.error("Error fetching config:", err);
      setError({ message: "No se pudo cargar la configuración.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (key: string) => {
    if (openHistoryKey === key) {
      setOpenHistoryKey(null);
      return;
    }
    try {
      setOpenHistoryKey(key);
      setLoadingHistory(key);
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      const res = await fetch(`/api/admin/config/history?key=${key}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      const result = await res.json();
      if (result.success) {
        setHistory(prev => ({ ...prev, [key]: result.data }));
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(null);
    }
  };

  const formatCurrency = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''));
    if (isNaN(num)) return val;
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(num);
  };

  const handleUpdate = async (key: string) => {
    const value = editValues[key];
    if (value === config[key]) {
      setSuccessMsg("No hay cambios (el valor es el mismo)");
      setTimeout(() => setSuccessMsg(null), 3000);
      return;
    }

    try {
      setSavingKey(key);
      setError(null);
      setSuccessMsg(null);

      const { data: { session } } = await supabaseAdmin.auth.getSession();
      
      const response = await fetch('/api/admin/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          key, 
          value,
          p_updated_by_hint: session?.user?.id 
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al actualizar");
      }

      // Update local cache
      setLocalConfig(key, value);
      setConfig(prev => ({ ...prev, [key]: value }));
      
      if (result.warning) {
        setError({ message: result.warning, type: 'warning' });
      } else {
        setSuccessMsg(result.data.changed ? "Configuración actualizada correctamente" : "Valor verificado (sin cambios)");
      }
      
      // Refresh history if open
      if (openHistoryKey === key) fetchHistory(key);

      setTimeout(() => {
        setSuccessMsg(null);
        setError(null);
      }, 4000);
    } catch (err: any) {
      console.error("Error updating config:", err);
      setError({ message: err.message || `Error al actualizar ${key}`, type: 'error' });
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <RefreshCw className="w-8 h-8 text-[#6b7c4a] animate-spin" />
        <p className="text-[#6b5d4f] text-sm italic">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10 relative">
      {/* Notifications Overlay */}
      {(error || successMsg) && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl border animate-in slide-in-from-top-4 duration-300 max-w-xs ${
          error?.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-600' :
          error?.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-600' :
          'bg-emerald-50 border-emerald-100 text-emerald-600'
        }`}>
          <div className="flex items-start gap-3">
            {error ? <AlertCircle className="w-5 h-5 mt-0.5" /> : <Check className="w-5 h-5 mt-0.5" />}
            <div className="flex-1">
              <p className="text-xs font-bold mb-0.5">{error ? (error.type === 'error' ? 'Error' : 'Aviso') : 'Éxito'}</p>
              <p className="text-[10px] leading-relaxed opacity-90">{error?.message || successMsg}</p>
            </div>
            <button onClick={() => { setError(null); setSuccessMsg(null); }} className="text-[10px] opacity-50 hover:opacity-100">×</button>
          </div>
        </div>
      )}

      {Array.from(new Set(CONFIG_WHITELIST.map(w => w.category))).map(category => (
        <div key={category} className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl text-[#2c2416] italic">{category}</h2>
            <div className="h-px flex-1 bg-[#e2d9cc]/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONFIG_WHITELIST.filter(w => w.category === category).map(item => (
              <div 
                key={item.key}
                className="bg-white border border-[#e2d9cc]/40 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a8a78] flex items-center gap-2">
                      {item.icon} {item.label}
                    </label>
                    <button 
                      onClick={() => fetchHistory(item.key)}
                      className="text-[9px] text-[#6b7c4a] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Clock className="w-3 h-3" /> {openHistoryKey === item.key ? 'Ocultar historial' : 'Ver historial'}
                    </button>
                  </div>

                  {item.type === 'currency' && editValues[item.key] && (
                    <div className="text-[10px] font-bold text-[#6b7c4a] bg-[#6b7c4a]/5 px-3 py-1.5 rounded-lg inline-block animate-in fade-in duration-300">
                      Previsualización: {formatCurrency(editValues[item.key])}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={editValues[item.key] || ""}
                      placeholder={config[item.key] || "Sin valor"}
                      onChange={(e) => setEditValues(prev => ({ ...prev, [item.key]: e.target.value }))}
                      className="flex-1 bg-[#faf7f2] border border-[#e2d9cc] rounded-2xl px-4 py-3 text-sm text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all"
                    />
                    <button 
                      onClick={() => handleUpdate(item.key)}
                      disabled={savingKey === item.key || editValues[item.key] === config[item.key]}
                      className={`p-3 rounded-2xl transition-all ${
                        savingKey === item.key 
                          ? 'bg-gray-100 text-gray-400' 
                          : editValues[item.key] === config[item.key]
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-[#6b7c4a] text-white hover:bg-[#5a6a3d] shadow-sm'
                      }`}
                      title="Guardar cambios"
                    >
                      {savingKey === item.key ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* History Section */}
                  {openHistoryKey === item.key && (
                    <div className="mt-4 pt-4 border-t border-[#e2d9cc]/30 space-y-3 animate-in fade-in slide-in-from-top-2">
                      {loadingHistory === item.key ? (
                        <div className="flex justify-center py-4">
                          <RefreshCw className="w-4 h-4 animate-spin text-[#6b7c4a]" />
                        </div>
                      ) : history[item.key]?.length > 0 ? (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {history[item.key].map((h, i) => (
                            <div key={i} className="text-[9px] bg-[#faf7f2]/50 p-2.5 rounded-xl border border-[#e2d9cc]/20">
                              <div className="flex justify-between text-[#9a8a78] mb-1 font-mono">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {new Date(h.changed_at).toLocaleString('es-CL', { 
                                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                  })}
                                </span>
                                <span className="font-bold flex items-center gap-1">
                                  <Info className="w-2.5 h-2.5" />
                                  {h.changed_by_email === 'system@internal' ? 'Sistema' : h.changed_by_email}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="text-rose-400 line-through truncate max-w-[40%]">{h.old_value || 'null'}</span>
                                <span className="text-[#9a8a78]">→</span>
                                <span className="text-emerald-600 font-bold truncate">{h.new_value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[9px] text-center text-[#9a8a78] italic py-4 bg-[#faf7f2]/30 rounded-xl">
                          No hay cambios registrados aún
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
