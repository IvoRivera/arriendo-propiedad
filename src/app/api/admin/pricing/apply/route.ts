import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { supabaseService } from '@/lib/supabaseServer';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { getPriceForDate, isDateHoliday, isLongWeekend } from '@/lib/pricing-engine';

export async function POST(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { startDate, endDate, targetType, priceMode, value, propertyId, name, priority = 999 } = body;

  if (!startDate || !endDate || !targetType || !priceMode || value === undefined) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  // Fetch holidays for the range to detect them
  const { data: holidaysData } = await supabaseService
    .from('holidays')
    .select('date')
    .gte('date', format(start, 'yyyy-MM-dd'))
    .lte('date', format(end, 'yyyy-MM-dd'));
  
  const holidaysSet = new Set(holidaysData?.map(h => h.date) || []);

  const rulesToInsert: any[] = [];

  const calculatePrice = (base: number) => {
    if (priceMode === 'fixed') return value;
    return base * (1 + value / 100);
  };

  // Logic based on targetType
  if (targetType === 'customRange') {
    rulesToInsert.push({
      property_id: propertyId || null,
      start_date: startDate,
      end_date: endDate,
      season_name: name || 'Ajuste Especial',
      price_per_night: value,
      weekend_price: body.weekend_price || null,
      priority: priority
    });
  } else if (targetType === 'weekends') {
    rulesToInsert.push({
      property_id: propertyId || null,
      start_date: startDate,
      end_date: endDate,
      season_name: name || 'Ajuste Fines de Semana',
      weekend_price: value,
      priority: priority
    });
  } else if (targetType === 'holidays') {
    // One rule for each holiday found in range
    holidaysSet.forEach(hDate => {
      rulesToInsert.push({
        property_id: propertyId || null,
        start_date: hDate,
        end_date: hDate,
        season_name: name || 'Feriado',
        price_per_night: value,
        priority: priority
      });
    });
  } else if (targetType === 'longWeekends') {
    const days = eachDayOfInterval({ start, end });
    let currentRange: string[] = [];
    
    days.forEach(day => {
      if (isLongWeekend(day, holidaysSet)) {
        currentRange.push(format(day, 'yyyy-MM-dd'));
      } else {
        if (currentRange.length > 0) {
          rulesToInsert.push({
            property_id: propertyId || null,
            start_date: currentRange[0],
            end_date: currentRange[currentRange.length - 1],
            season_name: name || 'Fin de Semana Largo',
            price_per_night: value,
            priority: priority
          });
          currentRange = [];
        }
      }
    });
    if (currentRange.length > 0) {
      rulesToInsert.push({
        property_id: propertyId || null,
        start_date: currentRange[0],
        end_date: currentRange[currentRange.length - 1],
        season_name: name || 'Fin de Semana Largo',
        price_per_night: value,
        priority: priority
      });
    }
  }

  if (rulesToInsert.length === 0) {
    return NextResponse.json({ message: 'No dates matched criteria' });
  }

  const { error } = await supabaseService.from('seasonal_pricing').insert(rulesToInsert);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, inserted: rulesToInsert.length });
}
