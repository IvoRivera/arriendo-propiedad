/**
 * site-content.ts
 * 
 * Fuente de verdad única para el contenido estático y editorial de la Landing Page.
 * Todas las interfaces están tipadas para garantizar consistencia en los componentes.
 */

export interface SiteConfig {
  address: string;
  location: string;
  mapUrl: string;
  googleMapsEmbedSrc: string;
  houseRules: string[];
}

export interface HeroData {
  headline: string;
  tagline: string;
  subheadline: string;
  availabilityPrompt: string;
  ctaText: string;
  staySchedule: string;
}

export interface ExperienceFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ExperienceData {
  sectionTitle: string;
  sectionSubtitle: string;
  features: ExperienceFeature[];
}

export interface GallerySection {
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface GalleryData {
  featured: GallerySection;
  interiors: GallerySection;
  amenities: GallerySection;
  interiorsLabel: string;
  amenitiesLabel: string;
}

export interface SpecificationItem {
  icon: string;
  label: string;
  sublabel: string;
}

export interface SpecificationsData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: SpecificationItem[];
}

export interface AvailabilityData {
  title: string;
  subtitle: string;
  ctaText: string;
  labels: {
    checkIn: string;
    checkInHint: string;
    checkOut: string;
    checkOutHint: string;
    summary: string;
    night: string;
    nights: string;
    minStayWarning: string;
    stayHours: string;
  };
}

export interface DiscoverItem {
  emoji: string;
  title: string;
  description: string;
}

export interface DiscoverData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: DiscoverItem[];
}

export interface TrustSignal {
  icon: string;
  title: string;
  description: string;
}

export interface TrustData {
  sectionTitle: string;
  items: TrustSignal[];
}

export interface FooterCtaData {
  headline: string;
  subheadline: string;
  ctaText: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: FaqItem[];
}

export interface SiteContent {
  site: SiteConfig;
  hero: HeroData;
  experience: ExperienceData;
  gallery: GalleryData;
  specs: SpecificationsData;
  availability: AvailabilityData;
  discover: DiscoverData;
  trust: TrustData;
  faq: FaqData;
  footerCta: FooterCtaData;
}

