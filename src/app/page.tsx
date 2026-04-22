// page.tsx — Boutique Coastal Rental — final page assembly
// Section order optimized for CRO: Hero → Availability → Experience → Gallery → Discover → Specs → Location+Trust → Footer

import { CoastalHero } from "@/components/coastal/CoastalHero";
import { CoastalExperience } from "@/components/coastal/CoastalExperience";
import { CoastalGallery } from "@/components/coastal/CoastalGallery";
import { CoastalDiscover } from "@/components/coastal/CoastalDiscover";
import { CoastalSpecs } from "@/components/coastal/CoastalSpecs";
import { CoastalLocationTestimonials } from "@/components/coastal/CoastalLocationTestimonials";
import { CoastalFooterCta } from "@/components/coastal/CoastalFooterCta";
import { CoastalWhatsApp } from "@/components/coastal/CoastalWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      {/* 1. Hero — emotional first impression */}
      <CoastalHero />

      <CoastalExperience />

      {/* 4. Gallery — 3 carousels: Destacadas / Departamento / Amenidades */}
      <CoastalGallery />

      {/* 5. Discover La Serena — context + aspirational content */}
      <CoastalDiscover />

      {/* 6. Specifications — trust via concrete facts */}
      <CoastalSpecs />

      {/* 7. Location + Testimonials — social proof + CTA */}
      <CoastalLocationTestimonials />

      {/* 8. Footer CTA */}
      <CoastalFooterCta />

      {/* Persistent floating WhatsApp button */}
      <CoastalWhatsApp />
    </main>
  );
}
