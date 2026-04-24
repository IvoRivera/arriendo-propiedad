import { supabaseService } from './supabaseServer';
import { getLiveConfigServer, validatePropertyRentValue } from './systemConfigServer';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

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
}

/**
 * Calculates the total price for a booking range.
 * Logic:
 * 1. Fetch base price from system_config (PROPERTY_RENT_VALUE).
 * 2. Fetch seasonal prices from seasonal_pricing table for the given range.
 * 3. For each night:
 *    - Find all seasonal prices that overlap with this night.
 *    - Apply the one with highest priority.
 *    - If priorities are equal, apply the one with the shortest range (most specific).
 *    - If no seasonal price matches, use the base price.
 */
export async function calculateBookingPrice(startDate: string, endDate: string): Promise<PricingResult> {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  // Get nights (dates between start and end, excluding the end date)
  // For a 1-night stay (e.g., 2024-01-01 to 2024-01-02), we calculate for 2024-01-01.
  let days: Date[] = [];
  try {
    days = eachDayOfInterval({ start, end });
  } catch (err) {
    console.error('[Pricing] Invalid date interval:', { startDate, endDate });
    return { totalPrice: 0, breakdown: [], nightsCount: 0 };
  }
  
  const nights = days.slice(0, -1); // Remove the last day (check-out day)

  if (nights.length === 0) {
    return { totalPrice: 0, breakdown: [], nightsCount: 0 };
  }

  // 1. Fetch base price
  const config = await getLiveConfigServer();
  let basePrice = 80000; // Default fallback
  try {
    basePrice = validatePropertyRentValue(config['PROPERTY_RENT_VALUE']);
  } catch (err) {
    console.warn('[Pricing] Could not fetch base price, using default:', err);
  }

  // 2. Fetch seasonal prices for the range
  // We query for anything that overlaps the interval [start, end]
  const { data: seasonalPrices, error } = await supabaseService
    .from('seasonal_pricing')
    .select('*')
    .lte('start_date', format(end, 'yyyy-MM-dd'))
    .gte('end_date', format(start, 'yyyy-MM-dd'));

  if (error) {
    console.error('[Pricing] Error fetching seasonal pricing:', error.message);
  }

  let totalPrice = 0;
  const breakdown: PriceBreakdownItem[] = [];

  // 3. Calculate price per night
  for (const night of nights) {
    const nightStr = format(night, 'yyyy-MM-dd');
    
    // Find matching seasonal prices for this night
    const matches = (seasonalPrices || [])
      .filter(sp => nightStr >= sp.start_date && nightStr <= sp.end_date)
      .sort((a, b) => {
        // Priority first (descending)
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        // Specificity tie-breaker (shortest range wins)
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
    nightsCount: nights.length
  };
}
