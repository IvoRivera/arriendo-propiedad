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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      {/* 1. Hero — emotional first impression */}
      <CoastalHero onAction={openModal} />

      {/* 2. Availability — date range picker with Modal CTA */}
      <CoastalAvailability onAction={openModal} />

      <CoastalExperience />

      {/* 4. Gallery — 3 carousels: Destacadas / Departamento / Amenidades */}
      <CoastalGallery onAction={openModal} />

      {/* 5. Discover La Serena — context + aspirational content */}
      <CoastalDiscover />

      {/* 6. Specifications — trust via concrete facts */}
      <CoastalSpecs />

      {/* 7. Location + Testimonials — social proof + CTA */}
      <CoastalLocationTestimonials onAction={openModal} />

      {/* 8. Footer CTA */}
      <CoastalFooterCta onAction={openModal} />

      {/* Premium Request Modal */}
      <CoastalRequestModal isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
}
