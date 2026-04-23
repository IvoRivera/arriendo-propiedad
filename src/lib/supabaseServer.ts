import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log("SERVICE ROLE:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Check your environment variables.');
}

/**
 * Supabase Service Client
 * - Bypasses RLS (Row Level Security)
 * - Use ONLY in API routes and Server Components
 * - Never expose to the client
 */
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

/**
 * Creates a Supabase client bound to a user session.
 * Used to relay user identity (auth.uid()) to the database.
 */
export function createSessionClient(token: string) {
  return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}
