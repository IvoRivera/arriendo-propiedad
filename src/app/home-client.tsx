"use client";

import { useState } from "react";
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

  const openModal = (dates?: { checkIn: Date; checkOut: Date }) => {
    if (dates) setSelectedDates(dates);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDates(null);
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] relative">
      {/* 🟢 ZONA 1 — IMPACTO (0–15% scroll) — Generate desire */}
      <CoastalHero 
        onAction={() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })} 
        dynamicImages={dynamicImages} 
        property={property} 
      />

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
      <CoastalFooterCta onAction={() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* MODAL SYSTEM — Powered by Portals for absolute mobile stability */}
      <CoastalRequestModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        initialDates={selectedDates}
      />
    </main>
  );
}
