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
import { Property } from "@/types/property";

interface HomeClientProps {
  dynamicImages: any[];
  property: Property | null;
}

export function HomeClient({ dynamicImages, property }: HomeClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ checkIn: Date; checkOut: Date } | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const openModal = (dates?: { checkIn: Date; checkOut: Date }) => {
    if (dates) setSelectedDates(dates);
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
    
    // Smoothness is now handled by CSS 'scroll-behavior: smooth' in globals.css
    // This is the most robust way to ensure it works on all mobile browsers
    element.scrollIntoView({ block: 'center' });
  };

  const heroRef = useRef(null);
  const footerRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { margin: "-100px 0px 0px 0px" });
  const isFooterInView = useInView(footerRef, { amount: 0.1 });

  const showFloating = !isHeroInView && !isFooterInView;

  return (
    <main className="min-h-screen bg-[#faf7f2] relative">
      {/* 🟢 ZONA 1 — IMPACTO (0–15% scroll) — Generate desire */}
      <div ref={heroRef}>
        <CoastalHero 
          onAction={() => scrollToId('availability')} 
          dynamicImages={dynamicImages} 
          property={property} 
        />
      </div>

      {/* 🟠 ZONA 2 — INMERSIÓN (15–35% scroll) — Visual connection */}
      <CoastalGallery onAction={() => openModal()} dynamicImages={dynamicImages} />

      {/* 🟡 ZONA 3 — SIGNIFICADO (35–55% scroll) — Rationalize desire */}
      <CoastalExperience />

      {/* 🟢 ZONA 4 — EXPANSIÓN (55–70% scroll) — Value expansion */}
      <CoastalDiscover />

      {/* 🔵 ZONA 5 — CONFIANZA (70–85% scroll) — Credibility & Certainty */}
      <CoastalLocationTestimonials onAction={() => openModal()} />

      {/* 🟣 ZONA 6 — DECISIÓN (85–95% scroll) — Intent to action */}
      <CoastalAvailability onAction={(dates) => openModal(dates)} />

      {/* ⚫ ZONA 7 — CIERRE (95–100% scroll) — Specs & Final Confirmation */}
      <CoastalSpecs />
      <div ref={footerRef}>
        <CoastalFooterCta onAction={() => scrollToId('availability')} />
      </div>

      {/* STICKY MINI-CTA — Transición minimalista y centrada para máxima ergonomía */}
      <AnimatePresence>
        {showFloating && (
          <motion.button
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToId('availability')}
            className="fixed bottom-8 left-1/2 z-[60] flex items-center gap-2.5 px-6 py-3.5 bg-[#00628f]/90 text-white rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-lg group overflow-hidden"
          >
            {/* Glossy light effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Calendar className="w-4 h-4 text-[#66B8B6]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
              Disponibilidad
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* MODAL SYSTEM — Powered by Portals for absolute mobile stability */}
      <CoastalRequestModal 
        key={modalKey}
        isOpen={isModalOpen} 
        onClose={closeModal} 
        initialDates={selectedDates}
      />
    </main>
  );
}
