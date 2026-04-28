import { z } from 'zod';

/**
 * Zod schema for bulk pricing updates.
 */
export const PricingUpdateSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  targetType: z.enum(['customRange', 'weekends', 'holidays', 'longWeekends']),
  priceMode: z.enum(['fixed', 'percentage']),
  value: z.number(),
  weekend_price: z.number().optional().nullable(),
  propertyId: z.string().optional(),
  name: z.string().optional(),
  priority: z.number().default(999),
  color_hex: z.string().optional(),
});

export type PricingUpdate = z.infer<typeof PricingUpdateSchema>;

export interface SeasonalPricing {
  id: string;
  start_date: string;
  end_date: string;
  price_per_night: number;
  weekend_price: number | null;
  season_name: string;
  priority: number;
  property_id?: string;
  color_hex?: string;
}
