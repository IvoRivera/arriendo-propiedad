import { supabaseService } from './supabaseServer';

/**
 * Shared Admin Authentication Logic
 * Handles whitelist caching and configuration validation.
 */

let cachedAdmins: string[] = [];
let lastFetch = 0;
const CACHE_TTL = 60000; // 1 minute memory cache

export async function getAdminEmails(): Promise<string[]> {
  const now = Date.now();
  
  // Return cached version if still valid
  if (now - lastFetch < CACHE_TTL && cachedAdmins.length > 0) {
    return cachedAdmins;
  }

  try {
    const { data, error } = await supabaseService
      .from('system_config')
      .select('value')
      .eq('key', 'ALLOWED_ADMIN_EMAILS')
      .single();

    if (error || !data) {
      console.error('[AdminAuth] CRITICAL: ALLOWED_ADMIN_EMAILS not configured in system_config table');
      return [];
    }

    // Update cache
    cachedAdmins = data.value.split(',').map((e: string) => e.trim()).filter(Boolean);
    lastFetch = now;
    
    console.log(`[AdminAuth] Whitelist updated. Total admins: ${cachedAdmins.length}`);
    return cachedAdmins;
  } catch (err) {
    console.error('[AdminAuth] Unexpected error fetching admin whitelist:', err);
    return [];
  }
}
