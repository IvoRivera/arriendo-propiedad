"use client";

import React, { useState } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { SeasonalPricing } from "@/types/pricing";
import { usePricingData } from "@/hooks/usePricingData";
import { BasePriceDisplay } from "./BasePriceDisplay";
import { SeasonTable } from "./SeasonTable";
import { RuleForm } from "./RuleForm";
import { PricingCalendar } from "./PricingCalendar";

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SeasonalPricing | null>(null);
  const [newRule, setNewRule] = useState({
    start_date: "",
    end_date: "",
    price_per_night: "",
    weekend_price: "",
    season_name: "",
    priority: 0
  });

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabaseAdmin.from('seasonal_pricing').insert({
        season_name: newRule.season_name,
        start_date: newRule.start_date,
        end_date: newRule.end_date,
        price_per_night: Number(newRule.price_per_night),
        weekend_price: newRule.weekend_price ? Number(newRule.weekend_price) : null,
        priority: newRule.priority
      });

      if (error) throw error;
      
      setNewRule({
        start_date: "",
        end_date: "",
        price_per_night: "",
        weekend_price: "",
        season_name: "",
        priority: 0
      });
      await fetchData();
    } catch (error) {
      console.error('Error adding rule:', error);
      alert('Error al agregar la regla');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta regla?')) return;
    try {
      const { error } = await supabaseAdmin.from('seasonal_pricing').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const handleUpdateRule = async () => {
    if (!editForm || !editingId) return;
    setIsSaving(true);
    try {
      const { error } = await supabaseAdmin
        .from('seasonal_pricing')
        .update({
          season_name: editForm.season_name,
          start_date: editForm.start_date,
          end_date: editForm.end_date,
          price_per_night: editForm.price_per_night,
          weekend_price: editForm.weekend_price,
          priority: editForm.priority
        })
        .eq('id', editingId);

      if (error) throw error;
      setEditingId(null);
      setEditForm(null);
      await fetchData();
    } catch (error) {
      console.error('Error updating rule:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#6b7c4a]/20 border-t-[#6b7c4a] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* 1. Base Price Context */}
      <BasePriceDisplay basePrice={basePrice} />

      {/* 2. Visual Calendar View */}
      <div className="mb-12">
        <PricingCalendar 
          seasonalPrices={seasonalPrices} 
          holidays={holidays} 
          basePrice={basePrice} 
        />
      </div>

      {/* 3. Rule Form */}
      <RuleForm 
        newRule={newRule}
        isSaving={isSaving}
        setNewRule={setNewRule}
        onAddRule={handleAddRule}
      />

      {/* 3. Season Table */}
      <div className="space-y-6">
        <h3 className="text-2xl font-serif italic text-[#2c2416] ml-4 text-left">Reglas Activas</h3>
        <SeasonTable 
          seasonalPrices={seasonalPrices}
          editingId={editingId}
          editForm={editForm}
          isSaving={isSaving}
          onEditStart={(rule) => {
            setEditingId(rule.id);
            setEditForm({...rule});
          }}
          onEditCancel={() => {
            setEditingId(null);
            setEditForm(null);
          }}
          onUpdateRule={handleUpdateRule}
          onDeleteRule={handleDeleteRule}
          setEditForm={setEditForm}
        />
      </div>
    </div>
  );
}
