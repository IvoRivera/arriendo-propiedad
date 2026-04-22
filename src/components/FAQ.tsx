"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Cómo funciona el proceso de reserva?",
      answer: "Todo el proceso se gestiona de manera directa y segura vía WhatsApp. Solo debes indicarnos las fechas que deseas, verificamos disponibilidad y te enviamos los datos para realizar el abono que confirmará tu reserva. Sin comisiones ocultas de plataformas."
    },
    {
      question: "¿Qué incluye el departamento?",
      answer: "El departamento está completamente equipado. Incluye ropa de cama premium, toallas de baño, secador de pelo, Smart TV, cocina completamente amoblada, microondas, hervidor, refrigerador y conexión WiFi de fibra óptica."
    },
    {
      question: "¿Cuál es el horario de Check-in y Check-out?",
      answer: "El Check-in es a partir de las 15:00 hrs y el Check-out es hasta las 12:00 hrs. Si necesitas horarios especiales, podemos revisarlo según la disponibilidad de ese día."
    },
    {
      question: "¿El estacionamiento tiene un costo adicional?",
      answer: "No, el departamento incluye 1 estacionamiento privado y de uso exclusivo dentro del recinto del edificio sin ningún costo extra."
    },
    {
      question: "¿Se permiten mascotas?",
      answer: "Para garantizar la higiene y tranquilidad de todos nuestros huéspedes, actualmente no estamos recibiendo mascotas en el departamento."
    }
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-slate-400">Resolvemos tus dudas para que reserves con total tranquilidad.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="glass-panel border border-slate-700/50 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-slate-200 pr-8">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
