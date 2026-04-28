import { format, parseISO, isFriday, isSaturday, isSunday, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { supabaseService } from './supabaseServer';
import { getPropertyBaseConfig } from './systemConfigServer';

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
 * Checks if a date is a holiday based on a provided set of holiday dates (YYYY-MM-DD).
 */
export function isDateHoliday(date: Date, holidaysSet: Set<string>): boolean {
  return holidaysSet.has(format(date, 'yyyy-MM-dd'));
}

/**
 * Checks if a date is part of a long weekend (puente).
 * Sábado: lunes siguiente es feriado O viernes anterior fue feriado.
 * Domingo: lunes siguiente es feriado O viernes anterior fue feriado.
 * Excluir si la fecha misma ya es feriado.
 */
export function isLongWeekend(date: Date, holidaysSet: Set<string>): boolean {
  if (isDateHoliday(date, holidaysSet)) return false;

  const isSat = isSaturday(date);
  const isSun = isSunday(date);

  if (!isSat && !isSun) return false;

  const prevFriday = isSat ? subDays(date, 1) : subDays(date, 2);
  const nextMonday = isSun ? addDays(date, 1) : addDays(date, 2);

  const hasPrevFridayHoliday = isDateHoliday(prevFriday, holidaysSet);
  const hasNextMondayHoliday = isDateHoliday(nextMonday, holidaysSet);

  return hasPrevFridayHoliday || hasNextMondayHoliday;
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
  const date = parseISO(dateStr);
  const formattedDate = format(date, 'yyyy-MM-dd');

  // 1. Fetch data if not provided (Optimization: allow passing cached data for bulk calculations)
  let { seasonalPrices, holidaysSet, basePrice } = cachedData || {};

  if (!seasonalPrices || !holidaysSet || basePrice === undefined) {
    // Fetch everything needed for the month to avoid multiple DB calls
    const start = format(startOfMonth(date), 'yyyy-MM-dd');
    const end = format(endOfMonth(date), 'yyyy-MM-dd');

    const [pricesRes, holidaysRes, propertyRes] = await Promise.all([
      supabaseService
        .from('seasonal_pricing')
        .select('*')
        .lte('start_date', formattedDate)
        .gte('end_date', formattedDate)
        .order('priority', { ascending: false }),
      supabaseService
        .from('holidays')
        .select('date')
        .gte('date', format(subDays(date, 4), 'yyyy-MM-dd'))
        .lte('date', format(addDays(date, 4), 'yyyy-MM-dd')),
      getPropertyBaseConfig(propertyId ? { id: propertyId } : undefined)
    ]);

    seasonalPrices = pricesRes.data || [];
    holidaysSet = new Set(holidaysRes.data?.map(h => h.date) || []);
    basePrice = propertyRes?.base_price ?? 80000;
  }

  // 2. Determine day properties
  const isHoliday = isDateHoliday(date, holidaysSet!);
  const isWeekend = isFriday(date) || isSaturday(date) || isSunday(date);
  const isLongWkd = isLongWeekend(date, holidaysSet!);

  // 3. Find the best matching rule
  // Already ordered by priority DESC in query if not cached, but let's be safe
  const matches = seasonalPrices!.filter(rule => 
    formattedDate >= rule.start_date && formattedDate <= rule.end_date
  ).sort((a, b) => b.priority - a.priority || (new Date(a.end_date).getTime() - new Date(a.start_date).getTime()) - (new Date(b.end_date).getTime() - new Date(b.start_date).getTime()));

  const bestRule = matches[0];

  let price = basePrice;
  let source = 'Base Price';
  let season = 'Standard';
  let rulePriority = -1;

  if (bestRule) {
    const isWkdDay = isFriday(date) || isSaturday(date) || isSunday(date);
    // Use weekend_price if available and it's a weekend, otherwise standard price
    const hasWeekendPrice = bestRule.weekend_price !== null && bestRule.weekend_price !== undefined;
    
    if (isWkdDay && hasWeekendPrice) {
      price = Number(bestRule.weekend_price);
      source = `Seasonal Rule (Weekend): ${bestRule.season_name}`;
    } else {
      price = Number(bestRule.price_per_night);
      source = `Seasonal Rule: ${bestRule.season_name}`;
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
  propertyId?: string
) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const days = eachDayOfInterval({ start, end });
  const nights = days.slice(0, -1);

  // Fetch all necessary data once for the entire range
  const [pricesRes, holidaysRes, propertyRes] = await Promise.all([
    supabaseService
      .from('seasonal_pricing')
      .select('*')
      .lte('start_date', format(end, 'yyyy-MM-dd'))
      .gte('end_date', format(start, 'yyyy-MM-dd')),
    supabaseService
      .from('holidays')
      .select('date')
      .gte('date', format(subDays(start, 4), 'yyyy-MM-dd'))
      .lte('date', format(addDays(end, 4), 'yyyy-MM-dd')),
    getPropertyBaseConfig(propertyId ? { id: propertyId } : undefined)
  ]);

  const seasonalPrices = pricesRes.data || [];
  const holidaysSet = new Set(holidaysRes.data?.map(h => h.date) || []);
  const basePrice = propertyRes?.base_price ?? 80000;

  const breakdown = await Promise.all(nights.map(async (night) => {
    const details = await getPriceForDate(format(night, 'yyyy-MM-dd'), propertyId, {
      seasonalPrices,
      holidaysSet,
      basePrice
    });
    return {
      date: format(night, 'yyyy-MM-dd'),
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
