import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabaseServer';
import { calculateBookingPrice } from '@/lib/pricing';
import * as z from 'zod';

const bookingSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  guests_count: z.number(),
  check_in: z.string(),
  check_out: z.string(),
  trip_reason: z.string(),
  referred_by: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validation
    const validatedData = bookingSchema.parse(body);

    // 2. Calculate frozen price
    // This fetches seasonal prices and the base price from system_config
    const pricing = await calculateBookingPrice(validatedData.check_in, validatedData.check_out);

    if (pricing.nightsCount <= 0) {
      throw new Error('La fecha de salida debe ser posterior a la de llegada');
    }

    // 3. Anti-Fiesta Scoring (Scoring Logic - moved from frontend for integrity)
    const keywords = ["fiesta", "cumpleaños", "carrete", "celebración", "evento", "despedida", "juntada", "party", "reunión"];
    const reasonLower = validatedData.trip_reason.toLowerCase();
    let riskScore = "Bajo";
    
    const hasKeywords = keywords.some(k => reasonLower.includes(k));
    if (hasKeywords) {
      riskScore = "Alto";
    } else if (validatedData.trip_reason.length < 20) {
      riskScore = "Medio";
    }

    // 4. Insert into Supabase
    const { data, error } = await supabaseService
      .from("booking_requests")
      .insert([{
        ...validatedData,
        status: "pending",
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

    // 5. Notify owner (Async - trigger and continue)
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = req.headers.get('host');
    
    // We pass the full data so the notification route can use the snapshotted price
    if (host) {
      fetch(`${protocol}://${host}/api/notify-new-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
