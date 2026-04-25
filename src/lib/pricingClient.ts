import { format } from 'date-fns';

export interface SeasonalPricing {
  id: string;
  start_date: string;
  end_date: string;
  price_per_night: number;
  season_name: string;
  priority: number;
}

export function getPriceForDate(
  date: Date, 
  seasonalPrices: SeasonalPricing[], 
  basePrice: number
): { price: number; isSeasonal: boolean; seasonName?: string } {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const matches = seasonalPrices
    .filter(sp => dateStr >= sp.start_date && dateStr <= sp.end_date)
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      const rangeA = new Date(a.end_date).getTime() - new Date(a.start_date).getTime();
      const rangeB = new Date(b.end_date).getTime() - new Date(b.start_date).getTime();
      return rangeA - rangeB;
    });

  const bestMatch = matches[0];
  return {
    price: bestMatch ? Number(bestMatch.price_per_night) : basePrice,
    isSeasonal: !!bestMatch,
    seasonName: bestMatch?.season_name
  };
}
