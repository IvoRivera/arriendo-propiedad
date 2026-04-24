"use client";

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { ChevronDown, X } from "lucide-react";

import { useConfig } from "@/components/providers/ConfigProvider";

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
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use a cleaner click-outside that doesn't fire immediately
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    // Use a small timeout to avoid the click that opened the menu
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
    setOpen(!open);
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
        className={`w-full text-left flex flex-col gap-0.5 px-4 py-3.5 rounded-2xl border transition-all duration-300 bg-white cursor-pointer relative z-30 outline-none ${
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

      {open && (
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
  const { } = useConfig();

  const handleAction = () => {
    if (checkIn && checkOut) {
      onAction?.({ checkIn, checkOut });
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkInDisabled = { before: today };
  const checkOutDisabled = checkIn ? { before: new Date(checkIn.getTime() + 86400000) } : { before: today };

  const nights = checkIn && checkOut 
    ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <section id="booking" className="relative z-40 -mt-10 md:-mt-16 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-[32px] p-2.5 shadow-2xl shadow-black/5">
          <div className="flex flex-col md:flex-row gap-2.5">
            <DateInput
              id="checkin"
              label="Llegada"
              hint="Fecha de entrada"
              selected={checkIn}
              onSelect={setCheckIn}
              onClear={() => { setCheckIn(undefined); setCheckOut(undefined); }}
              disabledDays={checkInDisabled}
            />
            
            <DateInput
              id="checkout"
              label="Salida"
              hint="Fecha de salida"
              selected={checkOut}
              onSelect={setCheckOut}
              onClear={() => setCheckOut(undefined)}
              disabledDays={checkOutDisabled}
              defaultMonth={checkIn}
            />

            <button
              onClick={handleAction}
              disabled={!checkIn || !checkOut}
              className="md:w-auto w-full bg-[#6b7c4a] hover:bg-[#5a6a3d] disabled:bg-[#d4c9b8] text-white px-10 py-4.5 md:py-0 rounded-2xl md:rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 disabled:grayscale"
            >
              Consultar
            </button>
          </div>
        </div>

        {nights > 0 && (
          <div className="mt-4 text-center animate-in fade-in slide-in-from-top-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6b7c4a] font-bold">
              {nights} {nights === 1 ? "noche" : "noches"} seleccionadas
            </p>
          </div>
        )}
      </div>
    </section>
  );
};