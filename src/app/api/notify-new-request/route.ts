import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getLiveConfigServer, getPropertyBaseConfig } from '@/lib/systemConfigServer';
import { getPricing } from '@/lib/pricing';
import { verifyAdminRequest } from '@/lib/adminAuth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

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

    // Fetch configuration
    const [freshConfig, property] = await Promise.all([
      getLiveConfigServer(),
      getPropertyBaseConfig()
    ]);

    const ownerEmail = freshConfig['OWNER_EMAIL'] || process.env.OWNER_EMAIL || 'ivo.rivera.godoy@gmail.com';
    
    if (!ownerEmail) {
      console.error('[Resend] Error: No owner email configured in system_config or environment variables');
    }

    // Use central pricing engine
    const pricing = await getPricing({
      checkIn: check_in,
      checkOut: check_out,
      property: property
    });

    const nights = pricing.nightsCount;

    // Use snapshotted total_price if provided (from the new bookings API)
    const totalPrice = body.total_price !== undefined ? Number(body.total_price) : pricing.totalPrice;
    const formattedTotal = new Intl.NumberFormat('es-CL').format(totalPrice);
    const dailyPrice = pricing.nightlyPrice;

    const { data, error } = await resend.emails.send({
      from: 'Reservas Arriendo Costa Serena <reservas@riveradigital.cl>',
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
      console.error('[Resend Notification Error]:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
