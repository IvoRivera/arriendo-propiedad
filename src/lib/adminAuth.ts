import 'server-only';
import { supabaseService, createSessionClient } from './supabaseServer';
import { SupabaseClient, User } from '@supabase/supabase-js';

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
 * 2. User JWT via 'Authorization: Bearer <token>' + Whitelist check
 */
export async function verifyAdminRequest(req: Request): Promise<AdminAuthResult> {
  const internalKey = req.headers.get('x-internal-key') || req.headers.get('x-internal-secret');
  const authHeader = req.headers.get('authorization');
  const systemSecret = process.env.INTERNAL_SECRET;

  // 1. Check for ALLOWED_ADMIN_EMAILS configuration
  if (!process.env.ALLOWED_ADMIN_EMAILS) {
    return { success: false, error: 'Configuración de seguridad incompleta (ALLOWED_ADMIN_EMAILS)', status: 500 };
  }

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

    return { 
      success: true, 
      mode: 'USER', 
      user, 
      client: sessionClient,
      userEmail: user.email || ''
    };
  }

  return { success: false, error: 'Autenticación requerida', status: 401 };
}
