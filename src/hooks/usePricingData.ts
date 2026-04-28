"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { SeasonalPricing } from "@/types/pricing";
import { parseBasePrice } from "@/lib/pricing-utils";
import { CONFIG_KEYS } from "@/lib/constants";

export function usePricingData() {
  const [basePrice, setBasePrice] = useState(80000);
  const [seasonalPrices, setSeasonalPrices] = useState<SeasonalPricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [configRes, pricesRes] = await Promise.all([
        supabaseAdmin.from('system_config').select('key, value'),
        supabaseAdmin
          .from('seasonal_pricing')
          .select('*')
          .order('start_date', { ascending: true })
      ]);

      if (configRes.data) {
        const rentValue = configRes.data.find(c => c.key === CONFIG_KEYS.PROPERTY_RENT_VALUE)?.value;
        setBasePrice(parseBasePrice(rentValue));
      }

      if (pricesRes.data) {
        setSeasonalPrices(pricesRes.data as SeasonalPricing[]);
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
    isLoading,
    isSaving,
    setIsSaving,
    fetchData,
    setSeasonalPrices
  };
}
