import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabaseServer';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');

  // Verify admin access
  const auth = await verifyAdminRequest();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let query = supabaseService.from('holidays').select('*').order('date', { ascending: true });

  if (year) {
    query = query.gte('date', `${year}-01-01`).lte('date', `${year}-12-31`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
