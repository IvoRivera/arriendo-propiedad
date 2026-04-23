import 'server-only';
import { supabaseService } from './supabaseServer';

/**
 * Live configuration (Server-side ONLY)
 * Fetches data directly from Supabase bypassing RLS using the Service Role.
 * Use for critical actions like emails, calculations, and business logic validation.
 */
export async function getLiveConfigServer(): Promise<Record<string, string>> {
  try {
    // Restricted access to system_config table ONLY
    const { data, error } = await supabaseService
      .from('system_config')
      .select('key, value');

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SystemConfigServer] Error fetching live config:', error.message);
      }
      return {};
    }

    const config: Record<string, string> = {};
    data?.forEach(item => {
      config[item.key] = item.value;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[SystemConfigServer] Live config fetched successfully');
    }
    
    return config;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SystemConfigServer] Unexpected error:', err);
    }
    return {};
  }
}

/**
 * Validates critical business values.
 * Throws error if validation fails to prevent incorrect business logic execution.
 */
export function validatePropertyRentValue(rawValue: string | undefined): number {
  if (!rawValue) {
    throw new Error('CONFIG_MISSING: PROPERTY_RENT_VALUE is missing');
  }

  const value = parseInt(rawValue.replace(/\D/g, ''));
  
  if (isNaN(value)) {
    throw new Error(`CONFIG_INVALID: PROPERTY_RENT_VALUE is not a number ("${rawValue}")`);
  }

  // Business Rule: Rent value should ideally be >= 80,000 CLP
  // We log a warning but ALLOW execution to avoid hard-blocking legitimate business changes
  if (value < 80000) {
    console.warn(`[SystemConfigServer] WARNING: PROPERTY_RENT_VALUE (${value}) is below the standard minimum (80,000). Proceeding anyway.`);
  }

  return value;
}
