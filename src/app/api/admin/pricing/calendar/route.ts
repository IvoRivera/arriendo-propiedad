import { NextResponse } from 'next/server';
import { startOfMonth, endOfMonth, format, parseISO } from 'date-fns';
import { getPricingForRange } from '@/lib/pricing-engine';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); // Expects YYYY-MM
  const propertyId = searchParams.get('propertyId') || undefined;

  // Verify admin access
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!month) {
    return NextResponse.json({ error: 'Month parameter is required' }, { status: 400 });
  }

  const baseDate = parseISO(`${month}-01`);
  const start = format(startOfMonth(baseDate), 'yyyy-MM-dd');
  const end = format(endOfMonth(baseDate), 'yyyy-MM-dd');

  try {
    const pricing = await getPricingForRange(start, end, propertyId, true);
    return NextResponse.json(pricing);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
