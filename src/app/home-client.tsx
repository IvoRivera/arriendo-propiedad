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
import { CoastalLocationTestimonials } from "@/components/coastal/CoastalLocationTestimonials";
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
    
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const heroRef = useRef(null);
  const footerRef = useRef(null);
  const availabilityRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { margin: "-100px 0px 0px 0px" });
  const isFooterInView = useInView(footerRef, { amount: 0.1 });
  const isAvailabilityInView = useInView(availabilityRef, { amount: 0.3 });

  const showFloating = !isHeroInView && !isFooterInView && !isAvailabilityInView;

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

      {/* 🔵 ZONA 2 — CONFIANZA TEMPRANA — Credibility & Social Proof */}
      <CoastalLocationTestimonials onAction={() => openModal({ mode: 'standard' })} />

      {/* 🟣 ZONA 3 — ACCIÓN RÁPIDA — Intent to action */}
      <div ref={availabilityRef}>
        <CoastalAvailability onAction={(config) => openModal(config)} />
      </div>

      {/* 🟠 ZONA 4 — DESEO VISUAL — Visual connection */}
      <CoastalGallery onAction={() => openModal({ mode: 'standard' })} dynamicImages={dynamicImages} />

      {/* 🟡 ZONA 5 — VALOR RACIONAL (Experiencia) — Meaning */}
      <CoastalExperience />

      {/* 🟢 ZONA 6 — VALOR RACIONAL (Expansión) — Discover */}
      <CoastalDiscover />

      {/* ⚫ ZONA 7 — VALOR RACIONAL (Specs) — Details */}
      <CoastalSpecs />

      {/* 🟤 ZONA 8 — REDUCCIÓN DE OBJECIONES — FAQ */}
      <CoastalFaq />

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => scrollToId('availability')}
                className="pointer-events-auto flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white rounded-full shadow-[0_20px_40px_-10px_rgba(0,98,143,0.5)] border border-white/20 backdrop-blur-md group"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Solicitar Reserva
                </span>
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
