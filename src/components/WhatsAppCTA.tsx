"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppCTA() {
  const whatsappUrl = "https://wa.me/+56939063695?text=Hola,%20estoy%20interesado%20en%20el%20departamento%20en%20La%20Serena.%20%C2%BFEst%C3%A1%20disponible?";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Tooltip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 rounded-lg shadow-xl border border-slate-700 hidden md:block">
        ¿Tienes dudas? <span className="font-bold text-green-400">¡Escríbenos!</span>
        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-b border-r border-slate-700 rotate-45"></div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulse effect */}
        <span className="absolute w-full h-full rounded-full bg-green-500 opacity-50 animate-ping"></span>

        <MessageCircle className="w-7 h-7 text-white relative z-10" fill="currentColor" />
      </a>
    </motion.div>
  );
}
