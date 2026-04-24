import { supabaseAdmin } from './supabase';

/**
 * System Configuration Module (Shared/Client)
 * Source of truth for UI: Local cache synced with Supabase 'system_config' table.
 */

type ConfigItem = { 
  value: string; 
  updated_at: string; 
  updated_by: string;
  updated_by_email?: string;
};

let configCache: Record<string, ConfigItem> = {};
let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initializes the configuration by fetching all records from Supabase.
 * Uses the standard admin client (subject to RLS if not authenticated).
 */
export async function initConfig(force = false) {
  if (isInitialized && !force) return;
  if (initPromise && !force) return initPromise;
  
  initPromise = (async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('system_config')
        .select('*');

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[SystemConfig] Error fetching config:', error.message);
        }
        initPromise = null;
        return;
      }

      if (data) {
        const freshConfig: Record<string, ConfigItem> = {};
        data.forEach((item: { key: string; value: string; updated_at: string; updated_by: string; updated_by_email?: string }) => {
          freshConfig[item.key] = {
            value: item.value,
            updated_at: item.updated_at,
            updated_by: item.updated_by,
            updated_by_email: item.updated_by_email
          };
        });
        configCache = freshConfig;
        isInitialized = true;
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SystemConfig] Unexpected error:', err);
      }
      initPromise = null;
    }
  })();

  return initPromise;
}

/**
 * Retrieves a single configuration value from cache.
 * Use for UI display and non-critical client logic.
 */
export const getConfigClient = (key: string): string | null => {
  const item = configCache[key];
  if (!item) return null;
  return item.value;
};

/**
 * Legacy alias for getConfigClient to avoid breaking existing imports.
 */
export const getConfig = getConfigClient;

/**
 * Returns audit info for a specific key.
 */
export const getConfigAudit = (key: string) => {
  const item = configCache[key];
  if (!item) return null;
  return {
    updated_at: item.updated_at,
    updated_by: item.updated_by,
    updated_by_email: item.updated_by_email
  };
};

/**
 * Returns all currently loaded configuration records.
 */
export const getAllConfig = (): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in configCache) {
    result[key] = configCache[key].value || '';
  }
  return result;
};

/**
 * Helper to ensure the configuration is loaded before proceeding.
 */
export const ensureConfigLoaded = async (force = false) => {
  if (isInitialized && !force) return true;
  return initConfig(force);
};

/**
 * Manually updates the local cache for a specific key.
 */
export const setLocalConfig = (key: string, value: string) => {
  const existing = configCache[key];
  if (existing) {
    configCache[key] = { ...existing, value };
  } else {
    // If it doesn't exist, we create a partial item
    configCache[key] = { 
      value, 
      updated_at: new Date().toISOString(), 
      updated_by: 'system',
      updated_by_email: 'system'
    };
  }
};

