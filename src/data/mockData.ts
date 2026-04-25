// mockData.ts — Static content and configuration for BoutiqueCoastalLanding
// ✅ Note: Images are now managed via Supabase (Dynamic) with isolated local fallbacks in src/config/image-fallbacks.ts.

export const siteConfig = {
  address: "Avenida del Mar 3500, Edificio Playa Serena",
  location: "La Serena, Cuatro Esquinas",
  mapUrl: "https://maps.app.goo.gl/SfjUJLWFQcFtjJzC6",
  googleMapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3458.742468307434!2d-71.26871032394334!3d-29.90053937499645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691ca5cd0e6af11%3A0xc66c1b3fbc062b14!2sAv.%20del%20Mar%203500%2C%20La%20Serena%2C%20Coquimbo!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl",
  houseRules: [
    "Capacidad máxima: 4 personas (estricto).",
    "No se permiten fiestas, eventos o ruidos molestos.",
    "Prohibido fumar dentro del departamento y en la terraza.",
    "No se aceptan mascotas (reglamento del edificio).",
    "Horario de silencio: 22:00 a 08:00 hrs.",
  ]
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
export const heroData = {
  headline: "Despierta Frente al Mar",
  tagline: "79 m² · Primera línea · 2 dormitorios · Cuatro Esquinas, La Serena",
  subheadline: "Solicita tu reserva — sin intermediarios.",
  _pricePerNight_DEPRECATED: "80.000",
  availabilityPrompt: "Consulta disponibilidad en segundos",
  ctaText: "Solicitud de Reserva",
};

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
export const experienceData = {
  sectionTitle: "La Experiencia",
  sectionSubtitle:
    "No es solo un lugar para dormir. Es donde el Pacífico se convierte en el paisaje de tu día.",
  features: [
    {
      icon: "waves",
      title: "Primera Línea Real",
      description:
        "La playa está abajo. El océano está enfrente. No hay edificio entre tú y el mar.",
    },
    {
      icon: "sofa",
      title: "Comodidad Premium",
      description:
        "Ropa de cama de hotel, cocina equipada y espacios diseñados para descansar de verdad.",
    },
    {
      icon: "shield",
      title: "Seguro y Tranquilo",
      description:
        "Conserjería 24/7, estacionamiento privado y acceso controlado en el Edificio Playa Serena.",
    },
  ],
};

// ─── GALLERY ──────────────────────────────────────────────────────────────────
// Content (titles/subtitles) for gallery carousels.
// Image data is handled by Supabase with local fallback.
export const galleryData = {
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
};

// ─── SPECIFICATIONS ───────────────────────────────────────────────────────────
export const specificationsData = {
  sectionTitle: "Especificaciones",
  items: [
    { icon: "area", label: "79 m²", sublabel: "Superficie total" },
    { icon: "bed", label: "2 Dormitorios, 1 Baño", sublabel: "Habitaciones" },
    { icon: "terrace", label: "Terraza", sublabel: "16.06 m²" },
    { icon: "car", label: "Estacionamiento", sublabel: "1 privado" },
  ],
};

// ─── AVAILABILITY CALENDAR ────────────────────────────────────────────────────
export const availabilityData = {
  title: "Disponibilidad",
  subtitle: "Consulta las fechas que te interesan — te contactaremos a la brevedad.",
  ctaText: "Solicitud de Reserva",
};

// ─── DISCOVER LA SERENA ───────────────────────────────────────────────────────
export const discoverData = {
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
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const testimonialsData = {
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
};

// ─── INVENTORY BASE ───────────────────────────────────────────────────────────
export const baseInventory = [
  { id: "kitchen-1", category: "Cocina", name: "Refrigerador", condition: "Excelente" },
  { id: "kitchen-2", category: "Cocina", name: "Microondas", condition: "Limpio/Operativo" },
  { id: "kitchen-3", category: "Cocina", name: "Encimera Eléctrica", condition: "Operativa" },
  { id: "kitchen-4", category: "Cocina", name: "Set de loza (4 pers.)", condition: "Completo" },
  { id: "living-1", category: "Living", name: "Smart TV 55\"", condition: "Operativo con control" },
  { id: "living-2", category: "Living", name: "Sofá principal", condition: "Sin manchas" },
  { id: "living-3", category: "Living", name: "Ventanal terraza", condition: "Limpio/Cierra bien" },
  { id: "bed-1", category: "Dormitorio Principal", name: "Cama Queen", condition: "Ropa blanca limpia" },
  { id: "bed-2", category: "Dormitorio 2", name: "2 Camas Single", condition: "Ropa blanca limpia" },
  { id: "bath-1", category: "Baño", name: "Ducha/Grifería", condition: "Sin fugas/Limpio" },
];

// ─── FOOTER CTA ───────────────────────────────────────────────────────────────
export const footerCtaData = {
  headline: "¿Lista tu próxima escapada?",
  subheadline: "Te contactaremos luego de revisar tu solicitud.",
  ctaText: "Solicitud de Reserva",
};
