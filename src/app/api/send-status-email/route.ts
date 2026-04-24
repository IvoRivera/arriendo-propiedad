import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getLiveConfigServer, validatePropertyRentValue } from '@/lib/systemConfigServer';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      status,
      check_in,
      check_out
    } = body;

    // Fetch system configuration securely (Service Role + Server Only)
    const freshConfig = await getLiveConfigServer();
    
    // Validate critical values
    const dailyPrice = validatePropertyRentValue(freshConfig['PROPERTY_RENT_VALUE']);

    const ownerName = freshConfig['OWNER_NAME'] || process.env.OWNER_NAME || 'Anfitrión';
    const whatsappLink = freshConfig['OWNER_WHATSAPP_LINK'] || process.env.OWNER_WHATSAPP_LINK || '';
    const ownerEmail = freshConfig['OWNER_EMAIL'] || process.env.OWNER_EMAIL || '';

    // Calculation logic
    const start = new Date(check_in);
    const end = new Date(check_out);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Use snapshotted price if available
    const totalAmount = body.total_price !== undefined ? Number(body.total_price) : (nightsCount * dailyPrice);
    const totalFormatted = new Intl.NumberFormat('es-CL').format(totalAmount);
    
    // If we have a snapshotted price, we don't show the "nights x daily" calculation if daily is variable
    const bankDetails = `
          Monto a transferir: $${totalFormatted}
          (${nightsCount} noches)
          Nombre: ${freshConfig['OWNER_BANK_NAME'] || process.env.OWNER_BANK_NAME}
          RUT: ${freshConfig['OWNER_BANK_RUT'] || process.env.OWNER_BANK_RUT}
          Banco: ${freshConfig['OWNER_BANK_NAME_ENTITY'] || process.env.OWNER_BANK_NAME_ENTITY} - ${freshConfig['OWNER_BANK_ACCOUNT_TYPE'] || process.env.OWNER_BANK_ACCOUNT_TYPE}
          Número de cuenta: ${freshConfig['OWNER_BANK_ACCOUNT_NUMBER'] || process.env.OWNER_BANK_ACCOUNT_NUMBER}
          Email: ${freshConfig['OWNER_BANK_EMAIL'] || process.env.OWNER_BANK_EMAIL}
    `;

    let subject = "";
    let text = "";

    switch (status) {
      case 'pre_approved':
        subject = "Tu despertar frente al mar en La Serena está casi listo 🌊";
        text = `
          Hola ${full_name},

          Gracias por tu solicitud, la leí con calma y creo que tu estadía calza muy bien con el tipo de experiencia que buscamos cuidar en este espacio 🌊

          El departamento está disponible para ti entre el ${check_in} y el ${check_out}, y con gusto puedo reservarlo para esas fechas.

          Si quieres avanzar, puedes asegurar tu estadía con una transferencia a los siguientes datos:

          Datos de transferencia:
          ${bankDetails}

          Voy a mantener estas fechas reservadas para ti por 24 horas, para que puedas verlo con calma ⏳

          Una vez realizada la transferencia, puedes enviarme el comprobante al correo:
          👉 ${ownerEmail}

          o, si te acomoda más, directamente por WhatsApp:
          👉 ${whatsappLink}

          Este lugar está pensado para bajar el ritmo, descansar y realmente desconectarse, así que si eso es lo que estás buscando, estoy seguro de que lo vas a disfrutar mucho ✨

          Quedo atento,
          ${ownerName}
        `;
        break;

      case 'confirmed':
        subject = "¡Todo listo! Tu despertar frente al mar ya tiene fecha confirmada 🌊";
        text = `
          Hola ${full_name},

          Confirmamos la recepción de tu pago — tu estadía entre el ${check_in} y el ${check_out} ya está completamente asegurada.

          Nos alegra poder recibirte.

          Para coordinar detalles de llegada, recomendaciones y cualquier duda, puedes escribirme directamente por WhatsApp:

          👉 ${whatsappLink}

          Este espacio está pensado para desconectarse, así que cualquier cosa que necesites antes de llegar, feliz de ayudarte.

          Nos vemos pronto,
          ${ownerName}
        `;
        break;

      case 'rejected':
        subject = "Actualización sobre tu solicitud de estadía";
        text = `
            Hola ${full_name},

            Muchas gracias por el interés en nuestro espacio para tu descanso en La Serena.

            Te cuento que, tras revisar nuestra agenda, por esta ocasión no nos será posible confirmar tu solicitud para las fechas seleccionadas debido a compromisos de disponibilidad previos.

            Agradecemos mucho tu tiempo y te deseamos un excelente viaje por la región. Ojalá podamos coincidir en el futuro.
          `;
        break;

      default:
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'ArriendoLS <onboarding@resend.dev>',
      to: email,
      subject: subject,
      text: text,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', err);
    }
    
    // Controlled error responses
    if (err instanceof Error && err.message?.startsWith('CONFIG_')) {
      return NextResponse.json(
        { error: 'Configuration Error', details: err.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
