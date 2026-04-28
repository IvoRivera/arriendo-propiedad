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
  const [showSidebar, setShowSidebar] = useState(true);
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
      setShowSidebar(false);
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
      setShowSidebar(false);
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
      setShowSidebar(false);
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
    setSidebarData({
      season_name: "",
      start_date: date,
      end_date: date,
      price_per_night: basePrice.toString(),
      weekend_price: "",
      priority: calculateNextPriority(date, date),
      color_hex: "#D9C2A3"
    });
    setSidebarMode('create');
    setShowSidebar(true);
  };

  const handleRangeSelect = (start: string, end: string) => {
    setSidebarData({
      season_name: "",
      start_date: start,
      end_date: end,
      price_per_night: basePrice.toString(),
      weekend_price: "",
      priority: calculateNextPriority(start, end),
      color_hex: "#D9C2A3"
    });
    setSidebarMode('create');
    setShowSidebar(true);
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
    setShowSidebar(true);
  };

  const handleSidebarCancel = () => {
    setSidebarMode('idle');
    setShowSidebar(false);
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

      {/* 2. Main Workspace (2 Columns) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[800px]">
        {/* Left Column: Viewport (Dynamic Width) */}
        <div className={`space-y-8 transition-all duration-500 ${showSidebar ? 'lg:w-[70%]' : 'w-full'}`}>
          
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

          {/* Sidebar Toggles (Only in Calendar Tab) */}
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
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${showSidebar ? 'text-primary-navy' : 'text-primary-navy/30'}`}
              >
                <div className={`w-8 h-4 rounded-full relative transition-colors ${showSidebar ? 'bg-primary-navy' : 'bg-sand-dark'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${showSidebar ? 'right-0.5' : 'left-0.5'}`} />
                </div>
                Editor
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

        {/* Right Column: Sidebar Editor (Conditional) */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-primary-navy/40 backdrop-blur-[20px] overflow-y-auto lg:sticky lg:z-0 lg:flex lg:items-start lg:justify-start lg:p-0 lg:bg-transparent lg:backdrop-blur-none lg:w-[30%] lg:top-8 lg:h-fit lg:min-h-[700px]"
            >
              {/* Backdrop (Mobile only) */}
              <div 
                className="fixed inset-0 lg:hidden cursor-pointer"
                onClick={() => setShowSidebar(false)}
              />
              
              {/* Modal/Sidebar Content */}
              <div className="relative w-full max-w-2xl lg:max-w-none h-auto bg-white rounded-[12px] lg:rounded-[12px] shadow-2xl lg:shadow-none border border-sand-dark/15 overflow-hidden flex flex-col z-10 my-8 lg:my-0">
                <PricingSidebar 
                  mode={sidebarMode}
                  data={sidebarData}
                  setData={setSidebarData}
                  onSave={sidebarMode === 'edit' ? handleUpdateRule : handleAddRule}
                  onDelete={handleDeleteRule}
                  onCancel={handleSidebarCancel}
                  isSaving={isSaving}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
