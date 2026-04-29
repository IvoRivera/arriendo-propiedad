"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Calendar } from "lucide-react";
import { CoastalHero } from "@/components/coastal/CoastalHero";
import { CoastalAvailability } from "@/components/coastal/CoastalAvailability";
import { CoastalExperience } from "@/components/coastal/CoastalExperience";
import { CoastalGallery } from "@/components/coastal/CoastalGallery";
import { CoastalDiscover } from "@/components/coastal/CoastalDiscover";
import { CoastalSpecs } from "@/components/coastal/CoastalSpecs";
import { CoastalTrust } from "@/components/coastal/CoastalTrust";
import { CoastalFooterCta } from "@/components/coastal/CoastalFooterCta";
import { CoastalRequestModal } from "@/components/coastal/CoastalRequestModal";
import { CoastalFaq } from "@/components/coastal/CoastalFaq";
import { Property } from "@/types/property";

interface HomeClientProps {
  dynamicImages: any[];
  property: Property | null;
}

export function HomeClient({ dynamicImages, property }: HomeClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ checkIn: Date; checkOut: Date } | null>(null);
  const [bookingIntent, setBookingIntent] = useState<'standard' | 'long-stay'>('standard');
  const [modalKey, setModalKey] = useState(0);

  const openModal = (config?: { mode?: 'standard' | 'long-stay'; dates?: { checkIn: Date; checkOut: Date } }) => {
    if (config?.dates) setSelectedDates(config.dates);
    if (config?.mode) setBookingIntent(config.mode);
    else setBookingIntent('standard'); // Default

    setModalKey(prev => prev + 1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDates(null);
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Detección de Android para evitar el bug de "retorno al hero"
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
      // En Android saltamos directamente para asegurar que llegue al destino
      element.scrollIntoView({ block: 'start' });
    } else {
      // En Desktop e iOS usamos el scroll suave robusto con offset
      element.scrollIntoView({
        behavior: 'smooth', // <--- Esta es la "animación" nativa del navegador
        block: 'center' // Centra el calendario en la pantalla
      });
    }
  };

  const heroRef = useRef(null);
  const footerRef = useRef(null);
  const availabilityRef = useRef(null);
  const experienceRef = useRef(null);
  const faqRef = useRef(null);

  const isHeroInView = useInView(heroRef, { margin: "-100px 0px 0px 0px" });
  const isAvailabilityInView = useInView(availabilityRef, { amount: 0.3 });
  const isExperienceInView = useInView(experienceRef, { amount: 0.2 });
  const isFaqInView = useInView(faqRef, { amount: 0.2 });
  const isFooterInView = useInView(footerRef, { amount: 0.1 });

  const [hasPassedAvailability, setHasPassedAvailability] = useState(false);
  const [ctaLevel, setCtaLevel] = useState(0); // 0: Ver, 1: Reservar, 2: Asegurar

  useEffect(() => {
    const handleScroll = () => {
      const avail = document.getElementById('availability');
      if (avail) {
        const rect = avail.getBoundingClientRect();
        // Se considera que pasó si el fondo del calendario está fuera de la vista superior
        if (rect.bottom < 100) setHasPassedAvailability(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica de progresión irreversible de niveles de urgencia
  useEffect(() => {
    if (isFaqInView || isFooterInView) {
      setCtaLevel(prev => Math.max(prev, 2));
    } else if (isExperienceInView || hasPassedAvailability) {
      setCtaLevel(prev => Math.max(prev, 1));
    }
  }, [isFaqInView, isFooterInView, isExperienceInView, hasPassedAvailability]);

  // El CTA se muestra si no estamos en el Hero ni en el área activa del Calendario
  const showFloating = !isHeroInView && !isAvailabilityInView;

  const getLabel = () => {
    const labels = ["Ver disponibilidad", "Reservar ahora", "Asegurar fechas"];
    return labels[ctaLevel];
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] relative">
      {/* 🟢 ZONA 1 — IMPACTO (0–15% scroll) — Generate desire */}
      <div ref={heroRef}>
        <CoastalHero
          onAction={() => openModal({ mode: 'standard' })}
          onExplore={() => scrollToId('availability')}
          dynamicImages={dynamicImages}
          property={property}
        />
      </div>

      {/* 🔵 ZONA 2 — CONFIANZA REAL — Credibility Signals */}
      <CoastalTrust />

      {/* 🟠 ZONA 3 — DESEO VISUAL — Visual connection */}
      <CoastalGallery onAction={() => openModal({ mode: 'standard' })} dynamicImages={dynamicImages} />

      {/* 🟣 ZONA 4 — ACCIÓN RÁPIDA — Intent to action */}
      <div ref={availabilityRef}>
        <CoastalAvailability onAction={(config) => openModal(config)} />
      </div>

      {/* 🟡 ZONA 5 — VALOR RACIONAL (Experiencia) — Meaning */}
      <div ref={experienceRef}>
        <CoastalExperience />
      </div>

      {/* 🟢 ZONA 6 — VALOR RACIONAL (Expansión) — Discover */}
      <CoastalDiscover />

      {/* ⚫ ZONA 7 — VALOR RACIONAL (Specs) — Details */}
      <CoastalSpecs />

      {/* 🟤 ZONA 8 — REDUCCIÓN DE OBJECIONES — FAQ */}
      <div ref={faqRef}>
        <CoastalFaq />
      </div>

      {/* ⚫ ZONA 9 — CIERRE — Final Confirmation */}
      <div ref={footerRef}>
        <CoastalFooterCta onAction={() => scrollToId('availability')} />
      </div>

      {/* STICKY MINI-CTA — Alineado con el eje del Hero */}
      <AnimatePresence mode="wait">
        {showFloating && (
          <div className="fixed bottom-8 left-0 right-0 z-[60] pointer-events-none flex justify-center">
            <div className="max-w-5xl w-full px-6 flex justify-end md:justify-center">
              <motion.button
                key="sticky-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: [1, 1.03, 1],
                  boxShadow: [
                    "0 20px 40px -10px rgba(0,98,143,0.3)",
                    "0 20px 40px -10px rgba(0,98,143,0.6)",
                    "0 20px 40px -10px rgba(0,98,143,0.3)"
                  ]
                }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ y: -2, scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  scale: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  boxShadow: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  y: { type: "spring", stiffness: 400, damping: 25 },
                  default: { duration: 0.3 }
                }}
                onClick={() => scrollToId('availability')}
                className="pointer-events-auto relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white rounded-full border border-white/20 backdrop-blur-md group shadow-2xl"
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                  animate={{ x: ['-120%', '120%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "linear",
                    repeatDelay: 5
                  }}
                />

                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                <div className="relative h-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={getLabel()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-[10px] font-bold uppercase tracking-[0.25em] relative z-10 whitespace-nowrap block"
                    >
                      {getLabel()}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL SYSTEM — Powered by Portals for absolute mobile stability */}
      <CoastalRequestModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={closeModal}
        intentMode={bookingIntent}
        initialDates={selectedDates}
      />
    </main>
  );
}
