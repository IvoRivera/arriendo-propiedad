import { format, isFriday, isSaturday, isSunday } from 'date-fns';

export interface SeasonalPricing {
  id: string;
  start_date: string;
  end_date: string;
  price_per_night: number;
  weekend_price: number | null;
  season_name: string;
  priority: number;
}

export interface Holiday {
  date: string;
  name: string;
  type?: string;
}

export function getPriceForDate(
  date: Date, 
  seasonalPrices: SeasonalPricing[], 
  basePrice: number,
  holidays: Holiday[] = []
): { price: number; isSeasonal: boolean; seasonName?: string; isHoliday: boolean; isWeekend: boolean } {
  // Use noon to avoid timezone shifts during day-of-week checks
  const midDay = new Date(date);
  midDay.setHours(12, 0, 0, 0);
  
  const dateStr = format(midDay, 'yyyy-MM-dd');
  const isHoliday = holidays.some(h => h.date === dateStr);
  const isWeekend = isFriday(midDay) || isSaturday(midDay);
  
  const matches = seasonalPrices
    .filter(sp => dateStr >= sp.start_date && dateStr <= sp.end_date)
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      const rangeA = new Date(a.end_date).getTime() - new Date(a.start_date).getTime();
      const rangeB = new Date(b.end_date).getTime() - new Date(b.start_date).getTime();
      return rangeA - rangeB;
    });

  const bestMatch = matches[0];
  let price = basePrice;
  
  if (bestMatch) {
    if (isWeekend && bestMatch.weekend_price !== null && bestMatch.weekend_price !== undefined) {
      price = Number(bestMatch.weekend_price);
    } else {
      price = Number(bestMatch.price_per_night);
    }
  }

  return {
    price,
    isSeasonal: !!bestMatch,
    seasonName: bestMatch?.season_name,
    isHoliday,
    isWeekend
  };
}
