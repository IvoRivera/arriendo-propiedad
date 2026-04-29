"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
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
    
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;

    // Premium Ease-In-Out Animation
    // slow start (ease in) -> fast middle -> slow end (ease out)
    animate(startPosition, targetPosition, {
      type: "tween",
      duration: 1.5, // Luxurious duration
      ease: [0.65, 0, 0.35, 1], // easeInOutQuint-ish curve
      onUpdate: (latest) => window.scrollTo(0, latest)
    });
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

      {/* STICKY MINI-CTA — Transición minimalista con Morphing (layoutId) */}
      <AnimatePresence mode="wait">
        {showFloating && (
          <motion.button
            layoutId="main-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => scrollToId('availability')}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white rounded-full shadow-[0_20px_40px_-10px_rgba(0,98,143,0.5)] border border-white/20 backdrop-blur-md group"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
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
