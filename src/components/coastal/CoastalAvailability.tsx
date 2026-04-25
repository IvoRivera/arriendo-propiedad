"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { ChevronDown, X, RefreshCw, CalendarDays, AlertCircle } from "lucide-react";

import { getPriceForDate } from "@/lib/pricingClient";
// import { useConfig } from "@/components/providers/ConfigProvider";

// Custom styles for the calendar
const calendarStyles = `
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #6b7c4a;
    --rdp-background-color: #f5f0e8;
    margin: 0;
  }
  .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
    background-color: var(--rdp-accent-color) !important;
    color: white !important;
  }
  .rdp-day_disabled {
    opacity: 0.3;
    text-decoration: line-through;
    cursor: not-allowed;
    color: #991b1b !important; /* Dark red for occupied */
  }
  .rdp-day_disabled:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background-color: #fee2e2;
    border-radius: 50%;
    z-index: -1;
  }
`;

interface DateInputProps {
  label: string;
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  hint: string;
  disabledDays?: React.ComponentProps<typeof DayPicker>['disabled'];
  onClear: () => void;
  id: string;
  defaultMonth?: Date;
  disabled?: boolean;
  seasonalPrices?: any[];
  basePrice?: number;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  selected,
  onSelect,
  hint,
  disabledDays,
  onClear,
  id,
  defaultMonth,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const formatDisplay = (date: Date) => format(date, "EEE, d MMM", { locale: es });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setOpen(!open);
  };

  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    if (date) setOpen(false);
  };

  return (
    <div className="relative flex-1 min-w-0" ref={containerRef}>
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full text-left flex flex-col gap-0.5 px-4 py-3.5 rounded-2xl border transition-all duration-300 bg-white relative z-30 outline-none ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-[#e2d9cc]" : "cursor-pointer"
        } ${
          open ? "border-[#6b7c4a] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] ring-1 ring-[#6b7c4a]" : "border-[#e2d9cc] hover:border-[#b5a99a] shadow-sm"
        }`}
      >
        <span className="block text-[10px] uppercase tracking-[0.15em] font-bold text-[#9a8a78] pointer-events-none">
          {label}
        </span>
        <span className="flex items-center justify-between gap-2 mt-0.5 pointer-events-none">
          <span className={`block text-sm font-medium truncate ${selected ? "text-[#2c2416]" : "text-[#b5a99a]"}`}>
            {selected ? formatDisplay(selected) : hint}
          </span>
          {selected ? (
            <X 
              className="w-3.5 h-3.5 text-[#b5a99a] hover:text-[#2c2416] pointer-events-auto" 
              onClick={(e) => { e.stopPropagation(); onClear(); }} 
            />
          ) : (
            <ChevronDown className={`w-4 h-4 text-[#e2d9cc] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          )}
        </span>
      </button>

      {open && !disabled && (
        <div className="absolute top-[105%] left-0 sm:left-auto sm:right-0 z-[100] bg-white border border-[#e2d9cc] rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 origin-top overflow-hidden">
          <style>{calendarStyles}</style>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={disabledDays}
            locale={es}
            defaultMonth={defaultMonth || selected || new Date()}
            initialFocus
            components={{
              DayContent: ({ date }) => {
                const { price, isSeasonal } = getPriceForDate(date, seasonalPrices || [], basePrice || 0);
                const formatted = price >= 1000 
                  ? new Intl.NumberFormat('es-CL').format(Math.floor(price / 1000)) + 'k'
                  : price;
                
                return (
                  <div className="flex flex-col items-center justify-center w-full h-full pt-1">
                    <span className="text-[10px] font-medium leading-none">{date.getDate()}</span>
                    {price > 0 && (
                      <span className={`text-[7px] mt-0.5 leading-none font-bold tracking-tighter ${isSeasonal ? 'text-[#6b7c4a]' : 'text-[#b5a99a]'}`}>
                        ${formatted}
                      </span>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

interface CoastalAvailabilityProps {
  onAction?: (dates: { checkIn: Date; checkOut: Date }) => void;
}

export const CoastalAvailability: React.FC<CoastalAvailabilityProps> = ({ onAction }) => {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  
  const [status, setStatus] = useState<'loading' | 'error' | 'success' | 'empty'>('loading');
  const [blockedDateStrings, setBlockedDateStrings] = useState<string[]>([]);
  const [seasonalPrices, setSeasonalPrices] = useState<any[]>([]);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [calculatedPricing, setCalculatedPricing] = useState<{totalPrice: number, breakdown: any[]} | null>(null);

  const fetchAvailability = useCallback(async () => {
    // Only set loading if we don't have data yet to prevent flashing on re-fetches
    setStatus('loading');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      // Use a timestamp to bust cache instead of 'no-store' which can hang in some mobile browsers
      const res = await fetch(`/api/public/availability?t=${Date.now()}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success && data.data) {
        const blocks: string[] = data.data.blockedDates || [];
        setBlockedDateStrings(blocks);
        
        if (blocks.length > 365) {
          setStatus('empty');
        } else {
          setStatus('success');
        }
      } else {
        console.error('[CoastalAvailability] API returned success:false', data);
        setStatus('error');
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        console.error('[CoastalAvailability] Fetch timed out');
      } else {
        console.error('[CoastalAvailability] Fetch error:', e);
      }
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
    
    // Fetch pricing data
    const fetchPricing = async () => {
      try {
        const res = await fetch('/api/public/pricing');
        const data = await res.json();
        if (data.success) {
          setSeasonalPrices(data.data.seasonalPrices);
          setBasePrice(data.data.basePrice);
        }
      } catch (e) {
        console.error('Error fetching pricing:', e);
      }
    };
    fetchPricing();
  }, [fetchAvailability]);

  useEffect(() => {
    if (checkIn && checkOut && basePrice > 0) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nightsCount = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (nightsCount > 0) {
        let total = 0;
        const breakdown = [];
        const curr = new Date(start);
        for (let i = 0; i < nightsCount; i++) {
          const { price, seasonName } = getPriceForDate(curr, seasonalPrices, basePrice);
          total += price;
          breakdown.push({ date: format(curr, 'yyyy-MM-dd'), price, seasonName });
          curr.setDate(curr.getDate() + 1);
        }
        setCalculatedPricing({ totalPrice: total, breakdown });
      } else {
        setCalculatedPricing(null);
      }
    } else {
      setCalculatedPricing(null);
    }
  }, [checkIn, checkOut, seasonalPrices, basePrice]);

  const handleAction = () => {
    if (checkIn && checkOut) {
      onAction?.({ checkIn, checkOut });
    }
  };

  // Safe formatting to compare with YYYY-MM-DD
  const formatIso = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isCheckInDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (blockedDateStrings.includes(formatIso(date))) return true;
    return false;
  };

  const isCheckOutDisabled = (date: Date) => {
    if (!checkIn) return isCheckInDisabled(date);
    
    // Checkout must be after checkin
    if (date <= checkIn) return true;

    // Prevent checkout if there is a blocked date between checkIn and selected date
    const current = new Date(checkIn);
    current.setDate(current.getDate() + 1); // Start checking from day after check-in
    
    // We check up to the day BEFORE the selected checkout date.
    // If a date is blocked, it means it's occupied. We cannot stay there.
    while (current < date) {
      if (blockedDateStrings.includes(formatIso(current))) return true;
      current.setDate(current.getDate() + 1);
    }

    // Is the checkout date itself completely blocked?
    if (blockedDateStrings.includes(formatIso(date))) return true;

    return false;
  };

  const nights = checkIn && checkOut 
    ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <section id="booking" className="relative z-40 -mt-10 md:-mt-16 px-4 pb-12">
      <div className="max-w-4xl mx-auto relative">
        
        {/* Loading Overlay Skeleton */}
        {status === 'loading' && (
          <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[2px] rounded-[32px] flex items-center justify-center border border-white/60">
            <div className="flex flex-col items-center gap-3 bg-white/80 px-6 py-4 rounded-2xl shadow-sm border border-[#e2d9cc]/50">
              <CalendarDays className="w-6 h-6 text-[#6b7c4a] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6b7c4a] animate-pulse">
                Cargando Disponibilidad...
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); fetchAvailability(); }}
                className="mt-1 text-[9px] text-[#9a8a78] hover:text-[#6b7c4a] underline underline-offset-2 transition-colors pointer-events-auto"
              >
                ¿Demora mucho? Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="absolute inset-0 z-50 bg-rose-50/90 backdrop-blur-sm rounded-[32px] flex items-center justify-center border border-rose-200">
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
              <p className="text-sm font-medium text-rose-800">No pudimos cargar la disponibilidad.</p>
              <button 
                onClick={fetchAvailability}
                className="mt-2 flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-rose-700 text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-rose-50 border border-rose-200 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {status === 'empty' && (
          <div className="absolute inset-0 z-50 bg-gray-50/90 backdrop-blur-sm rounded-[32px] flex items-center justify-center border border-gray-200">
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <CalendarDays className="w-8 h-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">No hay fechas disponibles en este periodo.</p>
              <p className="text-xs text-gray-400">Por favor, vuelve a revisar más adelante.</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-[32px] p-2.5 shadow-2xl shadow-black/5">
          <div className="flex flex-col md:flex-row gap-2.5">
            <DateInput
              id="checkin"
              label="Llegada"
              hint="Fecha de entrada"
              selected={checkIn}
              onSelect={setCheckIn}
              onClear={() => { setCheckIn(undefined); setCheckOut(undefined); }}
              disabledDays={isCheckInDisabled}
              disabled={status !== 'success'}
              seasonalPrices={seasonalPrices}
              basePrice={basePrice}
            />
            
            <DateInput
              id="checkout"
              label="Salida"
              hint="Fecha de salida"
              selected={checkOut}
              onSelect={setCheckOut}
              onClear={() => setCheckOut(undefined)}
              disabledDays={isCheckOutDisabled}
              defaultMonth={checkIn}
              disabled={status !== 'success'}
              seasonalPrices={seasonalPrices}
              basePrice={basePrice}
            />

            <button
              onClick={handleAction}
              disabled={!checkIn || !checkOut || status !== 'success'}
              className="md:w-auto w-full bg-[#6b7c4a] hover:bg-[#5a6a3d] disabled:bg-[#d4c9b8] text-white px-10 py-4.5 md:py-0 rounded-2xl md:rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 disabled:grayscale"
            >
              Solicitud de Reserva
            </button>
          </div>
        </div>

        {nights > 0 && status === 'success' && (
          <div className="mt-6 text-center animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="inline-flex flex-col items-center gap-1">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#6b7c4a] font-bold">
                Resumen de Estancia
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif italic text-[#2c2416]">
                  ${calculatedPricing ? new Intl.NumberFormat('es-CL').format(calculatedPricing.totalPrice) : '...'}
                </span>
                <span className="text-xs text-[#9a8a78] font-light">
                  Total por {nights} {nights === 1 ? "noche" : "noches"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};