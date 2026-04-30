"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { format, differenceInDays } from "date-fns";
import { SITE_CONTENT } from "@/config/site-content";
import { CalendarDays, ArrowRight, AlertCircle, Info, Sparkles } from "lucide-react";
import { getPriceForDate, type SeasonalPricing } from "@/lib/pricingClient";
import "react-day-picker/style.css";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type BookingIntent = 'standard' | 'long-stay';

interface CoastalAvailabilityProps {
  onAction?: (data: { mode: BookingIntent; dates?: { checkIn: Date; checkOut: Date } }) => void;
}


export const CoastalAvailability: React.FC<CoastalAvailabilityProps> = ({ onAction }) => {
  const [activeTab, setActiveTab] = useState<BookingIntent>('standard');
  const [range, setRange] = useState<DateRange | undefined>();
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [blockedDateStrings, setBlockedDateStrings] = useState<string[]>([]);
  const [seasonalPrices, setSeasonalPrices] = useState<SeasonalPricing[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [basePrice, setBasePrice] = useState<number>(0);

  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`/api/public/availability?t=${Date.now()}`);
        const data = await res.json();
        if (data.success && data.data) {
          const raw = data.data.blockedDates || [];
          setBlockedDateStrings(raw);
          const dates = raw.map((d: string) => {
            const [y, m, d_] = d.split('-').map(Number);
            return new Date(y, m - 1, d_);
          });
          setBlockedDates(dates);
        }
      } catch (e) {
        console.error('Error fetching availability:', e);
      }
    };

    const fetchPricing = async () => {
      try {
        const res = await fetch('/api/public/pricing');
        const data = await res.json();
        if (data.success) {
          setSeasonalPrices(data.data.seasonalPrices);
          setHolidays(data.data.holidays || []);
          setBasePrice(data.data.basePrice);
        }
      } catch (e) {
        console.error('Error fetching pricing:', e);
      }
    };

    fetchAvailability();
    fetchPricing();
  }, []);

  const { nights, totalPrice, isValid, isBlocked } = useMemo(() => {
    if (!range?.from || !range?.to) return { nights: 0, totalPrice: 0, isValid: false, isBlocked: false };

    // Check if range contains blocked dates
    const start = range.from;
    const end = range.to;
    const currCheck = new Date(start);
    let rangeHasBlocked = false;

    while (currCheck <= end) {
      const dStr = `${currCheck.getFullYear()}-${String(currCheck.getMonth() + 1).padStart(2, '0')}-${String(currCheck.getDate()).padStart(2, '0')}`;
      if (blockedDateStrings.includes(dStr)) {
        rangeHasBlocked = true;
        break;
      }
      currCheck.setDate(currCheck.getDate() + 1);
    }

    if (rangeHasBlocked) return { nights: 0, totalPrice: 0, isValid: false, isBlocked: true };

    const n = differenceInDays(range.to, range.from);
    if (n < 2) return { nights: n, totalPrice: 0, isValid: false, isBlocked: false };

    let total = 0;
    const curr = new Date(range.from);
    for (let i = 0; i < n; i++) {
      const { price } = getPriceForDate(curr, seasonalPrices, basePrice, holidays);
      total += price;
      curr.setDate(curr.getDate() + 1);
    }

    return { nights: n, totalPrice: total, isValid: true, isBlocked: false };
  }, [range, seasonalPrices, basePrice, holidays, blockedDateStrings]);

  // Intelligent Auto-scroll for Mobile UX
  useEffect(() => {
    if (range?.from && range?.to && isValid && !hasScrolled) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        // Delay slightly to allow the UI to update with pricing info
        const timer = setTimeout(() => {
          confirmButtonRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          setHasScrolled(true);
          setShouldAnimate(true);

          // Reset animation class after it plays
          setTimeout(() => setShouldAnimate(false), 1500);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
    // Reset scroll flag if range is cleared or becomes invalid
    if (!range?.from || !range?.to) {
      setHasScrolled(false);
    }
  }, [range, isValid, hasScrolled]);

  const handleContinue = () => {
    if (activeTab === 'long-stay') {
      onAction?.({ mode: 'long-stay' });
      return;
    }

    if (range?.from && range?.to && isValid) {
      onAction?.({ mode: 'standard', dates: { checkIn: range.from, checkOut: range.to } });
    }
  };

  const calendarStyles = `
    .availability-calendar .rdp {
      --rdp-accent-color: #00628f;
      --rdp-background-color: #f5f0e8;
      margin: 0;
      width: 100% !important;
    }
    .availability-calendar .rdp-months {
      justify-content: center;
    }
    .availability-calendar .rdp-day_selected, 
    .availability-calendar .rdp-day_selected:focus-visible, 
    .availability-calendar .rdp-day_selected:hover {
      background-color: var(--rdp-accent-color) !important;
      color: white !important;
    }
    .availability-calendar .rdp-day_disabled {
      opacity: 0.2;
      text-decoration: line-through;
    }
    @keyframes pulse-highlight {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(0, 98, 143, 0.3); }
      100% { transform: scale(1); }
    }
    .animate-confirm-pulse {
      animation: pulse-highlight 1s ease-out;
    }
  `;

  return (
    <section id="availability" className="relative z-40 bg-[#faf7f2] border-t border-[#e2d9cc] scroll-mt-24">
      <style>{calendarStyles}</style>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-40">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 items-start">

          {/* A. STATIC HEADER (Column 1-5) */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#9a8a78] mb-4 md:mb-8 block">
              {SITE_CONTENT.availability.title}
            </span>
            <h2
              className="text-4xl md:text-7xl font-serif italic text-[#2c2416] mb-4 md:mb-8 leading-[1.1]"
            >
              {activeTab === 'standard' ? '¿Cuándo quieres venir?' : 'Otro ritmo de vida'}
            </h2>
            <p className="text-[#6b5d4f] text-base md:text-xl font-light mb-8 md:mb-12 leading-relaxed">
              {activeTab === 'standard'
                ? 'Selecciona las fechas de tu estadía para verificar disponibilidad y comenzar tu reserva.'
                : 'Diseñamos experiencias para quienes buscan estancias prolongadas, teletrabajo o retiros de temporada.'
              }
            </p>

            <div className="hidden lg:block">
              <p className="text-[#8a7a6a] text-sm italic font-serif max-w-sm">
                * Recibiré personalmente tu reserva y la revisaré con atención para asegurarte una cálida bienvenida y una estadía increíble.
              </p>
            </div>
          </div>

          {/* B. INTERACTIVE ZONE (Column 6-12) — Stable Layout */}
          <div className="lg:col-span-7 w-full max-w-2xl mx-auto lg:mx-0">

            {/* MODES SWITCH (Segmented Control) — Lowered to be right above the interactive content */}
            <div className="flex justify-center lg:justify-start mb-8 md:mb-10">
              <div className="inline-flex p-1.5 bg-[#e2d9cc]/20 backdrop-blur-sm rounded-full border border-[#e2d9cc]/40 relative">
                {(['standard', 'long-stay'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 z-10 ${activeTab === tab ? 'text-white' : 'text-[#6b5d4f] hover:text-[#2c2416]'
                      }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#00628f] rounded-full -z-10 shadow-lg shadow-[#00628f]/20"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                      />
                    )}
                    {tab === 'standard' ? 'Reserva por fechas' : 'Estadía prolongada'}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'standard' ? (
                <motion.div
                  key="standard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-8"
                >
                  {/* 1. CALENDAR — Fixed height/width container */}
                  <div className="availability-calendar bg-white p-4 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-[#e2d9cc] shadow-xl shadow-[#00628f]/5 min-h-[400px] md:min-h-[440px] flex items-center justify-center">
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      disabled={[{ before: new Date() }, ...blockedDates]}
                      locale={es}
                      numberOfMonths={1}
                      className="font-sans"
                    />
                  </div>

                  {/* 2. INFO PANEL — Persistent Container to prevent layout shift */}
                  <div className="min-h-[180px] relative transition-all duration-500">
                    {!range?.from ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[#faf7f2] border border-dashed border-[#e2d9cc] rounded-3xl opacity-60">
                        <CalendarDays className="w-6 h-6 text-[#9a8a78] mb-3" />
                        <p className="text-xs text-[#8a7a6a] font-sans font-semibold uppercase tracking-widest">
                          Selecciona una fecha en el calendario
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Status Bar */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-3xl border border-[#e2d9cc] shadow-sm">
                          <div className="flex items-center gap-3 text-[#2c2416] flex-1">
                            <div className="text-left">
                              <p className="text-[9px] tracking-luxury font-bold text-[#9a8a78]">Desde</p>
                              <p className="font-bold text-base">{format(range.from, "eee d MMM", { locale: es })}</p>
                            </div>
                            <div className="h-4 w-[1px] bg-[#e2d9cc]" />
                            <div className="text-left">
                              <p className="text-[9px] tracking-luxury font-bold text-[#9a8a78]">Hasta</p>
                              <p className="font-bold text-base">
                                {range.to ? format(range.to, "eee d MMM", { locale: es }) : "—"}
                              </p>
                            </div>
                          </div>

                          {range.to && isValid && (
                            <button
                              ref={confirmButtonRef}
                              onClick={handleContinue}
                              className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white rounded-full flex items-center justify-center gap-3 group transition-all hover:scale-105 active:scale-95 ${shouldAnimate ? 'animate-confirm-pulse' : ''}`}
                            >
                              <span className="text-xs font-bold uppercase tracking-widest">Confirmar</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>

                        {/* Feedback Layer (Alert or Price) — Same container height */}
                        <div className="relative min-h-[64px]">
                          {range.to && !isValid && !isBlocked && (
                            <div className="absolute inset-0 flex items-center gap-3 px-6 py-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-sm animate-in zoom-in-95 duration-300">
                              <AlertCircle className="w-4 h-4" />
                              <p className="font-medium italic">La estadía mínima es de 2 noches</p>
                            </div>
                          )}

                          {range.to && isBlocked && (
                            <div className="absolute inset-0 flex items-center gap-3 px-6 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-800 text-sm animate-in zoom-in-95 duration-300">
                              <AlertCircle className="w-4 h-4" />
                              <p className="font-medium italic">Estas fechas no están disponibles</p>
                            </div>
                          )}

                          {range.to && isValid && (
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between px-8 py-4 bg-[#00628f]/[0.03] border border-[#00628f]/10 rounded-2xl animate-in fade-in duration-700">
                                <div className="flex items-center gap-2 text-[#00628f]">
                                  <Info className="w-4 h-4" />
                                  <span className="text-[10px] font-bold tracking-luxury">{nights} noches</span>
                                </div>
                                <p className="text-[#2c2416] text-xl">
                                  <span className="text-xs text-[#8a7a6a] mr-2">Estadía estimada</span>
                                  <span className="font-bold">${new Intl.NumberFormat('es-CL').format(totalPrice)}</span>
                                </p>
                              </div>

                              {/* Upsell Banner (21+ Nights) */}
                              {nights >= 21 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="overflow-hidden"
                                >
                                  <div
                                    onClick={() => setActiveTab('long-stay')}
                                    className="p-4 bg-[#00628f]/5 border border-[#00628f]/10 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-[#00628f]/10 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Sparkles className="w-4 h-4 text-[#00628f]" />
                                      <p className="text-[10px] text-[#00628f] font-bold uppercase tracking-widest">
                                        ¿Estadía extensa? <span className="underline decoration-dotted ml-1">Ver propuesta personalizada</span>
                                      </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#00628f] group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="long-stay"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-8"
                >
                  <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#e2d9cc] shadow-xl shadow-[#00628f]/5 min-h-[340px] md:min-h-[460px] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-[#00628f]/5 rounded-[1.5rem] flex items-center justify-center mb-6">
                      <Sparkles className="w-8 h-8 text-[#00628f]" />
                    </div>
                    <h3
                      className="text-2xl md:text-4xl font-serif italic text-[#2c2416] mb-4 leading-tight"
                    >
                      Algunas estadías merecen otro ritmo.
                    </h3>
                    <p className="text-[#6b5d4f] text-base md:text-lg font-light mb-8 max-w-md leading-relaxed">
                      Si planeas una reserva larga o teletrabajo por temporada, podemos preparar una propuesta personalizada con beneficios exclusivos.
                    </p>
                    <button
                      onClick={handleContinue}
                      className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#00628f] to-[#007cb3] text-white rounded-full flex items-center justify-center gap-4 group transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#00628f]/20"
                    >
                      <span className="text-xs font-bold uppercase tracking-[0.2em]">Solicitar propuesta personalizada</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="mt-8 grid grid-cols-2 gap-6 w-full max-w-sm">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#00628f]" />
                        <span className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold">Tarifas Flexibles</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#00628f]" />
                        <span className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold">Workspace Ready</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

    </section>
  );
};

export default CoastalAvailability;