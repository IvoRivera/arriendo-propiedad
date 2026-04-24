import { NextResponse } from 'next/server';
import { supabaseService, createSessionClient } from '@/lib/supabaseServer';
import { getAdminEmails } from '@/lib/adminAuth';

/**
 * API Route: Get Configuration History
 * Protected by Admin Whitelist and Internal Key.
 */

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  try {
    const internalKey = req.headers.get('x-internal-key');
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    let isAuthorized = false;
    const systemSecret = process.env.INTERNAL_SECRET;

    // 1. Authorization Logic (Mirroring Update Endpoint)
    if (systemSecret && internalKey === systemSecret) {
      isAuthorized = true;
    } else if (token) {
      const sessionClient = createSessionClient(token);
      const { data: { user }, error: authError } = await sessionClient.auth.getUser();
      
      if (!authError && user) {
        const adminEmails = await getAdminEmails();
        if (adminEmails.includes(user.email || '')) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      console.warn(`[Security] Unauthorized history access attempt from IP: ${ip}`);
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    if (!key) {
      return NextResponse.json({ success: false, error: 'Key required' }, { status: 400 });
    }

    // 2. Fetch History
    const { data, error } = await supabaseService
      .from('system_config_history')
      .select('*')
      .eq('config_key', key)
      .order('changed_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('[ConfigHistoryAPI] Database Error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Error al obtener historial', 
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error('[ConfigHistoryAPI] Fatal Error:', err);
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno', 
      details: errorMsg 
    }, { status: 500 });
  }
}
