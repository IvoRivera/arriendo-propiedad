/**
 * Static editorial content for the public landing page.
 * Keep local SEO, conversion copy and visible UI text in one typed source.
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

export interface LocalHighlight {
  title: string;
  description: string;
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

export interface Testimonial {
  name: string;
  context: string;
  quote: string;
  rating: number;
}

export interface SocialProofData {
  sectionTitle: string;
  sectionSubtitle: string;
  averageRating: string;
  reviewCount: string;
  testimonials: Testimonial[];
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
  localHighlights: LocalHighlight[];
  trust: TrustData;
  socialProof: SocialProofData;
  faq: FaqData;
  footerCta: FooterCtaData;
}

export const SITE_CONTENT: SiteContent = {
  site: {
    address: "Avenida del Mar 3500, Edificio Playa Serena",
    location: "Cuatro Esquinas, La Serena",
    mapUrl: "https://maps.app.goo.gl/SfjUJLWFQcFtjJzC6",
    googleMapsEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3458.742468307434!2d-71.26871032394334!3d-29.90053937499645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691ca5cd0e6af11%3A0xc66c1b3fbc062b14!2sAv.%20del%20Mar%203500%2C%20La%20Serena%2C%20Coquimbo!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl",
    houseRules: [
      "Hasta 4 huespedes para mantener la comodidad del espacio",
      "Sin fiestas ni ruidos molestos en horarios de descanso",
      "Espacio libre de humo en interiores",
      "No se admiten mascotas",
      "Cuidado del departamento, mobiliario y areas comunes",
    ],
  },
  hero: {
    headline: "Arriendo de departamento en La Serena frente al mar",
    tagline: "Vista panorámica al oceano y ubicación privilegiada en primera linea en la avenida del mar",
    subheadline:
      "Vista panoramica al oceano, terraza amplia y ubicacion privilegiada en Avenida del Mar para vacaciones, escapadas o estadias de temporada.",
    availabilityPrompt: "Consulta fechas disponibles y recibe respuesta directa.",
    ctaText: "Consultar disponibilidad",
    staySchedule: "Check-in 16:00 · Check-out 12:00",
  },
  experience: {
    sectionTitle: "Una estadia frente al Pacifico",
    sectionSubtitle:
      "Un departamento pensado para familias, parejas y viajeros de negocios que quieren descansar cerca de la playa sin perder comodidad, conectividad ni seguridad.",
    features: [
      {
        icon: "waves",
        title: "Primera linea",
        description: "Cruza y estas en Playa Cuatro Esquinas, con el mar como protagonista.",
      },
      {
        icon: "sofa",
        title: "Confort completo",
        description: "Living luminoso, cocina equipada, ropa de cama y todo listo para llegar.",
      },
      {
        icon: "shield",
        title: "Seguridad 24/7",
        description: "Conserjeria, acceso controlado y edificio seguro para viajar con tranquilidad.",
      },
      {
        icon: "maximize",
        title: "79 m2 utiles",
        description: "Dos dormitorios, dos banñs y terraza amplia con vista panoramica al oceano.",
      },
    ],
  },
  gallery: {
    featured: {
      title: "Vista al mar desde Cuatro Esquinas",
      subtitle:
        "La terraza y los espacios interiores conectan con la costa de La Serena para que cada dia parta mirando el oceano.",
      ctaText: "Solicitud de reserva",
    },
    interiors: {
      title: "Tu espacio privado en Avenida del Mar",
      subtitle:
        "Ambientes comodos para descansar, cocinar, teletrabajar o compartir despues de un dia de playa.",
      ctaText: "Solicitud de reserva",
    },
    amenities: {
      title: "Edificio con seguridad y areas comunes",
      subtitle:
        "Piscina, quinchos, terrazas y estacionamiento privado para una estadia practica y segura.",
      ctaText: "Solicitud de reserva",
    },
    interiorsLabel: "Ver el departamento completo",
    amenitiesLabel: "Explorar amenidades",
  },
  specs: {
    sectionTitle: "Datos clave del departamento",
    sectionSubtitle:
      "Informacion concreta para decidir rapido si el alojamiento calza con tu viaje a La Serena.",
    items: [
      { icon: "area", label: "79 m2 interiores", sublabel: "Superficie" },
      { icon: "bed", label: "2 dormitorios, 2 baños", sublabel: "Distribucion" },
      { icon: "terrace", label: "Terraza 16.06 m2", sublabel: "Vista al mar" },
      { icon: "car", label: "1 privado incluido", sublabel: "Estacionamiento" },
    ],
  },
  availability: {
    title: "Disponibilidad",
    subtitle:
      "Selecciona fechas, revisa una estimacion y envia una consulta directa para reservar.",
    ctaText: "Solicitud de reserva",
    labels: {
      checkIn: "Llegada",
      checkInHint: "Fecha de entrada",
      checkOut: "Salida",
      checkOutHint: "Fecha de salida",
      summary: "Resumen de estadia",
      night: "noche",
      nights: "noches",
      minStayWarning: "La estadia minima es de 2 noches.",
      stayHours: "Check-in: 16:00 · Check-out: 12:00",
    },
  },
  discover: {
    sectionTitle: "La Serena desde una ubicacion estrategica",
    sectionSubtitle:
      "El sector Cuatro Esquinas conecta playa, restaurantes, servicios y principales puntos turisticos sin depender de trayectos largos.",
    items: [
      {
        emoji: "🌊",
        title: "Playa a pasos",
        description:
          "Primera linea frente a Playa Cuatro Esquinas, ideal para caminatas, descanso familiar y atardeceres mirando el Pacifico.",
      },
      {
        emoji: "🍽️",
        title: "Restaurantes cercanos",
        description:
          "Avenida del Mar concentra restaurantes, cafeterias y terrazas para salir a comer sin alejarte del borde costero.",
      },
      {
        emoji: "🏙️",
        title: "Servicios y ciudad",
        description:
          "Acceso rapido a supermercados, Ruta 5, centros comerciales y al centro historico de La Serena.",
      },
      {
        emoji: "🏜️",
        title: "Base para recorrer",
        description:
          "Buen punto de partida para visitar el Faro Monumental, La Recova, Coquimbo o una escapada al Valle del Elqui.",
      },
    ],
  },
  localHighlights: [
    {
      title: "Playa Cuatro Esquinas",
      description: "Frente al edificio, sin necesidad de mover el auto para bajar a la playa.",
    },
    {
      title: "Avenida del Mar",
      description: "Restaurantes, cafeterias y paseos costeros a distancia caminable.",
    },
    {
      title: "Faro Monumental",
      description: "A pocos minutos por la costanera, uno de los puntos clasicos de La Serena.",
    },
    {
      title: "Centro de La Serena",
      description: "Conectado por Cuatro Esquinas y Ruta 5 para compras, servicios y paseos urbanos.",
    },
    {
      title: "Supermercados y comercio",
      description: "Servicios cercanos para estadias cortas, vacaciones familiares o arriendo por temporada.",
    },
  ],
  trust: {
    sectionTitle: "Confianza para reservar directo",
    items: [
      {
        icon: "building",
        title: "Edificio moderno",
        description: "Accesos controlados, areas comunes cuidadas y buena conectividad.",
      },
      {
        icon: "user-check",
        title: "Atencion directa",
        description: "Contacto sin intermediarios para resolver dudas antes de reservar.",
      },
      {
        icon: "shield-check",
        title: "Reserva revisada",
        description: "Cada solicitud se valida antes de confirmar fechas y condiciones.",
      },
      {
        icon: "sparkles",
        title: "Estadia cuidada",
        description: "Equipamiento, limpieza y reglas claras para proteger tu descanso.",
      },
    ],
  },
  socialProof: {
    sectionTitle: "Huespedes que buscan volver",
    sectionSubtitle:
      "Referencias editables para mostrar experiencias reales cuando se validen nuevas resenas.",
    averageRating: "4.9",
    reviewCount: "18",
    testimonials: [
      {
        name: "Familia Silva",
        context: "Vacaciones familiares",
        quote:
          "La vista desde la terraza fue lo mejor del viaje. El departamento estaba comodo, limpio y muy bien ubicado para ir a la playa con ninos.",
        rating: 5,
      },
      {
        name: "Carlos R.",
        context: "Estadia de trabajo",
        quote:
          "Pude trabajar con buena conexion y despues caminar por Avenida del Mar. La ubicacion en Cuatro Esquinas es muy practica.",
        rating: 5,
      },
      {
        name: "Marcela y Jorge",
        context: "Escapada en pareja",
        quote:
          "Reservar directo fue claro y rapido. El edificio se siente seguro y la vista del piso 11 realmente marca la diferencia.",
        rating: 5,
      },
    ],
  },
  faq: {
    sectionTitle: "Preguntas frecuentes",
    sectionSubtitle:
      "Resuelve las dudas principales antes de consultar disponibilidad o reservar.",
    items: [
      {
        question: "¿Donde esta ubicado el departamento?",
        answer:
          "Esta en Avenida del Mar 3500, sector Cuatro Esquinas, La Serena. Es primera linea frente al mar, cercano a Playa Cuatro Esquinas, restaurantes, supermercados y accesos hacia el centro de la ciudad.",
      },
      {
        question: "¿El departamento tiene vista al mar?",
        answer:
          "Si. Esta en el piso 11 y cuenta con terraza con vista panoramica al oceano Pacifico, una de las principales razones por las que los huespedes eligen este alojamiento.",
      },
      {
        question: "¿Como funciona el proceso de reserva y pago?",
        answer:
          "Envias una solicitud con tus fechas, cantidad de huespedes y motivo del viaje. Revisamos disponibilidad, confirmamos condiciones y luego coordinamos el pago o abono de reserva de forma directa.",
      },
      {
        question: "¿Cuenta con estacionamiento, WiFi y seguridad?",
        answer:
          "Si. Incluye un estacionamiento privado, WiFi de alta velocidad y edificio con conserjeria 24/7, camaras y acceso controlado.",
      },
      {
        question: "¿Sirve para arriendo por temporada o teletrabajo?",
        answer:
          "Si. Ademas de arriendo vacacional por noches, se pueden evaluar estadias prolongadas, viajes de trabajo y arriendos por temporada segun disponibilidad.",
      },
      {
        question: "¿Cual es la estadia minima?",
        answer:
          "La estadia minima es de 2 noches. En fechas de alta demanda, feriados o temporada alta, pueden aplicarse condiciones especiales que se informan antes de confirmar.",
      },
    ],
  },
  footerCta: {
    headline: "¿Listo para despertar frente al mar?",
    subheadline:
      "Consulta disponibilidad para tus fechas y recibe una respuesta directa antes de reservar.",
    ctaText: "Consultar disponibilidad",
  },
};
