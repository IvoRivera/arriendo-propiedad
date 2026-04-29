import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabaseServer';
import { calculateBookingPrice, PricingResult } from '@/lib/pricing';
import { validateSchema } from '@/lib/schemaValidator';
import { isValidStay } from '@/lib/dateUtils';
import { SITE_CONTENT } from '@/config/site-content';
import { supabasePublic } from '@/lib/supabase';
import * as z from 'zod';

const bookingSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  guests_count: z.number(),
  check_in: z.string().optional().nullable(),
  check_out: z.string().optional().nullable(),
  trip_reason: z.string(),
  referred_by: z.string(),
});

export async function POST(req: Request) {
  try {
    // [SchemaGuard] Early Integrity Check
    const schema = await validateSchema();
    if (!schema.success) {
      const missing = schema.missing.map(m => `${m.table}.${m.column}`).join(', ');
      throw new Error(`[SchemaGuard] [BookingsAPI] Inconsistencia detectada. Faltan: ${missing}`);
    }

    const body = await req.json();
    
    // 1. Validation
    const validatedData = bookingSchema.parse(body);
    const isLongStayLead = validatedData.trip_reason.includes("[LONG STAY LEAD]");

    let pricing: PricingResult = { totalPrice: 0, breakdown: [], nightsCount: 0, nightlyPrice: 0 };
    
    // 2. Conditional Logic: Standard Booking vs. Long Stay Lead
    if (!isLongStayLead) {
      if (!validatedData.check_in || !validatedData.check_out) {
        throw new Error("Las fechas de llegada y salida son obligatorias para reservas estándar.");
      }

      // Calculate frozen price
      pricing = await calculateBookingPrice(validatedData.check_in, validatedData.check_out);

      if (!isValidStay(validatedData.check_in, validatedData.check_out)) {
        throw new Error(SITE_CONTENT.availability.labels.minStayWarning);
      }

      // 3. Strict Overlap Detection (Source of Truth)
      const { data: manualBlocks } = await supabaseService
        .from('blocked_dates')
        .select('start_date, end_date');

      const { data: confirmedBookings } = await supabaseService
        .from('booking_requests')
        .select('check_in, check_out')
        .eq('status', 'confirmed');

      const blockedRanges = [
        ...(manualBlocks || []).map(b => ({ from: b.start_date, to: b.end_date })),
        ...(confirmedBookings || []).map(b => ({ from: b.check_in, to: b.check_out }))
      ];

      const start = new Date(`${validatedData.check_in}T12:00:00Z`);
      const end = new Date(`${validatedData.check_out}T12:00:00Z`);
      
      for (const range of blockedRanges) {
        const bStart = new Date(`${range.from}T12:00:00Z`);
        const bEnd = new Date(`${range.to}T12:00:00Z`);
        if (start <= bEnd && end >= bStart) {
          throw new Error("Lo sentimos, algunas de las fechas seleccionadas ya no están disponibles.");
        }
      }
    }

    // 4. Anti-Fiesta Scoring
    const keywords = ["fiesta", "cumpleaños", "carrete", "celebración", "evento", "despedida", "juntada", "party", "reunión"];
    const reasonLower = validatedData.trip_reason.toLowerCase();
    let riskScore = "Bajo";
    
    const hasKeywords = keywords.some(k => reasonLower.includes(k));
    if (hasKeywords) {
      riskScore = "Alto";
    } else if (validatedData.trip_reason.length < 20) {
      riskScore = "Medio";
    }

    // 5. Insert into Supabase
    const { data, error } = await supabaseService
      .from("booking_requests")
      .insert([{
        ...validatedData,
        status: isLongStayLead ? "lead" : "pending", // New status for leads
        risk_score: riskScore,
        rules_accepted: true,
        total_price: pricing.totalPrice,
        price_breakdown: pricing.breakdown
      }])
      .select()
      .single();

    if (error) {
      console.error('[BookingsAPI] Supabase Insertion Error:', error);
      throw new Error('Error al guardar la solicitud en la base de datos');
    }

    // 6. Notify owner
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = req.headers.get('host');
    
    if (host) {
      const internalSecret = process.env.INTERNAL_SECRET;
      fetch(`${protocol}://${host}/api/notify-new-request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-internal-secret': internalSecret || ''
        },
        body: JSON.stringify(data),
      }).catch(err => console.error('[BookingsAPI] Notification trigger failed:', err));
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[BookingsAPI] Error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof z.ZodError ? 'Datos inválidos' : err.message || 'Internal Server Error' },
      { status: 400 }
    );
  }
}
