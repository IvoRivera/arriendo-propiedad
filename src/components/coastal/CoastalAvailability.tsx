// CoastalAvailability.tsx — Two-input date picker (check-in / check-out)
// Uses react-day-picker v9, single mode, one calendar per input.
//
// FIX LOG:
// - Import react-day-picker's own style.css so disabled/.rdp-* classes work correctly
// - Override colors via CSS custom properties on .rdp-root, not via classNames hacks
// - Remove pointer-events-none from disabled td (was blocking iOS touch on entire rows)
// - Remove overflow-hidden from panel (was blocking iOS touch propagation)
// - Add touch-action: manipulation to day buttons via CSS
// - Use position:fixed panel on mobile so it is never clipped by a parent

"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
// ✅ Import rdp default stylesheet — REQUIRED for disabled/selected states to work
import "react-day-picker/src/style.css";
import { Calendar, MessageCircle, X, ChevronDown } from "lucide-react";
import { availabilityData } from "@/data/mockData";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBlockedDates(dates: string[]): Date[] {
  return dates.map((s) => {
    const [y, m, d] = s.split("-").map(Number);
    // Use UTC midnight to avoid timezone shifting the date by a day
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

function buildWhatsAppUrl(from: Date, to: Date): string {
  const msg = encodeURIComponent(
    `Hola! Me gustaría quedarme en el departamento en La Serena.\nFechas: ${formatLong(from)} al ${formatLong(to)}\n¿Está disponible?`
  );
  return `https://wa.me/+56939063695?text=${msg}`;
}

// ─── DateInput — single reusable input + calendar ────────────────────────────

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
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelId = `${id}-panel`;

  // ── Close on outside pointer (mouse + touch) ──────────────────────────────
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  // ── Close on Escape ───────────────────────────────────────────────────────
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
    // Small delay — lets the day_button tap complete before dismounting,
    // avoids "double-tap required" on iOS Safari.
    setTimeout(() => setOpen(false), 120);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onClear();
  }

  return (
    <div className="relative flex-1 min-w-0">
      {/* ── Input trigger ── */}
      <button
        ref={btnRef}
        id={id}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label}: ${selected ? formatDisplay(selected) : hint}`}
        onClick={() => setOpen((v) => !v)}
        style={{ touchAction: "manipulation" }}
        className={[
          "w-full text-left flex flex-col gap-0.5 px-4 py-3.5 rounded-2xl border",
          "bg-white transition-all duration-200",
          open
            ? "border-[#6b7c4a] shadow-[0_0_0_3px_rgba(107,124,74,0.12)]"
            : "border-[#e2d9cc] hover:border-[#b5a99a] shadow-sm hover:shadow-md",
        ].join(" ")}
      >
        <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[#9a8a78]">
          {label}
        </span>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm font-medium truncate ${selected ? "text-[#2c2416]" : "text-[#b5a99a]"
              }`}
          >
            {selected ? formatDisplay(selected) : hint}
          </span>
          {selected ? (
            <span
              role="button"
              tabIndex={0}
              aria-label={`Borrar ${label}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleClear}
              onKeyDown={(e) => e.key === "Enter" && onClear()}
              className="shrink-0 p-0.5 rounded-full text-[#b5a99a] hover:text-[#2c2416] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          ) : (
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 text-[#b5a99a] transition-transform duration-200 ${open ? "rotate-180" : ""
                }`}
            />
          )}
        </div>
      </button>

      {/* ── Calendar panel ── */}
      {open && (
        <div
          id={panelId}
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={`Calendario para ${label}`}
          // ✅ NO overflow-hidden — it breaks iOS touch propagation
          // ✅ z-[9999] so it's above everything including the floating WA button
          style={{ top: "calc(100% + 8px)", touchAction: "manipulation" }}
          className="absolute z-[9999] left-1/2 -translate-x-1/2 w-[308px] bg-white border border-[#e2d9cc] rounded-2xl shadow-[0_8px_48px_rgba(44,36,22,0.14)]"
        >
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-3 pb-2 px-3 border-b border-[#f0e8dc]">
            <span className="flex items-center gap-1 text-[10px] text-[#9a8a78]">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6b7c4a]" />
              Disponible
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#9a8a78]">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#d4c9b8]" />
              Ocupado
            </span>
          </div>

          {/* ── DayPicker ── */}
          {/*
            Styling strategy:
            - We import the rdp default CSS (handles .rdp-disabled, .rdp-selected, etc.)
            - We override brand colors via CSS custom properties on .rdp-root
            - classNames is used ONLY for layout tweaks (padding, font size)
            - We do NOT use pointer-events-none on disabled cells (breaks iOS)
          */}
          <div className="p-3">
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
                // Only override non-layout classes — table sizing is via CSS vars
                caption_label: "rdp-caption_label rdp-coastal-caption",
                button_previous: "rdp-button_previous rdp-coastal-nav-btn",
                button_next: "rdp-button_next rdp-coastal-nav-btn",
              }}
            />
          </div>

          {/* Footer */}
          <div className="px-3 pb-3 pt-2 flex justify-end border-t border-[#f0e8dc]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ touchAction: "manipulation" }}
              className="text-xs font-medium text-[#6b7c4a] hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface CoastalAvailabilityProps {
  readonly className?: string;
}

