import { NextResponse } from 'next/server';
import { createSessionClient, supabaseService } from '@/lib/supabaseServer';
import { validateConfigValue } from '@/lib/configSchema';
import { getAdminEmails } from '@/lib/adminAuth';

// Rate limiting básico en memoria
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    record.count = 1;
    record.lastReset = now;
    rateLimitMap.set(ip, record);
    return false;
  }
  record.count++;
  rateLimitMap.set(ip, record);
  return record.count > MAX_REQUESTS;
}

export async function POST(req: Request) {
  // Parsing robusto de IP (TODO: En producción usar middleware de Edge como Cloudflare/Upstash)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  
  console.log(`[ConfigUpdateAPI] Request received from ${ip}`);

  try {
    if (checkRateLimit(ip)) {
      console.warn(`[Security] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ success: false, error: 'Demasiadas peticiones' }, { status: 429 });
    }

    const body = await req.json();
    const { key, value, p_updated_by_hint, force = false } = body;

    const internalKey = req.headers.get('x-internal-key');
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    let client;
    const systemSecret = process.env.INTERNAL_SECRET;

    // A. Validación de Modo SYSTEM
    if (systemSecret && internalKey === systemSecret) {
      console.log('[ConfigUpdateAPI] Mode: SYSTEM (Auth by internal key)');
      client = supabaseService;
    } 
    // B. Validación de Modo USER
    else if (token) {
      const sessionClient = createSessionClient(token);
      const { data: { user }, error: authError } = await sessionClient.auth.getUser();
      
      if (authError || !user) {
        console.warn(`[Security] Invalid token attempt from IP: ${ip}`);
        return NextResponse.json({ success: false, error: 'Sesión inválida' }, { status: 401 });
      }

      // Obtener Whitelist desde DB vía módulo compartido
      const adminEmails = await getAdminEmails();

      if (!adminEmails.includes(user.email || '')) {
        console.warn(`[Security] Unauthorized access attempt: ${user.email} (IP: ${ip})`);
        return NextResponse.json({ success: false, error: 'No tienes permisos de administrador' }, { status: 403 });
      }

      console.log(`[ConfigUpdateAPI] Mode: USER (Auth: ${user.email})`);
      client = sessionClient;
    } 
    else {
      console.warn(`[Security] No credentials provided from IP: ${ip}`);
      if (!systemSecret) console.error('[Security] CRITICAL: INTERNAL_SECRET is not configured');
      return NextResponse.json({ success: false, error: 'Autenticación requerida' }, { status: 401 });
    }

    // 3. Validación de Configuración
    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
    }

    const validation = validateConfigValue(key, value, { force });
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    // 4. Ejecución
    const { data, error } = await client.rpc('update_system_config_v4', {
      p_key: key,
      p_value: value,
      p_updated_by_hint: p_updated_by_hint || null
    });

    if (error) {
      console.error('[ConfigUpdateAPI] Database Error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Error de base de datos', 
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, warning: validation.warning });

  } catch (err: any) {
    console.error('[ConfigUpdateAPI] Fatal Error:', err);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor', 
      details: err.message 
    }, { status: 500 });
  }
}
