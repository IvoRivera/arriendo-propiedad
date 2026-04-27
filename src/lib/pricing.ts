import { supabaseService } from './supabaseServer';
import { getPropertyBaseConfig, validatePropertyRentValue } from './systemConfigServer';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

import { validateSchema } from './schemaValidator';

export interface PriceBreakdownItem {
  date: string;
  price: number;
  seasonName: string;
  priority: number;
}

export interface PricingResult {
  totalPrice: number;
  breakdown: PriceBreakdownItem[];
  nightsCount: number;
  nightlyPrice: number;
}

/**
 * Main pricing function (Alias for backward compatibility and simplified usage)
 */
export async function getPricing(params: {
  checkIn: string;
  checkOut: string;
  guests?: number;
  propertyId?: string;
  property?: any; // Allow passing pre-fetched property
}): Promise<PricingResult> {
  const result = await calculateBookingPrice(params.checkIn, params.checkOut, params.propertyId, params.property);
  return result;
}

/**
 * Calculates the total price for a booking range.
 */
export async function calculateBookingPrice(
  startDate: string, 
  endDate: string, 
  propertyId?: string,
  preFetchedProperty?: any
): Promise<PricingResult> {
  // [SchemaGuard] Early Integrity Check
  const schema = await validateSchema();
  if (!schema.success) {
    const missing = schema.missing.map(m => `${m.table}.${m.column}`).join(', ');
    throw new Error(`[SchemaGuard] [PricingAPI] Inconsistencia detectada en base de datos. Faltan columnas: ${missing}`);
  }

  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  let days: Date[] = [];
  try {
    days = eachDayOfInterval({ start, end });
  } catch (err) {
    console.error('[Pricing] Invalid date interval:', { startDate, endDate });
    return { totalPrice: 0, breakdown: [], nightsCount: 0, nightlyPrice: 0 };
  }
  
  const nights = days.slice(0, -1);
  if (nights.length === 0) return { totalPrice: 0, breakdown: [], nightsCount: 0, nightlyPrice: 0 };

  // 1. Fetch property base price or use pre-fetched
  const property = preFetchedProperty || await getPropertyBaseConfig(propertyId ? { id: propertyId } : undefined);
  const basePrice = validatePropertyRentValue(property?.base_price ?? 80000);

  // 2. Fetch seasonal prices for the range
  let seasonalQuery = supabaseService
    .from('seasonal_pricing')
    .select('*')
    .lte('start_date', format(end, 'yyyy-MM-dd'))
    .gte('end_date', format(start, 'yyyy-MM-dd'));
  
  if (property?.id) {
    // Fetch rules for this property OR global rules (property_id is null)
    seasonalQuery = seasonalQuery.or(`property_id.eq.${property.id},property_id.is.null`);
  } else {
    seasonalQuery = seasonalQuery.is('property_id', null);
  }

  const { data: seasonalPrices } = await seasonalQuery;

  // 3. Fetch manual overrides (Highest Priority Layer)
  const { data: overrides } = await supabaseService
    .from('price_overrides')
    .select('*')
    .eq('property_id', property?.id)
    .gte('date', format(start, 'yyyy-MM-dd'))
    .lte('date', format(end, 'yyyy-MM-dd'));

  let totalPrice = 0;
  const breakdown: PriceBreakdownItem[] = [];

  // 4. Calculate price per night
  for (const night of nights) {
    const nightStr = format(night, 'yyyy-MM-dd');
    
    // 4a. Check Overrides first
    const override = overrides?.find(o => o.date === nightStr);
    if (override) {
      const price = Number(override.price);
      totalPrice += price;
      breakdown.push({
        date: nightStr,
        price,
        seasonName: 'Manual Override',
        priority: 999
      });
      continue;
    }

    // 4b. Find matching seasonal prices
    const matches = (seasonalPrices || [])
      .filter(sp => nightStr >= sp.start_date && nightStr <= sp.end_date)
      .sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        const rangeA = new Date(a.end_date).getTime() - new Date(a.start_date).getTime();
        const rangeB = new Date(b.end_date).getTime() - new Date(b.start_date).getTime();
        return rangeA - rangeB;
      });

    const bestMatch = matches[0];
    const price = bestMatch ? Number(bestMatch.price_per_night) : basePrice;
    
    totalPrice += price;
    breakdown.push({
      date: nightStr,
      price,
      seasonName: bestMatch ? bestMatch.season_name : 'Base',
      priority: bestMatch ? (bestMatch.priority ?? 0) : -1
    });
  }

  return {
    totalPrice,
    breakdown,
    nightsCount: nights.length,
    nightlyPrice: totalPrice / nights.length
  };
}
