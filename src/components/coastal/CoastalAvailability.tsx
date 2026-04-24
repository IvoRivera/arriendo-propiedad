"use client";

import React, { useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { Calendar, MessageCircle, X, ChevronDown } from "lucide-react";
import { availabilityData, heroData } from "@/data/mockData";
import { useConfig } from "@/components/providers/ConfigProvider";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBlockedDates(dates: string[]): Date[] {
  return dates.map((s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  });
}

function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDisplay(date: Date): string {
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatLong(date: Date): string {
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function nightCount(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}



// ─── DateInput — Usando React Portals ────────────────────────────────────────

interface DateInputProps {
  id: string;
  label: string;
  hint: string;
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  onClear: () => void;
  disabledDays: Parameters<typeof DayPicker>[0]["disabled"];
  defaultMonth?: Date;
}

function DateInput({
  id,
  label,
  hint,
  selected,
  onSelect,
  onClear,
  disabledDays,
  defaultMonth,
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = `${id}-panel`;

  // Asegurar que el portal solo se ejecute en el cliente para evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);


  // Cierre con Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    onSelect(date);
    setTimeout(() => setOpen(false), 200); // Feedback visual breve
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onClear();
  }

  return (
    <div className="relative flex-1 min-w-0">
      {/* ── BOTÓN LIMPIO ── */}
      <div
        id={id}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`w-full text-left flex flex-col gap-0.5 px-4 py-3.5 rounded-2xl border transition-all duration-200 bg-white cursor-pointer select-none touch-manipulation ${open
          ? "border-[#6b7c4a] shadow-[0_0_0_3px_rgba(107,124,74,0.12)]"
          : "border-[#e2d9cc] hover:border-[#b5a99a] shadow-sm"
          }`}
      >
        <span className="block text-[10px] uppercase tracking-[0.14em] font-semibold text-[#9a8a78]">
          {label}
        </span>
        <span className="flex items-center justify-between gap-2 mt-0.5">
          <span
            className={`block text-sm font-medium truncate ${selected ? "text-[#2c2416]" : "text-[#b5a99a]"
              }`}
          >
            {selected ? formatDisplay(selected) : hint}
          </span>
          {selected ? (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="shrink-0 p-1 -m-1 rounded-full text-[#b5a99a] hover:text-[#2c2416] hover:bg-[#f5f0e8] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          ) : (
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 text-[#b5a99a] transition-transform duration-200 ${open ? "rotate-180" : ""
                }`}
            />
          )}
        </span>
      </div>

      {/* ── PORTAL INMUNE A LAYOUTS ── */}
      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 transition-opacity cursor-default pointer-events-auto"
            onClick={(e) => {
              // Solo cerrar si se hace click directamente en el backdrop (evita Ghost Clicks en iOS)
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              id={panelId}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-[#e2d9cc] rounded-2xl shadow-2xl w-full max-w-[320px] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 relative z-[100000] pointer-events-auto"
            >
              <div className="flex items-center justify-center gap-4 pt-4 pb-3 px-4 border-b border-[#f0e8dc]">
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#9a8a78]">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6b7c4a]" />
                  Disponible
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#9a8a78]">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#d4c9b8]" />
                  Ocupado
                </span>
              </div>

              <div className="p-4 flex justify-center">
                <DayPicker
                  locale={es}
                  mode="single"
                  selected={selected}
                  onSelect={handleSelect}
                  defaultMonth={defaultMonth ?? selected ?? today()}
                  disabled={disabledDays}
                  showOutsideDays={false}
                  classNames={{
                    root: "rdp-coastal-root",
                    caption_label: "rdp-caption_label rdp-coastal-caption",
                    button_previous: "rdp-button_previous rdp-coastal-nav-btn",
                    button_next: "rdp-button_next rdp-coastal-nav-btn",
                  }}
                />
              </div>

              <div className="px-4 py-3 flex justify-end border-t border-[#f0e8dc] bg-[#faf7f2] rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-[#6b7c4a] hover:text-[#5a6a3d] transition-colors py-1 px-3 bg-white border border-[#e2d9cc] rounded-lg shadow-sm"
                >
                  Cerrar calendario
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface CoastalAvailabilityProps {
  readonly className?: string;
  onAction?: (dates?: { checkIn: Date; checkOut: Date }) => void;
}

export const CoastalAvailability: React.FC<CoastalAvailabilityProps> = ({
  className = "",
  onAction,
}) => {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const uid = useId();

  const blockedDates = parseBlockedDates(availabilityData.blockedDates);
  const todayDate = today();

  const checkInDisabled: Parameters<typeof DayPicker>[0]["disabled"] = [
    { before: todayDate },
    ...blockedDates,
  ];

  const checkOutDisabled: Parameters<typeof DayPicker>[0]["disabled"] = [
    {
      before: checkIn
        ? new Date(checkIn.getTime() + 86_400_000)
        : new Date(todayDate.getTime() + 86_400_000),
    },
    ...blockedDates,
  ];

  function handleCheckInSelect(date: Date) {
    setCheckIn(date);
    if (checkOut && checkOut <= date) setCheckOut(undefined);
  }

  function handleCheckInClear() {
    setCheckIn(undefined);
    setCheckOut(undefined);
  }

  const { getValue } = useConfig();
  const livePriceStr = getValue("PROPERTY_RENT_VALUE") || "80000";

  const hasSelection = checkIn && checkOut;
  const nights = hasSelection ? nightCount(checkIn, checkOut) : 0;

  const pricePerNightNum = parseInt(livePriceStr.replace(/\D/g, ''));
  const totalPrice = nights * pricePerNightNum;
  const totalPriceFormatted = new Intl.NumberFormat('es-CL').format(totalPrice);
  const displayPricePerNight = new Intl.NumberFormat('es-CL').format(pricePerNightNum);

  return (
    <>
      <style>{`
        .rdp-coastal-root {
          --rdp-accent-color: #6b7c4a;
          --rdp-accent-background-color: #e8eedf;
          --rdp-today-color: #c8883a;
          --rdp-selected-border: 2px solid #6b7c4a;
          --rdp-disabled-opacity: 0.35;
          --rdp-day-width: 40px;
          --rdp-day-height: 40px;
          --rdp-day_button-width: 36px;
          --rdp-day_button-height: 36px;
        }
        .rdp-coastal-root .rdp-coastal-caption {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2c2416;
          text-transform: capitalize;
        }
        .rdp-coastal-root .rdp-weekday {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #9a8a78;
        }
        @media (hover: hover) {
          .rdp-coastal-root .rdp-day_button:not(:disabled):not([aria-disabled="true"]):hover {
            background-color: #f0ebe0;
          }
          .rdp-coastal-root .rdp-selected .rdp-day_button:hover {
            background-color: #5a6a3d;
          }
          .rdp-coastal-nav-btn:hover {
            background-color: #f5f0e8;
          }
        }
        .rdp-coastal-root .rdp-selected .rdp-day_button {
          background-color: #6b7c4a;
          color: white;
          border-color: #6b7c4a;
        }
        .rdp-coastal-root .rdp-disabled {
          opacity: var(--rdp-disabled-opacity);
        }
        .rdp-coastal-root .rdp-disabled .rdp-day_button {
          text-decoration: line-through;
          color: #9a8a78;
          cursor: not-allowed;
        }
        /* Elimina los overrides agresivos de iOS, la etiqueta button limpia es suficiente */
        .rdp-coastal-root .rdp-day_button,
        .rdp-coastal-root .rdp-button_previous,
        .rdp-coastal-root .rdp-button_next {
          cursor: pointer; 
        }
      `}</style>

      <section className={`relative z-30 bg-[#faf7f2] py-16 md:py-20 px-6 ${className}`}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b7c4a] font-medium mb-3">
              Disponibilidad
            </p>
            <h2
              className="text-3xl md:text-4xl font-serif font-normal text-[#2c2416] mb-4"
              style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
            >
              {availabilityData.title}
            </h2>
            <p className="text-[#6b5d4f] text-sm font-light leading-relaxed max-w-md mx-auto">
              {availabilityData.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <DateInput
              id={`${uid}-checkin`}
              label="Llegada"
              hint="Seleccionar fecha"
              selected={checkIn}
              onSelect={handleCheckInSelect}
              onClear={handleCheckInClear}
              disabledDays={checkInDisabled}
            />

            <div className="hidden sm:flex items-center justify-center text-[#b5a99a] shrink-0 pt-5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <DateInput
              id={`${uid}-checkout`}
              label="Salida"
              hint="Seleccionar fecha"
              selected={checkOut}
              onSelect={setCheckOut}
              onClear={() => setCheckOut(undefined)}
              disabledDays={checkOutDisabled}
              defaultMonth={checkIn}
            />
          </div>

          {checkIn && !checkOut && (
            <p className="mt-3 text-xs text-center text-[#9a8a78]">
              Ahora selecciona tu fecha de salida
            </p>
          )}

          {hasSelection && (
            <div className="mt-10">
              <div className="bg-white border border-[#e2d9cc] rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex flex-col items-center text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#6b7c4a] font-light mb-8">
                    Tu estadía
                  </p>

                  <div className="flex items-center justify-center gap-8 mb-10 w-full max-w-md">
                    <div className="flex-1 text-right">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#9a8a78] font-medium mb-1.5">Llegada</p>
                      <p className="text-base font-medium text-[#2c2416]">{formatDisplay(checkIn)}</p>
                    </div>
                    <div className="text-[#e2d9cc] shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#9a8a78] font-medium mb-1.5">Salida</p>
                      <p className="text-base font-medium text-[#2c2416]">{formatDisplay(checkOut)}</p>
                    </div>
                  </div>

                  <div className="w-full border-t border-[#e2d9cc] pt-8 mb-10 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6b5d4f] font-light italic">
                        {nights} {nights === 1 ? "noche" : "noches"} de desconexión
                      </span>
                      <span className="text-[#2c2416] font-medium tracking-tight">
                        ${displayPricePerNight} <span className="text-[10px] text-[#9a8a78] uppercase tracking-wider ml-1">/ noche</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-4 border-t border-[#f5f0e8]">
                      <span className="text-xs uppercase tracking-widest text-[#2c2416] font-medium">Total estimado</span>
                      <span className="text-3xl font-serif text-[#2c2416] italic" style={{ fontFamily: "var(--font-newsreader), serif" }}>
                        ${totalPriceFormatted}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAction?.(hasSelection ? { checkIn, checkOut } : undefined)}
                    className="group relative inline-flex items-center gap-4 bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-xs uppercase tracking-[0.2em] px-12 py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center cursor-pointer"
                  >
                    <span>Continuar solicitud</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <p className="mt-6 text-[10px] text-[#9a8a78] uppercase tracking-[0.15em] font-light">
                    * No es un compromiso de pago aún
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CoastalAvailability;