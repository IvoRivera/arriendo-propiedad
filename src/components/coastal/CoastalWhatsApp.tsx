// CoastalWhatsApp.tsx — Persistent floating WhatsApp CTA
// data-stitch-id: floating-wa-cta (screen: 75756b60186b4c8da17437331f094caa)

"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/mockData";

interface CoastalWhatsAppProps {
  readonly className?: string;
}

export const CoastalWhatsApp: React.FC<CoastalWhatsAppProps> = ({ className = "" }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      className={`fixed bottom-6 right-5 z-[9999] ${className}`}
    >
      <a
        href={siteConfig.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#6b7c4a] hover:bg-[#5a6a3d] rounded-full shadow-[0_4px_20px_rgba(107,124,74,0.35)] hover:shadow-[0_4px_28px_rgba(107,124,74,0.5)] transition-all duration-300 hover:scale-110"
      >
        {/* Soft pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#6b7c4a] opacity-40 animate-ping" />
        <MessageCircle className="w-6 h-6 text-white relative z-10" fill="currentColor" />
      </a>
    </motion.div>
  );
};

export default CoastalWhatsApp;
