import { getPricingForRange, PricingDetails } from './pricing-engine';
import { validateSchema } from './schemaValidator';

export interface PriceBreakdownItem extends PricingDetails {
  date: string;
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
  return calculateBookingPrice(params.checkIn, params.checkOut, params.propertyId);
}

/**
 * Calculates the total price for a booking range.
 */
export async function calculateBookingPrice(
  startDate: string, 
  endDate: string, 
  propertyId?: string,
  _preFetchedProperty?: any // Ignored in new implementation but kept for signature compatibility
): Promise<PricingResult> {
  // [SchemaGuard] Early Integrity Check
  const schema = await validateSchema();
  if (!schema.success) {
    const missing = schema.missing.map(m => `${m.table}.${m.column}`).join(', ');
    throw new Error(`[SchemaGuard] [PricingAPI] Inconsistencia detectada en base de datos. Faltan columnas: ${missing}`);
  }

  const result = await getPricingForRange(startDate, endDate, propertyId);

  return {
    totalPrice: result.totalPrice,
    breakdown: result.breakdown.map(item => ({
      ...item,
      seasonName: item.season, // Map 'season' to 'seasonName' for backward compatibility
      priority: item.rulePriority
    })),
    nightsCount: result.nightsCount,
    nightlyPrice: result.nightlyPrice
  };
}

