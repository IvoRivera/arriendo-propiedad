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

export default function Home() {
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
      {/* 1. Hero — emotional first impression */}
      <CoastalHero onAction={() => openModal()} />

      {/* 2. Availability — date range picker with Modal CTA */}
      <CoastalAvailability onAction={(dates) => openModal(dates)} />

      {/* 3. Experience — values and core selling points */}
      <CoastalExperience />

      {/* 4. Gallery — curated views */}
      <CoastalGallery onAction={() => openModal()} />

      {/* 5. Discover La Serena — local context */}
      <CoastalDiscover />

      {/* 6. Specifications — premium details */}
      <CoastalSpecs />

      {/* 7. Location + Testimonials */}
      <CoastalLocationTestimonials onAction={() => openModal()} />

      {/* 8. Footer CTA */}
      <CoastalFooterCta onAction={() => openModal()} />

      {/* MODAL SYSTEM — Powered by Portals for absolute mobile stability */}
      <CoastalRequestModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        initialDates={selectedDates}
      />
    </main>
  );
}
