import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente público para booking_requests (sin persistencia de sesión)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Cliente de administración para autenticación y gestión (basado en sesión)
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'coastal-admin-session'
  }
});

// Export por defecto para evitar romper archivos fuera del alcance de esta refactorización
export const supabase = supabaseAdmin;
