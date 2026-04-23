import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getLiveConfig } from '@/lib/systemConfig';

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
      referred_by,
      status
    } = body;
    
    // Fetch system configuration directly from Supabase (Live mode)
    const freshConfig = await getLiveConfig();
    const ownerEmail = freshConfig['OWNER_EMAIL'] || process.env.OWNER_EMAIL || '';

    const { data, error } = await resend.emails.send({
      from: 'ArriendoLS <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `Nueva solicitud de arriendo - ${full_name}`,
      text: `
        Nueva solicitud de estadía recibida:

        - Nombre: ${full_name}
        - Email: ${email}
        - Teléfono: ${phone}
        - Fechas: ${check_in} → ${check_out}
        - Cantidad de personas: ${guests_count}
        - Motivo del viaje: ${trip_reason}
        - Referido por: ${referred_by}
        - Estado: ${status}

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
