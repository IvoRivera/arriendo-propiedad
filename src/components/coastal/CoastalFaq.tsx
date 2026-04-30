"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONTENT } from "@/config/site-content";

interface CoastalFaqProps {
  className?: string;
}

export const CoastalFaq: React.FC<CoastalFaqProps> = ({ className = "" }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`bg-[#faf7f2] py-16 md:py-20 px-6 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-serif font-normal text-[#2c2416] mb-4"
          >
            {SITE_CONTENT.faq?.sectionTitle || "Preguntas Frecuentes"}
          </h2>
          <p className="text-[#6b5d4f] text-sm md:text-base font-light leading-relaxed max-w-md mx-auto">
            {SITE_CONTENT.faq?.sectionSubtitle || "Todo lo que necesitas saber antes de tu llegada."}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {SITE_CONTENT.faq?.items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="bg-[#f5f0e8] rounded-xl overflow-hidden transition-colors hover:bg-[#f0ebe0]"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className="text-[#2c2416] font-medium pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#00628f] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-[#6b5d4f] text-sm font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoastalFaq;
