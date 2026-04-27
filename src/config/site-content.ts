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

export interface TestimonialItem {
  name: string;
  avatar: string;
  source: string;
  rating: number;
  text: string;
}

export interface TestimonialsData {
  sectionTitle: string;
  ctaText: string;
  items: TestimonialItem[];
}

export interface FooterCtaData {
  headline: string;
  subheadline: string;
  ctaText: string;
}

export interface SiteContent {
  site: SiteConfig;
  hero: HeroData;
  experience: ExperienceData;
  gallery: GalleryData;
  specs: SpecificationsData;
  availability: AvailabilityData;
  discover: DiscoverData;
  testimonials: TestimonialsData;
  footerCta: FooterCtaData;
}

export const SITE_CONTENT: SiteContent = {
  site: {
    address: "Avenida del Mar 3500, Edificio Playa Serena",
    location: "La Serena, Cuatro Esquinas",
    mapUrl: "https://maps.app.goo.gl/SfjUJLWFQcFtjJzC6",
    googleMapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3458.742468307434!2d-71.26871032394334!3d-29.90053937499645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691ca5cd0e6af11%3A0xc66c1b3fbc062b14!2sAv.%20del%20Mar%203500%2C%20La%20Serena%2C%20Coquimbo!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl",
    houseRules: [
      "Capacidad máxima: 4 personas (estricto).",
      "No se permiten fiestas, eventos o ruidos molestos.",
      "Prohibido fumar dentro del departamento.",
      "No se aceptan mascotas (reglamento del edificio).",
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
    sectionSubtitle: "No es solo un lugar para dormir. Es donde el Pacífico se convierte en el paisaje de tu día.",
    features: [
      {
        icon: "waves",
        title: "Primera Línea Real",
        description: "La playa está abajo. El océano está enfrente. No hay edificio entre tú y el mar.",
      },
      {
        icon: "sofa",
        title: "Comodidad Premium",
        description: "Ropa de cama de hotel, cocina equipada y espacios diseñados para descansar de verdad.",
      },
      {
        icon: "shield",
        title: "Seguro y Tranquilo",
        description: "Conserjería 24/7, estacionamiento privado y acceso controlado en el Edificio Playa Serena.",
      },
    ],
  },
  gallery: {
    featured: {
      title: "Vistas que se quedan contigo",
      subtitle: "Lo primero que ves al abrir la puerta.",
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
    items: [
      { icon: "area", label: "79 m²", sublabel: "Superficie total" },
      { icon: "bed", label: "2 Dormitorios, 2 Baños", sublabel: "Habitaciones" },
      { icon: "terrace", label: "Terraza", sublabel: "16.06 m²" },
      { icon: "car", label: "Estacionamiento", sublabel: "1 privado" },
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
      stayHours: "Check-in: 15:00 · Check-out: 11:00",
    }
  },
  discover: {
    sectionTitle: "Lo que vas a vivir aquí",
    sectionSubtitle: "No es solo el lugar, es todo lo que lo rodea: mar, buena comida y noches que se quedan contigo.",
    items: [
      {
        emoji: "🌊",
        title: "Playas a pasos del departamento",
        description: "Camina a la playa de Cuatro Esquinas al atardecer o recorre hasta Totoralillo para aguas más claras. La vista al mar te acompaña todo el día.",
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
  testimonials: {
    sectionTitle: "Lo que dicen quienes estuvieron aquí",
    ctaText: "Solicitud de Reserva",
    items: [
      {
        name: "María José V.",
        avatar: "MJ",
        source: "Airbnb · Enero 2025",
        rating: 5,
        text: "Las fotos no le hacen justicia. Despertar mirando el mar desde la terraza fue lo mejor de nuestras vacaciones. Impecable.",
      },
      {
        name: "Carlos R.",
        avatar: "CR",
        source: "Booking · Febrero 2025",
        rating: 5,
        text: "Ubicación inmejorable. Excelente WiFi para trabajar y las tardes con el sonido del mar son priceless. Volvemos.",
      },
      {
        name: "Familia Silva",
        avatar: "FS",
        source: "Directo · Marzo 2025",
        rating: 5,
        text: "Fuimos con nuestro hijo pequeño. Espacios amplios, limpios y modernos. El estacionamiento privado fue un plus enorme.",
      },
    ],
  },
  footerCta: {
    headline: "¿Lista tu próxima escapada?",
    subheadline: "Te contactaremos luego de revisar tu solicitud.",
    ctaText: "Solicitud de Reserva",
  },
};
