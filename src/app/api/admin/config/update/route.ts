import { NextResponse } from 'next/server';
import { validateConfigValue } from '@/lib/configSchema';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    // 1. Centralized Security Check (Middleware handles initial filtering, this is the deep check)
    const auth = await verifyAdminRequest(req);
    
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { client } = auth;
    const body = await req.json();
    const { key, value, p_updated_by_hint, force = false } = body;

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

  } catch (err) {
    console.error('[ConfigUpdateAPI] Fatal Error:', err);
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor', 
      details: errorMsg 
    }, { status: 500 });
  }
}
