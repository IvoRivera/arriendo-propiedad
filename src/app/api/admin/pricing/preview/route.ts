import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { supabaseService } from '@/lib/supabaseServer';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { getPriceForDate } from '@/lib/pricing-engine';

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { startDate, endDate, targetType, priceMode, value, propertyId, name, priority = 999 } = body;

  if (!startDate || !endDate || !targetType || !priceMode || value === undefined) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // 1. Get current prices for the range to calculate percentage adjustments
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const days = eachDayOfInterval({ start, end });
  
  // To avoid too much logic in API, we calculate what the rule would look like
  // If targetType is customRange, it's easy: one rule.
  // If targetType is weekends, we can use one rule for the whole range BUT setting weekend_price specifically.
  // BUT if there are already other rules, it might be tricky.
  
  // The user wants to keep it clean.
  // Recommendation: 
  // - customRange -> 1 rule for the range.
  // - weekends -> 1 rule for the range with weekend_price set, and price_per_night = NULL (or current base).
  // - holidays/longWeekends -> 1 rule per occurrence within the range.

  const rulesToCreate = [];

  if (targetType === 'customRange') {
    rulesToCreate.push({
      property_id: propertyId || null,
      start_date: startDate,
      end_date: endDate,
      season_name: name || 'Ajuste Manual',
      price_per_night: priceMode === 'fixed' ? value : null, // Calculation for percentage would need base price
      priority: priority
    });
  } else if (targetType === 'weekends') {
     rulesToCreate.push({
      property_id: propertyId || null,
      start_date: startDate,
      end_date: endDate,
      season_name: name || 'Recargo Fines de Semana',
      weekend_price: priceMode === 'fixed' ? value : null,
      priority: priority
    });
  }

  // For Preview, we just return the plan.
  // Actually, the UI might want to see the effect on the calendar.
  
  return NextResponse.json({ 
    message: 'Preview generated',
    plannedRules: rulesToCreate
  });
}