export const SITE_CONTENT: SiteContent = {
  site: {
    address: "Avenida del Mar 3500, Edificio Playa Serena",
    location: "La Serena, Cuatro Esquinas",
    mapUrl: "https://maps.app.goo.gl/SfjUJLWFQcFtjJzC6",
    googleMapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3458.742468307434!2d-71.26871032394334!3d-29.90053937499645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691ca5cd0e6af11%3A0xc66c1b3fbc062b14!2sAv.%20del%20Mar%203500%2C%20La%20Serena%2C%20Coquimbo!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl",
    houseRules: [
      "Hasta 4 huéspedes para mantener la comodidad del espacio",
      "Sin fiestas ni ruidos molestos en horarios de descanso",
      "Espacio libre de humo en interiores",
      "No se admiten mascotas",
      "Cuidado del departamento y sus detalles"
    ]
  },
  hero: {
    headline: "Despierta Frente al Mar en La Serena",
    tagline: "Tu refugio perfecto frente al Pacífico",
    subheadline: "",
    availabilityPrompt: "",
    ctaText: "Consultar disponibilidad",
    staySchedule: "",
  },
  experience: {
    sectionTitle: "La Experiencia",
    sectionSubtitle: "Un santuario personal diseñado para que el ritmo del mar marque el pulso de tu descanso y cada despertar sea frente al infinito.",
    features: [
      {
        icon: "waves",
        title: "Primera Línea",
        description: "El mar como protagonista absoluto.",
      },
      {
        icon: "sofa",
        title: "Confort Premium",
        description: "Equipamiento y ropa de cama de alta gama.",
      },
      {
        icon: "shield",
        title: "Seguridad 24/7",
        description: "Conserjería y acceso controlado permanente.",
      },
      {
        icon: "maximize",
        title: "Espacios Amplios",
        description: "79m² diseñados para tu comodidad total.",
      },
    ],
  },
  gallery: {
    featured: {
      title: "Vistas que se quedan contigo",
      subtitle: "La serenidad del océano integrada en el diseño de un refugio pensado para la desconexión total.",
      ctaText: "Solicitud de Reserva",
    },
    interiors: {
      title: "Tu espacio frente al mar",
      subtitle: "Luz natural, calma y todo listo para que simplemente llegues a disfrutar.",
      ctaText: "Solicitud de Reserva",
    },
    amenities: {
      title: "Donde empieza tu descanso",
      subtitle: "Un lugar pensado para bajar el ritmo y sentirte cómodo desde el primer momento.",
      ctaText: "Solicitud de Reserva",
    },
    interiorsLabel: "Ver el departamento completo",
    amenitiesLabel: "Explorar amenidades",
  },
  specs: {
    sectionTitle: "Especificaciones",
    sectionSubtitle: "Cada metro cuadrado ha sido diseñado para maximizar tu comodidad y la conexión con el entorno.",
    items: [
      { icon: "area", label: "79 m²", sublabel: "Superficie total" },
      { icon: "bed", label: "2 Dormitorios, 2 Baños", sublabel: "Habitaciones" },
      { icon: "terrace", label: "16.06 m²", sublabel: "Terraza" },
      { icon: "car", label: "1 privado", sublabel: "Estacionamiento" },
    ],
  },
  availability: {
    title: "Disponibilidad",
    subtitle: "Consulta las fechas que te interesan — te contactaremos a la brevedad.",
    ctaText: "Solicitud de Reserva",
    labels: {
      checkIn: "Llegada",
      checkInHint: "Fecha de entrada",
      checkOut: "Salida",
      checkOutHint: "Fecha de salida",
      summary: "Resumen de Estancia",
      night: "noche",
      nights: "noches",
      minStayWarning: "La estadía mínima es de 2 noches.",
      stayHours: "Check-in: 16:00 · Check-out: 12:00",
    }
  },
  discover: {
    sectionTitle: "Lo que vas a vivir aquí",
    sectionSubtitle: "Explora un entorno privilegiado donde la brisa marina, la mejor gastronomía local y la magia del Valle del Elqui completan tu refugio.",
    items: [
      {
        emoji: "🌊",
        title: "Costa, sol y descanso",
        description: "La Playa a pasos de tí, días de sol y noches con brisa costera. El lugar perfecto para desconectar y disfrutar La Serena. La vista hacia el mar te acompaña todo el día.",
      },
      {
        emoji: "🍽️",
        title: "Restaurantes que valen la pena",
        description: "Desde un ceviche frente al mar en Bakulic hasta una cena tranquila en Tololo Beach. Comer bien acá es parte del viaje.",
      },
      {
        emoji: "🌌",
        title: "La magia del Valle del Elqui",
        description: "A menos de una hora: cielos estrellados, viñas y una energía única. Ideal para una escapada de día o una noche distinta.",
      },
      {
        emoji: "🏛️",
        title: "Paseos con historia",
        description: "Recorre La Recova, la Plaza de Armas y sus calles coloniales. Un plan perfecto para una mañana tranquila.",
      },
    ],
  },
  trust: {
    sectionTitle: "Garantía de Confianza",
    items: [
      {
        icon: "building",
        title: "Edificio Nuevo",
        description: "Modernidad y seguridad recién entregada.",
      },
      {
        icon: "user-check",
        title: "Atención Directa",
        description: "Trato personalizado y sin intermediarios.",
      },
      {
        icon: "shield-check",
        title: "Reserva Segura",
        description: "Proceso transparente y respaldado.",
      },
      {
        icon: "sparkles",
        title: "Calidad Premium",
        description: "Detalles cuidados para una estancia única.",
      },
    ],
  },
  faq: {
    sectionTitle: "Preguntas Frecuentes",
    sectionSubtitle: "Resolvemos tus dudas para que tu única preocupación sea disfrutar del mar.",
    items: [
      {
        question: "¿Cómo es el proceso de reserva y pago?",
        answer: "Es simple y seguro. Al enviar tu solicitud, verificamos disponibilidad y te contactamos. La reserva se garantiza mediante transferencia bancaria o pago online."
      },
      {
        question: "¿El departamento cuenta con estacionamiento y seguridad?",
        answer: "Sí, dispones de un estacionamiento privado. El edificio cuenta con conserjería las 24 horas, cámaras de seguridad y acceso controlado para tu total tranquilidad."
      },
      {
        question: "¿Cuál es la política de cancelación?",
        answer: "Entendemos que los planes pueden cambiar. Ofrecemos cancelación flexible hasta 7 días antes de tu llegada con reembolso total. Para cambios de fecha, siempre buscamos la mejor solución según disponibilidad."
      },
      {
        question: "¿Qué incluye exactamente el equipamiento?",
        answer: "Todo lo necesario para una estancia premium: sábanas de 300 hilos, toallas, cocina full equipada, WiFi de alta velocidad y Smart TV."
      },
      {
        question: "¿Puedo coordinar un Check-in o Check-out flexible?",
        answer: "Nuestro horario estándar es Check-in 16:00 y Check-out 12:00. Sin embargo, siempre que la disponibilidad lo permita, ofrecemos flexibilidad sin costo adicional para adaptarnos a tus horarios de viaje."
      }
    ]
  },
  footerCta: {
    headline: "¿Lista tu próxima escapada?",
    subheadline: "Te contactaremos luego de revisar tu solicitud.",
    ctaText: "Reservar Ahora",
  },
};
