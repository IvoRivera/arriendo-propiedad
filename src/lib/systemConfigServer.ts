import 'server-only';
import { supabaseService } from './supabaseServer';
import { Property } from '@/types/property';

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
 * Fetches a specific property configuration.
 * If no ID/Slug provided, returns the first property found.
 */
export async function getPropertyBaseConfig(identifier?: { id?: string; slug?: string }): Promise<Property | null> {
  try {
    let query = supabaseService.from('properties').select('*');

    if (identifier?.id) {
      query = query.eq('id', identifier.id);
    } else if (identifier?.slug) {
      query = query.eq('slug', identifier.slug);
    }

    const { data, error } = await query.single();

    if (error) {
      // Fallback to first property if nothing found and no specific ID was requested
      if (!identifier?.id && !identifier?.slug) {
        const { data: firstData } = await supabaseService.from('properties').select('*').limit(1).single();
        return firstData as Property;
      }
      return null;
    }

    return data as Property;
  } catch (err) {
    console.error('[SystemConfigServer] Error fetching property config:', err);
    return null;
  }
}

/**
 * Validates critical business values.
 * Throws error if validation fails to prevent incorrect business logic execution.
 */
export function validatePropertyRentValue(rawValue: string | number | undefined): number {
  if (rawValue === undefined || rawValue === null) {
    throw new Error('CONFIG_MISSING: Rent value is missing');
  }

  const value = typeof rawValue === 'number' ? rawValue : parseInt(rawValue.replace(/\D/g, ''));
  
  if (isNaN(value)) {
    throw new Error(`CONFIG_INVALID: Rent value is not a number ("${rawValue}")`);
  }

  // Business Rule: Rent value should ideally be >= 80,000 CLP
  if (value < 80000) {
    console.warn(`[SystemConfigServer] WARNING: Rent value (${value}) is below the standard minimum (80,000).`);
  }

  return value;
}
