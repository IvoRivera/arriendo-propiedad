"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { SeasonalPricing } from "@/types/pricing";
import { parseBasePrice } from "@/lib/pricing-utils";
import { CONFIG_KEYS } from "@/lib/constants";

export function usePricingData() {
  const [basePrice, setBasePrice] = useState(80000);
  const [seasonalPrices, setSeasonalPrices] = useState<SeasonalPricing[]>([]);
  const [holidays, setHolidays] = useState<{date: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [configRes, pricesRes, holidaysRes] = await Promise.all([
        supabaseAdmin.from('system_config').select('key, value'),
        supabaseAdmin
          .from('seasonal_pricing')
          .select('*')
          .order('start_date', { ascending: true }),
        supabaseAdmin
          .from('holidays')
          .select('date, name')
          .order('date', { ascending: true })
      ]);

      if (configRes.data) {
        const rentValue = configRes.data.find(c => c.key === CONFIG_KEYS.PROPERTY_RENT_VALUE)?.value;
        setBasePrice(parseBasePrice(rentValue));
      }

      if (pricesRes.data) {
        setSeasonalPrices(pricesRes.data as SeasonalPricing[]);
      }

      if (holidaysRes.data) {
        setHolidays(holidaysRes.data);
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    basePrice,
    seasonalPrices,
    holidays,
    isLoading,
    isSaving,
    setIsSaving,
    fetchData,
    setSeasonalPrices
  };
}