export const CoastalAvailability: React.FC<CoastalAvailabilityProps> = ({
  className = "",
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

  const hasSelection = checkIn && checkOut;
  const nights = hasSelection ? nightCount(checkIn, checkOut) : 0;

  return (
    <>
      {/*
        ✅ Global CSS overrides for react-day-picker inside our wrapper.
        These use the ACTUAL rdp class names (.rdp-day_button, .rdp-disabled, etc.)
        so they work correctly and don't conflict with the default stylesheet.
        touch-action: manipulation is set on all interactive elements for iOS.
      */}
      <style>{`
        /* ── Brand color tokens ── */
        .rdp-coastal-root {
          --rdp-accent-color: #6b7c4a;
          --rdp-accent-background-color: #e8eedf;
          --rdp-today-color: #c8883a;
          --rdp-selected-border: 2px solid #6b7c4a;
          --rdp-disabled-opacity: 0.35;
          --rdp-outside-opacity: 0;
          /* Cell sizing — controls the table column widths */
          --rdp-day-width: 40px;
          --rdp-day-height: 40px;
          --rdp-day_button-width: 36px;
          --rdp-day_button-height: 36px;
          --rdp-nav-height: 36px;
          --rdp-nav_button-width: 32px;
          --rdp-nav_button-height: 32px;
        }

        /* ── Caption layout ── */
        .rdp-coastal-root .rdp-coastal-caption {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2c2416;
          text-transform: capitalize;
        }

        /* ── Weekday header — small caps ── */
        .rdp-coastal-root .rdp-weekday {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          color: #9a8a78;
          opacity: 1;
        }

        /* ── Available day hover ── */
        .rdp-coastal-root .rdp-day_button:not(:disabled):not([aria-disabled="true"]):hover {
          background-color: #f0ebe0;
        }

        /* ── Selected day ── */
        .rdp-coastal-root .rdp-selected .rdp-day_button {
          background-color: #6b7c4a;
          color: white;
          border-color: #6b7c4a;
        }
        .rdp-coastal-root .rdp-selected .rdp-day_button:hover {
          background-color: #5a6a3d;
        }

        /* ── Blocked / disabled days: strikethrough, faded, still tappable ── */
        .rdp-coastal-root .rdp-disabled {
          /* Do NOT set pointer-events:none on the td — kills iOS touch rows */
          opacity: var(--rdp-disabled-opacity);
        }
        .rdp-coastal-root .rdp-disabled .rdp-day_button {
          text-decoration: line-through;
          color: #9a8a78;
          cursor: not-allowed;
          pointer-events: none; /* safe on the button itself, not the td */
        }

        /* ── Nav button hover ── */
        .rdp-coastal-nav-btn:hover {
          background-color: #f5f0e8;
        }

        /* ── iOS touch fixes ── */
        .rdp-coastal-root .rdp-day_button,
        .rdp-coastal-root .rdp-button_previous,
        .rdp-coastal-root .rdp-button_next {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* Remove iOS button styling */
        .rdp-coastal-root button {
          -webkit-appearance: none;
          appearance: none;
        }
      `}</style>

      <section
        className={`bg-[#faf7f2] py-16 md:py-20 px-6 ${className}`}
        aria-label="Disponibilidad"
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
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

          {/* Two-input row */}
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

            {/* Arrow divider — desktop only */}
            <div className="hidden sm:flex items-center justify-center text-[#b5a99a] shrink-0 pt-5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
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

          {/* Hint after check-in is selected */}
          {checkIn && !checkOut && (
            <p className="mt-3 text-xs text-center text-[#9a8a78]">
              Ahora selecciona tu fecha de salida
            </p>
          )}

          {/* WhatsApp CTA */}
          {hasSelection && (
            <div className="mt-6">
              <div className="bg-white border border-[#e2d9cc] rounded-2xl p-5 text-center shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-medium">
                      Llegada
                    </p>
                    <p className="text-sm font-semibold text-[#2c2416]">
                      {formatDisplay(checkIn)}
                    </p>
                  </div>
                  <div className="text-[#b5a99a]">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-medium">
                      Salida
                    </p>
                    <p className="text-sm font-semibold text-[#2c2416]">
                      {formatDisplay(checkOut)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#9a8a78] mb-4">
                  {nights} {nights === 1 ? "noche" : "noches"} · Consulta sin
                  compromiso
                </p>

                <a
                  href={buildWhatsAppUrl(checkIn, checkOut)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="availability-whatsapp-cta"
                  style={{ touchAction: "manipulation" }}
                  className="inline-flex items-center gap-2.5 bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full justify-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" fill="currentColor" />
                  <span>Quiero quedarme aquí en estas fechas</span>
                </a>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-[#9a8a78]">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6b7c4a]" />
              Disponible
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#9a8a78]">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#d4c9b8]" />
              Ocupado
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#9a8a78]">
              <Calendar className="w-3 h-3" strokeWidth={1.5} />
              Toca cada campo para elegir
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoastalAvailability;
