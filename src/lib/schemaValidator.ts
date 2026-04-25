import { supabaseService } from './supabaseServer';

/**
 * [SchemaGuard] Core Mapping of Critical Tables and Columns.
 * Verified interactively via information_schema.
 */
export const CRITICAL_SCHEMA = {
  properties: [
    'id', 
    'name', 
    'slug',
    'location_type', 
    'luxury_tier', 
    'base_price'
  ],
  price_overrides: [
    'id', 
    'property_id', 
    'date', 
    'price',
    'reason'
  ],
  images: [
    'id', 
    'url', 
    'property_id', 
    'category', 
    'metadata',
    'storage_path',
    'priority'
  ],
  booking_requests: [
    'id', 
    'property_id', 
    'check_in', 
    'check_out',
    'status',
    'full_name',
    'email',
    'phone',
    'guests_count',
    'risk_score',
    'total_price',
    'trip_reason'
  ],
  blocked_dates: [
    'id',
    'property_id',
    'start_date',
    'end_date'
  ],
  seasonal_pricing: [
    'id', 
    'property_id', 
    'start_date', 
    'end_date', 
    'price_per_night',
    'priority',
    'season_name'
  ]
} as const;

export interface SchemaCheckResult {
  table: string;
  column: string;
  exists: boolean;
}

export interface SchemaValidationReport {
  success: boolean;
  missing: SchemaCheckResult[];
}

/**
 * Validates the existence of critical schema components in runtime.
 * Uses the verify_schema RPC function.
 */
export async function validateSchema(): Promise<SchemaValidationReport> {
  const queries: { t: string; c: string }[] = [];

  // Build the list of checks from CRITICAL_SCHEMA
  for (const [table, columns] of Object.entries(CRITICAL_SCHEMA)) {
    for (const column of columns) {
      queries.push({ t: table, c: column });
    }
  }

  try {
    const { data, error } = await supabaseService.rpc('verify_schema', {
      p_queries: queries
    });

    if (error) {
      console.error('[SchemaGuard] Error calling verify_schema RPC:', error);
      throw new Error(`Schema validation failed: ${error.message}`);
    }

    const results = data as { out_table: string; out_column: string; exists_flag: boolean }[];
    const missing = results
      .filter(r => !r.exists_flag)
      .map(r => ({
        table: r.out_table,
        column: r.out_column,
        exists: false
      }));

    if (missing.length > 0) {
      console.warn('[SchemaGuard] MISSING CRITICAL COLUMNS DETECTED:', missing);
    }

    return {
      success: missing.length === 0,
      missing
    };
  } catch (err) {
    console.error('[SchemaGuard] Unexpected error during validation:', err);
    return {
      success: false,
      missing: [] // Error in the validation itself
    };
  }
}
