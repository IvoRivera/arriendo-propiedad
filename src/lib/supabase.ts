import { createClient } from '@/utils/supabase/client';

/**
 * Shared Supabase Client
 * We use the standard browser client to ensure session consistency
 * across the entire administrative dashboard.
 */
export const supabaseAdmin = createClient();
export const supabasePublic = supabaseAdmin;
export const supabase = supabaseAdmin;
