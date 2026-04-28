import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { supabaseService } from '@/lib/supabaseServer';
import { format, eachDayOfInterval } from 'date-fns';
import { isLongWeekend } from '@/lib/pricing-engine';
import { getLiveConfigServer } from '@/lib/systemConfigServer';
import { parseSafeISO, toISODate } from '@/lib/date-utils';
import { CONFIG_KEYS } from '@/lib/constants';
import { parseBasePrice, calculateDynamicPrice } from '@/lib/pricing-utils';
import { PricingUpdateSchema } from '@/types/pricing';

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = PricingUpdateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ 
      error: 'Validation failed', 
      details: validation.error.flatten().fieldErrors 
    }, { status: 400 });
  }

  const { startDate, endDate, targetType, priceMode, value, propertyId, name, priority } = validation.data;

  const start = parseSafeISO(startDate);
  const end = parseSafeISO(endDate);
  
  // Fetch holidays for the range to detect them
  const { data: holidaysData } = await supabaseService
    .from('holidays')
    .select('date')
    .gte('date', toISODate(start))
    .lte('date', toISODate(end));
  
  const holidaysSet = new Set(holidaysData?.map(h => h.date) || []);

  const rulesToInsert: any[] = [];

  const config = await getLiveConfigServer();
  const basePrice = parseBasePrice(config[CONFIG_KEYS.PROPERTY_RENT_VALUE]);

  // Use centralized dynamic price calculator
  const finalPrice = calculateDynamicPrice(basePrice, priceMode, value);
  const finalWeekendPrice = body.weekend_price ? calculateDynamicPrice(basePrice, priceMode, Number(body.weekend_price)) : null;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[BulkApply] Mode: ${priceMode}, Value: ${value}, Base: ${basePrice}, Final: ${finalPrice}`);
  }

  // Logic based on targetType
  if (targetType === 'customRange') {
    rulesToInsert.push({
      property_id: propertyId || null,
      start_date: startDate,
      end_date: endDate,
      season_name: name || 'Ajuste Especial',
      price_per_night: finalPrice,
      weekend_price: finalWeekendPrice,
      priority: priority
    });
  } else if (targetType === 'weekends') {
    rulesToInsert.push({
      property_id: propertyId || null,
      start_date: startDate,
      end_date: endDate,
      season_name: name || 'Ajuste Fines de Semana',
      price_per_night: basePrice, // Required by DB schema NOT NULL constraint
      weekend_price: finalPrice,
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
        price_per_night: finalPrice,
        priority: priority
      });
    });
  } else if (targetType === 'longWeekends') {
    const days = eachDayOfInterval({ start, end });
    let currentRange: string[] = [];
    
    days.forEach(day => {
      if (isLongWeekend(day, holidaysSet)) {
        currentRange.push(toISODate(day));
      } else {
        if (currentRange.length > 0) {
          rulesToInsert.push({
            property_id: propertyId || null,
            start_date: currentRange[0],
            end_date: currentRange[currentRange.length - 1],
            season_name: name || 'Fin de Semana Largo',
            price_per_night: finalPrice,
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
        price_per_night: finalPrice,
        priority: priority
      });
    }
  }

  if (rulesToInsert.length === 0) {
    return NextResponse.json({ 
      success: true, 
      inserted: 0, 
      message: 'No se encontraron fechas que coincidan con los criterios (ej: no hay feriados en el rango)' 
    });
  }

  const { error } = await supabaseService.from('seasonal_pricing').insert(rulesToInsert);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, inserted: rulesToInsert.length });
}
