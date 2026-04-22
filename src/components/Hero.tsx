"use client";

import { motion } from "framer-motion";
import { MessageCircle, MapPin, CalendarClock } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const whatsappUrl = "https://wa.me/+56939063695?text=Hola,%20estoy%20interesado%20en%20el%20departamento%20en%20La%20Serena.%20%C2%BFEst%C3%A1%20disponible?";

  return (
    <section className="relative h-[70vh] md:h-screen min-h-[500px] md:min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Vista frontal al mar desde el departamento"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Stronger overlay for mobile readability */}
        <div className="absolute inset-0 bg-slate-950/50 md:bg-slate-950/40 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 md:from-slate-950/80 md:via-slate-950/20 md:to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 mt-10 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl flex flex-col items-center md:items-start text-center md:text-left"
        >
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel mb-4 md:mb-6 border border-white/20 bg-slate-950/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-medium text-slate-200 uppercase tracking-wider">Alta demanda en temporada</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 text-white drop-shadow-lg">
            Despierta <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Frente al Mar</span><br className="hidden md:block" />
            <span className="md:inline"> en La Serena</span>
          </h1>

          <p className="text-base md:text-xl text-slate-200 mb-8 md:mb-10 max-w-2xl font-light drop-shadow-md">
            Experimenta el descanso absoluto en nuestro exclusivo departamento premium. Ubicación privilegiada en Cuatro Esquinas, donde el sonido de las olas será tu única preocupación.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-1 overflow-hidden w-full sm:w-auto justify-center"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
              <MessageCircle className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Consultar Disponibilidad</span>
            </a>
            <div className="flex items-center gap-4 text-[12px] md:text-sm text-slate-300 md:ml-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                <span>Cuatro Esquinas</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarClock className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                <span>Fechas Limitadas</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/50 tracking-widest uppercase">Descubre Más</span>
        <div className="w-[1px] h-8 md:h-12 bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ top: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute left-0 top-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
