"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE_CONTENT } from "@/config/site-content";

interface CoastalFaqProps {
  className?: string;
}

export const CoastalFaq: React.FC<CoastalFaqProps> = ({ className = "" }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={`bg-[#faf7f2] py-16 md:py-20 px-6 ${className}`} id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-normal text-[#2c2416] mb-4">
            {SITE_CONTENT.faq.sectionTitle}
          </h2>
          <p className="text-[#6b5d4f] text-sm md:text-base font-light leading-relaxed max-w-md mx-auto">
            {SITE_CONTENT.faq.sectionSubtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {SITE_CONTENT.faq.items.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-button-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <article
                key={faq.question}
                className="bg-[#f5f0e8] rounded-xl overflow-hidden transition-colors hover:bg-[#f0ebe0]"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full text-left px-6 py-5 flex items-center justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00628f]"
                  >
                    <span className="text-[#2c2416] font-medium pr-4">{faq.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-5 h-5 text-[#00628f] transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-[#6b5d4f] text-sm font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoastalFaq;
