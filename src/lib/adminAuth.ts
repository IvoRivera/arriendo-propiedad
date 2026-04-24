import { supabaseService, createSessionClient } from './supabaseServer';

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

/**
 * Verifies if a request is authorized for administrative actions.
 * Supports:
 * 1. INTERNAL_SECRET via 'x-internal-key' header
 * 2. User JWT via 'Authorization: Bearer <token>' + Whitelist check
 */
import { SupabaseClient, User } from '@supabase/supabase-js';

type AdminAuthResult = 
  | { success: true; mode: 'SYSTEM'; client: SupabaseClient }
  | { success: true; mode: 'USER'; user: User; client: SupabaseClient }
  | { success: false; error: string; status: number };

export async function verifyAdminRequest(req: Request): Promise<AdminAuthResult> {
  const internalKey = req.headers.get('x-internal-key');
  const authHeader = req.headers.get('authorization');
  const systemSecret = process.env.INTERNAL_SECRET;

  // Mode A: SYSTEM (Auth by internal key)
  if (systemSecret && internalKey === systemSecret) {
    return { success: true, mode: 'SYSTEM', client: supabaseService };
  }

  // Mode B: USER (Auth by JWT + Whitelist)
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const sessionClient = createSessionClient(token);
    
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Sesión inválida', status: 401 };
    }

    const adminEmails = await getAdminEmails();
    if (!adminEmails.includes(user.email || '')) {
      console.warn(`[Security] Unauthorized access attempt: ${user.email}`);
      return { success: false, error: 'No tienes permisos de administrador', status: 403 };
    }

    return { success: true, mode: 'USER', user, client: sessionClient };
  }

  return { success: false, error: 'Autenticación requerida', status: 401 };
}
