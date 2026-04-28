import 'server-only';
import { supabaseService } from './supabaseServer';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

/**
 * Shared Admin Authentication Logic
 * Handles whitelist verification from environment variables.
 */

type AdminAuthResult = 
  | { success: true; mode: 'SYSTEM'; client: SupabaseClient }
  | { success: true; mode: 'USER'; user: User; client: SupabaseClient; userEmail: string }
  | { success: false; error: string; status: number };

export async function getAdminEmails(): Promise<string[]> {
  const envEmails = process.env.ALLOWED_ADMIN_EMAILS;
  
  if (!envEmails) {
    console.error('[AdminAuth] CRITICAL: ALLOWED_ADMIN_EMAILS not configured in environment variables');
    return [];
  }

  return envEmails.split(',').map(e => e.trim()).filter(Boolean);
}

/**
 * Verifies if a request is authorized for administrative actions.
 * Supports:
 * 1. INTERNAL_SECRET via 'x-internal-key' header
 * 2. Supabase Session via Cookies (Next.js SSR)
 * 3. User JWT via 'Authorization: Bearer <token>' (Fallback)
 */
export async function verifyAdminRequest(req?: Request): Promise<AdminAuthResult> {
  const internalKey = req?.headers.get('x-internal-key') || req?.headers.get('x-internal-secret');
  const systemSecret = process.env.INTERNAL_SECRET;

  // 1. Check for ALLOWED_ADMIN_EMAILS configuration
  if (!process.env.ALLOWED_ADMIN_EMAILS) {
    return { success: false, error: 'Configuración de seguridad incompleta (ALLOWED_ADMIN_EMAILS)', status: 500 };
  }

  // Mode A: SYSTEM (Auth by internal key)
  if (systemSecret && internalKey === systemSecret) {
    return { success: true, mode: 'SYSTEM', client: supabaseService };
  }

  // Mode B: USER (Auth by Supabase SSR / Cookies)
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (!authError && user) {
    const adminEmails = await getAdminEmails();
    const email = user.email?.toLowerCase() || '';
    
    if (adminEmails.map(e => e.toLowerCase()).includes(email)) {
      return { 
        success: true, 
        mode: 'USER', 
        user, 
        client: supabase,
        userEmail: email
      };
    }
    
    console.warn(`[Security] Unauthorized access attempt: ${email}`);
    return { success: false, error: 'No tienes permisos de administrador', status: 403 };
  }

  return { success: false, error: 'Autenticación requerida o sesión expirada', status: 401 };
}
