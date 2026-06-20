"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import { CoastalHero } from "@/components/coastal/CoastalHero";
import { CoastalTrust } from "@/components/coastal/CoastalTrust";
import { trackConversion } from "@/lib/analytics";
import { Property } from "@/types/property";

const CoastalGallery = dynamic(() =>
  import("@/components/coastal/CoastalGallery").then((mod) => mod.CoastalGallery)
);
const CoastalAvailability = dynamic(() =>
  import("@/components/coastal/CoastalAvailability").then((mod) => mod.CoastalAvailability)
);
const CoastalExperience = dynamic(() =>
  import("@/components/coastal/CoastalExperience").then((mod) => mod.CoastalExperience)
);
const CoastalDiscover = dynamic(() =>
  import("@/components/coastal/CoastalDiscover").then((mod) => mod.CoastalDiscover)
);
const CoastalSpecs = dynamic(() =>
  import("@/components/coastal/CoastalSpecs").then((mod) => mod.CoastalSpecs)
);
const CoastalSocialProof = dynamic(() =>
  import("@/components/coastal/CoastalSocialProof").then((mod) => mod.CoastalSocialProof)
);
const CoastalFaq = dynamic(() =>
  import("@/components/coastal/CoastalFaq").then((mod) => mod.CoastalFaq)
);
const CoastalFooterCta = dynamic(() =>
  import("@/components/coastal/CoastalFooterCta").then((mod) => mod.CoastalFooterCta)
);
const CoastalRequestModal = dynamic(
  () => import("@/components/coastal/CoastalRequestModal").then((mod) => mod.CoastalRequestModal),
  { ssr: false }
);

interface HomeClientProps {
  dynamicImages: unknown[];
  property: Property | null;
}

export function HomeClient({ dynamicImages, property }: HomeClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ checkIn: Date; checkOut: Date } | null>(null);
  const [bookingIntent, setBookingIntent] = useState<"standard" | "long-stay">("standard");
  const [modalKey, setModalKey] = useState(0);

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
  const [ctaLevel, setCtaLevel] = useState(0);

  const openModal = (config?: { mode?: "standard" | "long-stay"; dates?: { checkIn: Date; checkOut: Date } }) => {
    if (config?.dates) setSelectedDates(config.dates);
    if (config?.mode) setBookingIntent(config.mode);
    else setBookingIntent("standard");

    trackConversion("booking_request_open", {
      booking_mode: config?.mode || "standard",
      has_dates: Boolean(config?.dates),
    });
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDates(null);
  };

  const scrollToId = (id: string, placement = "unknown") => {
    const element = document.getElementById(id);
    if (!element) return;

    trackConversion("availability_cta_click", { placement });

    const isAndroid = /Android/i.test(navigator.userAgent);
    element.scrollIntoView({
      behavior: isAndroid ? "auto" : "smooth",
      block: isAndroid ? "start" : "center",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const availability = document.getElementById("availability");
      if (!availability) return;

      const rect = availability.getBoundingClientRect();
      if (rect.bottom < 100) setHasPassedAvailability(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isFaqInView || isFooterInView) {
      setCtaLevel((prev) => Math.max(prev, 2));
    } else if (isExperienceInView || hasPassedAvailability) {
      setCtaLevel((prev) => Math.max(prev, 1));
    }
  }, [isFaqInView, isFooterInView, isExperienceInView, hasPassedAvailability]);

  const showFloating = !isHeroInView && !isAvailabilityInView;
  const ctaLabels = ["Ver disponibilidad", "Reservar ahora", "Asegurar fechas"];

  return (
    <main className="min-h-screen bg-[#faf7f2] relative">
      <div ref={heroRef}>
        <CoastalHero
          onAction={() => openModal({ mode: "standard" })}
          onExplore={() => scrollToId("availability", "hero")}
          dynamicImages={dynamicImages}
          property={property}
        />
      </div>

      <CoastalTrust />
      <CoastalGallery onAction={() => openModal({ mode: "standard" })} dynamicImages={dynamicImages} />

      <div ref={availabilityRef}>
        <CoastalAvailability onAction={(config) => openModal(config)} />
      </div>

      <div ref={experienceRef}>
        <CoastalExperience />
      </div>

      <CoastalDiscover />
      <CoastalSpecs />
      <CoastalSocialProof />

      <div ref={faqRef}>
        <CoastalFaq />
      </div>

      <div ref={footerRef}>
        <CoastalFooterCta onAction={() => scrollToId("availability", "footer")} />
      </div>

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
                    "0 20px 40px -10px rgba(0,98,143,0.3)",
                  ],
                }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ y: -2, scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  scale: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  boxShadow: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  y: { type: "spring", stiffness: 400, damping: 25 },
                  default: { duration: 0.3 },
                }}
                onClick={() => scrollToId("availability", "sticky")}
                className="pointer-events-auto relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white rounded-full border border-white/20 backdrop-blur-md group shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00628f]"
                type="button"
              >
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "linear",
                    repeatDelay: 5,
                  }}
                />

                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                <div className="relative h-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={ctaLabels[ctaLevel]}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-[10px] font-bold uppercase tracking-[0.25em] relative z-10 whitespace-nowrap block"
                    >
                      {ctaLabels[ctaLevel]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>
          </div>
        )}
      </AnimatePresence>

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
