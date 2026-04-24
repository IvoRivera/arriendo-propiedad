import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { client } = auth;
    const { start_date, end_date, reason } = await req.json();

    if (!start_date || !end_date) {
      return NextResponse.json({ success: false, error: 'Fechas requeridas' }, { status: 400 });
    }

    const { data, error } = await client
      .from('blocked_dates')
      .insert([{ start_date, end_date, reason: reason || 'Bloqueo manual' }]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[AdminAPI] Error blocking dates:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { client } = auth;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    const { error } = await client
      .from('blocked_dates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[AdminAPI] Error deleting blocked date:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { client } = auth;
    const { data, error } = await client
      .from('blocked_dates')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[AdminAPI] Error fetching blocked dates:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
