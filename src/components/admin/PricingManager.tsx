"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseAdmin } from "@/lib/supabase";
import { SeasonalPricing } from "@/types/pricing";
import { usePricingData } from "@/hooks/usePricingData";
import { TrendingUp } from "lucide-react";
import { BasePriceDisplay } from "./BasePriceDisplay";
import { SeasonTable } from "./SeasonTable";
import { RuleForm } from "./RuleForm";
import { PricingCalendar } from "./PricingCalendar";

import { PricingHeader } from "./PricingHeader";
import { PricingSidebar } from "./PricingSidebar";

type SidebarMode = 'create' | 'edit' | 'idle';
type ActiveTab = 'calendar' | 'rules' | 'history';

export function PricingManager() {
  const {
    basePrice,
    seasonalPrices,
    holidays,
    isLoading,
    isSaving,
    setIsSaving,
    fetchData
  } = usePricingData();

  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('idle');
  const [showHolidays, setShowHolidays] = useState(true);
  const [pendingAction, setPendingAction] = useState<{ 
    type: 'date' | 'range', 
    start: string, 
    end?: string 
  } | null>(null);
  const [sidebarData, setSidebarData] = useState<any>({
    season_name: "",
    start_date: "",
    end_date: "",
    price_per_night: "",
    weekend_price: "",
    priority: 0,
    color_hex: "#D9C2A3"
  });

  const handleAddRule = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabaseAdmin.from('seasonal_pricing').insert({
        season_name: sidebarData.season_name,
        start_date: sidebarData.start_date,
        end_date: sidebarData.end_date,
        price_per_night: Number(sidebarData.price_per_night),
        weekend_price: sidebarData.weekend_price ? Number(sidebarData.weekend_price) : null,
        priority: sidebarData.priority,
        color_hex: sidebarData.color_hex
      });

      if (error) throw error;
      
      setSidebarMode('idle');
      await fetchData();
    } catch (error) {
      console.error('Error adding rule:', error);
      alert('Error al agregar la regla');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRule = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabaseAdmin
        .from('seasonal_pricing')
        .update({
          season_name: sidebarData.season_name,
          start_date: sidebarData.start_date,
          end_date: sidebarData.end_date,
          price_per_night: Number(sidebarData.price_per_night),
          weekend_price: sidebarData.weekend_price ? Number(sidebarData.weekend_price) : null,
          priority: sidebarData.priority,
          color_hex: sidebarData.color_hex
        })
        .eq('id', sidebarData.id);

      if (error) throw error;
      setSidebarMode('idle');
      await fetchData();
    } catch (error) {
      console.error('Error updating rule:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta regla?')) return;
    try {
      const { error } = await supabaseAdmin.from('seasonal_pricing').delete().eq('id', id);
      if (error) throw error;
      setSidebarMode('idle');
      await fetchData();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const calculateNextPriority = (start: string, end: string) => {
    const overlapping = seasonalPrices.filter(
      r => r.start_date <= end && r.end_date >= start
    );
    if (overlapping.length === 0) return 1;
    return Math.max(...overlapping.map(r => r.priority)) + 1;
  };

  const handleDateSelect = (date: string) => {
    setPendingAction({ type: 'date', start: date });
  };

  const handleRangeSelect = (start: string, end: string) => {
    setPendingAction({ type: 'range', start, end });
  };

  const confirmPendingAction = () => {
    if (!pendingAction) return;

    const { start, end, type } = pendingAction;
    const finalEnd = type === 'date' ? start : end!;

    setSidebarData({
      season_name: "",
      start_date: start,
      end_date: finalEnd,
      price_per_night: basePrice.toString(),
      weekend_price: "",
      priority: calculateNextPriority(start, finalEnd),
      color_hex: "#D9C2A3"
    });
    setSidebarMode('create');
    setPendingAction(null);
  };


  const handleQuickAction = (action: string) => {
    const year = new Date().getFullYear();
    let start = "";
    let end = "";
    let name = "";

    switch (action) {
      case 'jan':
        start = `${year}-01-01`;
        end = `${year}-01-31`;
        name = `Enero ${year}`;
        break;
      case 'feb':
        start = `${year}-02-01`;
        end = `${year}-02-28`;
        name = `Febrero ${year}`;
        break;
      case 'winter':
        start = `${year}-07-01`;
        end = `${year}-07-31`;
        name = `Vacaciones Invierno ${year}`;
        break;
      case 'easter':
        // Simplified: next easter or fixed for current year if known
        start = `${year}-04-17`;
        end = `${year}-04-20`;
        name = `Semana Santa ${year}`;
        break;
      case 'holidays':
        // This could be more complex, but for now just open sidebar in a "Bulk" mode or something
        alert("Esta acción aplicará precios especiales a todos los feriados del año.");
        return;
    }

    if (start) {
      setSidebarData({
        season_name: name,
        start_date: start,
        end_date: end,
        price_per_night: (basePrice * 1.5).toString(),
        weekend_price: (basePrice * 1.8).toString(),
        priority: 50,
        color_hex: "#E09A3E" // Alta
      });
      setSidebarMode('create');
    }
  };

  const handleEditStart = (rule: SeasonalPricing) => {
    setSidebarData({
      ...rule,
      price_per_night: rule.price_per_night.toString(),
      weekend_price: rule.weekend_price?.toString() || ""
    });
    setSidebarMode('edit');
  };

  const handleSidebarCancel = () => {
    setSidebarMode('idle');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Find next holiday for header
  const today = new Date().toISOString().split('T')[0];
  const nextHoliday = holidays
    .filter(h => h.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <div className="max-w-[1600px] mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      {/* 1. Dynamic Header */}
      <PricingHeader 
        basePrice={basePrice} 
        activeRulesCount={seasonalPrices.length}
        nextHoliday={nextHoliday}
        onQuickAction={handleQuickAction}
      />

      {/* 2. Main Workspace */}
      <div className="min-h-[800px]">
        {/* Full Width Column */}
        <div className="space-y-8">
          
          {/* View Tabs & Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 p-1.5 bg-sand-light border border-sand-dark rounded-2xl w-fit">
            {[
              { id: 'calendar', label: 'Calendario' },
              { id: 'rules', label: 'Reglas Activas' },
              { id: 'history', label: 'Historial' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`
                  px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all
                  ${activeTab === tab.id 
                    ? 'bg-white text-primary-navy shadow-sm border border-sand-dark' 
                    : 'text-primary-navy/40 hover:text-primary-navy/60'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feriados Toggle Only */}
          {activeTab === 'calendar' && (
            <div className="flex items-center gap-4 px-2">
              <button 
                onClick={() => setShowHolidays(!showHolidays)}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${showHolidays ? 'text-primary-navy' : 'text-primary-navy/30'}`}
              >
                <div className={`w-8 h-4 rounded-full relative transition-colors ${showHolidays ? 'bg-primary-navy' : 'bg-sand-dark'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${showHolidays ? 'right-0.5' : 'left-0.5'}`} />
                </div>
                Feriados
              </button>
            </div>
          )}
        </div>

          <div className="bg-white rounded-[24px] md:rounded-[32px] border border-sand-dark shadow-sm overflow-hidden min-h-[500px] md:min-h-[600px]">
            {activeTab === 'calendar' ? (
              <div className="p-2 md:p-8">
                <PricingCalendar 
                  seasonalPrices={seasonalPrices} 
                  holidays={holidays} 
                  basePrice={basePrice} 
                  onDateSelect={handleDateSelect}
                  onRangeSelect={handleRangeSelect}
                  showHolidays={showHolidays}
                />
              </div>
            ) : activeTab === 'rules' ? (
              <div className="p-2">
                <SeasonTable 
                  seasonalPrices={seasonalPrices}
                  editingId={sidebarMode === 'edit' ? sidebarData.id : null}
                  editForm={sidebarData}
                  isSaving={isSaving}
                  onEditStart={handleEditStart}
                  onEditCancel={() => setSidebarMode('idle')}
                  onUpdateRule={handleUpdateRule}
                  onDeleteRule={handleDeleteRule}
                  setEditForm={setSidebarData}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-primary/20">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <p className="text-primary/40 font-serif italic">El historial de cambios estará disponible próximamente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Editor (Modal Mode) */}
        <AnimatePresence>
          {sidebarMode !== 'idle' && (
            <motion.div 
              key="pricing-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md overflow-y-auto py-6 sm:py-12 px-4 sm:px-6"
            >
              {/* Backdrop */}
              <div 
                className="fixed inset-0 cursor-default"
                onClick={handleSidebarCancel}
              />
              
              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-[#faf7f2] rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col z-10 my-auto"
              >
                <PricingSidebar 
                  mode={sidebarMode}
                  data={sidebarData}
                  setData={setSidebarData}
                  onSave={sidebarMode === 'edit' ? handleUpdateRule : handleAddRule}
                  onDelete={handleDeleteRule}
                  onCancel={handleSidebarCancel}
                  isSaving={isSaving}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selection Confirmation Prompt */}
      <AnimatePresence>
        {pendingAction && (
          <motion.div 
            key="selection-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            {/* Click backdrop to cancel */}
            <div className="fixed inset-0" onClick={() => setPendingAction(null)} />
            
            <motion.div 
              key="selection-confirm-prompt"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-primary-navy/95 text-white p-8 rounded-[40px] shadow-2xl border border-white/10 backdrop-blur-xl flex flex-col gap-6"
            >
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-warm-gold/80">Selección Detectada</p>
                <p className="text-xl font-serif italic text-sand-light/90 leading-tight">
                  ¿Deseas agregar una regla en la {pendingAction?.type === 'date' ? 'fecha seleccionada' : 'rango seleccionado'}?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={confirmPendingAction}
                  className="flex-1 py-4 bg-warm-gold text-primary-navy rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg"
                >
                  Confirmar y Editar
                </button>
                <button 
                  onClick={() => setPendingAction(null)}
                  className="flex-1 py-4 bg-white/5 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all border border-white/10"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
