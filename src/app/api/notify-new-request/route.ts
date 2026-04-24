import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getLiveConfigServer } from '@/lib/systemConfigServer';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      phone,
      check_in,
      check_out,
      guests_count,
      trip_reason,
      referred_by
    } = body;
    
    // Fetch system configuration directly from Supabase (Live mode)
    const freshConfig = await getLiveConfigServer();
    const ownerEmail = freshConfig['OWNER_EMAIL'] || process.env.OWNER_EMAIL || '';
    const dailyPrice = Number(freshConfig['PROPERTY_RENT_VALUE'] || 0);

    // Stay summary calculation
    const start = new Date(check_in);
    const end = new Date(check_out);
    const nights = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * dailyPrice;
    const formattedTotal = new Intl.NumberFormat('es-CL').format(totalPrice);

    const { data, error } = await resend.emails.send({
      from: 'ArriendoLS <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `Nueva solicitud: ${full_name} (${nights} noches)`,
      text: `
        Nueva solicitud de estadía recibida:

        - Nombre: ${full_name}
        - Email: ${email}
        - Teléfono: ${phone}
        - Fechas: ${check_in} → ${check_out} (${nights} noches)
        - Cantidad de personas: ${guests_count}
        - Motivo del viaje: ${trip_reason}
        - Referido por: ${referred_by}
        
        RESUMEN ECONÓMICO ESTIMADO:
        - Precio diario actual: $${new Intl.NumberFormat('es-CL').format(dailyPrice)}
        - Total estimado: $${formattedTotal}

        Revisa el panel administrativo para gestionar esta solicitud.
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
