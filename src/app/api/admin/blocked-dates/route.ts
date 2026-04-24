import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { supabaseService } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // Usamos el cliente de servicio para saltar RLS una vez validado el admin
    const { start_date, end_date, reason } = await req.json();

    if (!start_date || !end_date) {
      return NextResponse.json({ success: false, error: 'Fechas requeridas' }, { status: 400 });
    }

    const { data, error } = await supabaseService
      .from('blocked_dates')
      .insert([{ start_date, end_date, reason: reason || 'Bloqueo manual' }]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[AdminAPI] Error blocking dates:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    const { error } = await supabaseService
      .from('blocked_dates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[AdminAPI] Error deleting blocked date:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { data, error } = await supabaseService
      .from('blocked_dates')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[AdminAPI] Error fetching blocked dates:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
