import { format, isFriday, isSaturday, isSunday, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { supabaseService } from './supabaseServer';
import { getPropertyBaseConfig, getLiveConfigServer } from './systemConfigServer';
import { parseSafeISO, toISODate, isDateHoliday, isLongWeekend } from './date-utils';
import { CONFIG_KEYS } from './constants';
import { parseBasePrice } from './pricing-utils';

export interface PricingDetails {
  price: number;
  source: string;
  season: string;
  isHoliday: boolean;
  isWeekend: boolean;
  isLongWeekend: boolean;
  rulePriority: number;
}

/**
 * Core Pricing Engine: Calculates the price for a specific date and property.
 */
export async function getPriceForDate(
  dateStr: string,
  propertyId?: string,
  cachedData?: {
    seasonalPrices?: any[];
    holidaysSet?: Set<string>;
    basePrice?: number;
  }
): Promise<PricingDetails> {
  const date = parseSafeISO(dateStr);
  const formattedDate = dateStr.split('T')[0];

  // 1. Fetch data if not provided (Optimization: allow passing cached data for bulk calculations)
  let { seasonalPrices, holidaysSet, basePrice } = cachedData || {};

  if (!seasonalPrices || !holidaysSet || basePrice === undefined) {
    // Fetch everything needed for the month to avoid multiple DB calls
    const start = toISODate(startOfMonth(date));
    const end = toISODate(endOfMonth(date));

    const [pricesRes, holidaysRes, propertyRes, config] = await Promise.all([
      supabaseService
        .from('seasonal_pricing')
        .select('*')
        .lte('start_date', formattedDate)
        .gte('end_date', formattedDate)
        .order('priority', { ascending: false }),
      supabaseService
        .from('holidays')
        .select('date')
        .gte('date', toISODate(subDays(date, 4)))
        .lte('date', toISODate(addDays(date, 4))),
      getPropertyBaseConfig(propertyId ? { id: propertyId } : undefined),
      getLiveConfigServer()
    ]);

    seasonalPrices = pricesRes.data || [];
    holidaysSet = new Set(holidaysRes.data?.map(h => h.date) || []);

    // Prioritize system_config PROPERTY_RENT_VALUE over property table base_price
    basePrice = parseBasePrice(config[CONFIG_KEYS.PROPERTY_RENT_VALUE]) || (propertyRes?.base_price ?? undefined);
  }

  // 2. Determine day properties
  const isHoliday = isDateHoliday(date, holidaysSet!);
  const isWeekend = isFriday(date) || isSaturday(date);
  const isLongWkd = isLongWeekend(date, holidaysSet!);

  // 3. Find the best matching rule
  // Priority order: 
  // 1. Higher priority value
  // 2. More specific range (shorter duration)
  // 3. Most recently created
  const matches = seasonalPrices!.filter(rule => {
    const ruleStart = typeof rule.start_date === 'string' ? rule.start_date : toISODate(rule.start_date);
    const ruleEnd = typeof rule.end_date === 'string' ? rule.end_date : toISODate(rule.end_date);
    return formattedDate >= ruleStart && formattedDate <= ruleEnd;
  }).sort((a, b) => {
    // 1. Priority (DESC)
    if (b.priority !== a.priority) return b.priority - a.priority;

    // 2. Specificity (ASC duration)
    const durA = new Date(a.end_date).getTime() - new Date(a.start_date).getTime();
    const durB = new Date(b.end_date).getTime() - new Date(b.start_date).getTime();
    if (durA !== durB) return durA - durB;

    // 3. Recency (DESC ID/Created)
    return b.id.localeCompare(a.id);
  });

  const bestRule = matches[0];

  if (process.env.NODE_ENV === 'development' && !cachedData) {
    console.log(`[PricingEngine] Date: ${formattedDate}, Matches: ${matches.length}, Best Rule: ${bestRule?.season_name || 'None'}`);
  }

  let price = Number(basePrice);
  let source = 'Precio Base (Configuración)';
  let season = 'Estándar';
  let rulePriority = -1;

  if (bestRule) {
    const isWkdDay = isFriday(date) || isSaturday(date);
    const standardPrice = Number(bestRule.price_per_night);
    const weekendPrice = bestRule.weekend_price !== null ? Number(bestRule.weekend_price) : standardPrice;

    if (isWkdDay) {
      price = weekendPrice;
      source = `Regla Temporal (Fin de Semana): ${bestRule.season_name}`;
    } else {
      price = standardPrice;
      source = `Regla Temporal: ${bestRule.season_name}`;
    }

    season = bestRule.season_name;
    rulePriority = bestRule.priority;
  }

  return {
    price,
    source,
    season,
    isHoliday,
    isWeekend,
    isLongWeekend: isLongWkd,
    rulePriority
  };
}

/**
 * Calculates pricing for a range of dates.
 */
export async function getPricingForRange(
  startDate: string,
  endDate: string,
  propertyId?: string,
  includeLastDay: boolean = false
) {
  const start = parseSafeISO(startDate);
  const end = parseSafeISO(endDate);
  const days = eachDayOfInterval({ start, end });
  const nights = includeLastDay ? days : days.slice(0, -1);

  // Fetch all necessary data once for the entire range
  const [pricesRes, holidaysRes, propertyRes, config] = await Promise.all([
    supabaseService
      .from('seasonal_pricing')
      .select('*')
      .lte('start_date', format(end, 'yyyy-MM-dd'))
      .gte('end_date', format(start, 'yyyy-MM-dd')),
    supabaseService
      .from('holidays')
      .select('date')
      .gte('date', toISODate(subDays(start, 4)))
      .lte('date', toISODate(addDays(end, 4))),
    getPropertyBaseConfig(propertyId ? { id: propertyId } : undefined),
    getLiveConfigServer()
  ]);

  const seasonalPrices = pricesRes.data || [];
  const holidaysSet = new Set(holidaysRes.data?.map(h => h.date) || []);

  // Prioritize system_config PROPERTY_RENT_VALUE over property table base_price
  const basePrice = parseBasePrice(config[CONFIG_KEYS.PROPERTY_RENT_VALUE]) || (propertyRes?.base_price ?? undefined);

  const breakdown = await Promise.all(nights.map(async (night) => {
    const details = await getPriceForDate(format(night, 'yyyy-MM-dd'), propertyId, {
      seasonalPrices,
      holidaysSet,
      basePrice
    });
    return {
      date: toISODate(night),
      ...details
    };
  }));

  const totalPrice = breakdown.reduce((sum, item) => sum + item.price, 0);

  return {
    totalPrice,
    breakdown,
    nightsCount: nights.length,
    nightlyPrice: nights.length > 0 ? totalPrice / nights.length : 0
  };
}
