"use client";

// HeroDatePicker.tsx
// Lightweight date-range picker embedded in the Hero section.
// Uses react-day-picker v9 (range mode) — no extra dependencies beyond date-fns.
// Pops as a bottom sheet on mobile / floating panel on desktop.

import { useState, useEffect, useRef, useCallback } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { format, differenceInCalendarDays } from "date-fns";
import { CalendarDays, MessageCircle, X, ChevronDown } from "lucide-react";
import { availabilityData, siteConfig } from "@/data/mockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatShort(date: Date) {
  return format(date, "d MMM", { locale: es });
}

function buildWhatsAppUrl(range: DateRange): string {
  const start = format(range.from!, "d 'de' MMMM", { locale: es });
  const end = format(range.to!, "d 'de' MMMM", { locale: es });
  const nights = differenceInCalendarDays(range.to!, range.from!);

  const msg =
    `Hola! Me gustaría quedarme en el departamento en La Serena.\n` +
    `📅 Fechas: ${start} al ${end} (${nights} ${nights === 1 ? "noche" : "noches"}).\n` +
    `¿Está disponible?`;

  const phone = siteConfig.whatsappUrl.match(/wa\.me\/([^?]+)/)?.[1] ?? "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroDatePicker() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const panelRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build a Set of blocked dates for the disabled prop
  const disabledDays = availabilityData.blockedDates.map((s) => new Date(s + "T00:00:00"));

  // Close on outside click / ESC
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
    };
  }, [open]);

  // Derived state
  const hasRange = !!(range?.from && range?.to);
  const hasStart = !!range?.from;
  const waUrl = hasRange ? buildWhatsAppUrl(range as Required<DateRange>) : null;

  const inputLabel = hasRange
    ? `${formatShort(range!.from!)} → ${formatShort(range!.to!)}`
    : hasStart
      ? `${formatShort(range!.from!)} → elige salida`
      : "Elige tus fechas";

  const handleReset = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setRange(undefined);
  }, []);

  return (
    <>
      {/* ── Trigger area ──────────────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-sm mx-auto">

        {/* Nudge copy */}
        <p className="text-white/75 text-xs tracking-wide font-light text-center">
          👉 Elige tus fechas y revisamos disponibilidad contigo al instante
        </p>

        {/* Date input trigger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ touchAction: "manipulation" }}
          className="relative flex items-center gap-3 w-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white rounded-full px-5 py-3.5 transition-all duration-200 group"
        >
          <CalendarDays className="w-4 h-4 text-white/70 flex-shrink-0" />
          <span className={`flex-1 text-left text-sm ${hasStart ? "text-white font-medium" : "text-white/60"}`}>
            {inputLabel}
          </span>
          {hasStart ? (
            <X
              className="w-4 h-4 text-white/60 hover:text-white flex-shrink-0"
              onClick={handleReset}
            />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/50 flex-shrink-0 group-hover:text-white/70 transition-colors" />
          )}
        </button>

        {/* WhatsApp CTA — only shown when full range is selected */}
        {hasRange && waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ touchAction: "manipulation" }}
            className="flex items-center justify-center gap-2.5 w-full bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-black/20"
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" fill="currentColor" />
            <span>Quiero quedarme aquí en estas fechas</span>
          </a>
        )}
      </div>

      {/* ── Calendar popover ──────────────────────────────────────────────────── */}
      {open && (
        <>
          {/* Backdrop — full screen on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            aria-hidden
          />

          {/* Panel — bottom sheet on mobile, centered float on desktop */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal
            aria-label="Selecciona las fechas de tu estadía"
            className={[
              "fixed z-50 bg-[#faf7f2] shadow-2xl",
              // Mobile: full-width bottom sheet
              "bottom-0 left-0 right-0 rounded-t-3xl px-4 pt-5 pb-8",
              // Desktop: floating card centered
              "md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
              "md:w-auto md:rounded-2xl md:px-6 md:pt-5 md:pb-6",
            ].join(" ")}
          >
            {/* Handle bar — visual affordance for mobile swipe */}
            <div className="flex justify-center mb-4 md:hidden">
              <div className="w-10 h-1 rounded-full bg-[#d0c8bc]" />
            </div>

            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#2c2416] font-medium text-sm">
                  {hasRange
                    ? `${formatShort(range!.from!)} → ${formatShort(range!.to!)}`
                    : hasStart
                      ? `Desde ${formatShort(range!.from!)} — elige salida`
                      : "¿Cuándo quieres venir?"}
                </p>
                {hasRange && (
                  <p className="text-[#8a7a6a] text-xs mt-0.5">
                    {differenceInCalendarDays(range!.to!, range!.from!)}{" "}
                    {differenceInCalendarDays(range!.to!, range!.from!) === 1 ? "noche" : "noches"}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ touchAction: "manipulation" }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f0e8dc] text-[#6b5d4f] hover:bg-[#e2d9cc] transition-colors"
                aria-label="Cerrar calendario"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* react-day-picker calendar */}
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              locale={es}
              disabled={[{ before: today }, ...disabledDays]}
              numberOfMonths={1}
              showOutsideDays={false}
              className="rdp-coastal"
            />

            {/* Action buttons */}
            <div className="mt-4 flex flex-col gap-2">
              {hasRange && waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  style={{ touchAction: "manipulation" }}
                  className="flex items-center justify-center gap-2.5 w-full bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-sm px-6 py-4 rounded-full transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" fill="currentColor" />
                  Quiero quedarme aquí en estas fechas
                </a>
              ) : (
                <p className="text-center text-[#8a7a6a] text-xs">
                  {hasStart ? "Ahora selecciona tu fecha de salida" : "Toca el día de llegada para comenzar"}
                </p>
              )}

              {hasRange && (
                <button
                  type="button"
                  onClick={() => setRange(undefined)}
                  style={{ touchAction: "manipulation" }}
                  className="text-center text-[#9a8a78] text-xs underline underline-offset-2 hover:text-[#6b5d4f] py-1"
                >
                  Cambiar fechas
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Styles for react-day-picker matching coastal design ──────────────── */}
      <style>{`
        .rdp-coastal {
          --rdp-accent-color: #6b7c4a;
          --rdp-accent-background-color: #eef3e8;
          --rdp-range-start-color: #fff;
          --rdp-range-start-background: #6b7c4a;
          --rdp-range-end-color: #fff;
          --rdp-range-end-background: #6b7c4a;
          --rdp-range-middle-background-color: #d8ebc8;
          --rdp-range-middle-color: #4a6030;
          --rdp-disabled-opacity: 0.3;
          font-family: inherit;
          width: 100%;
        }
        /* Make cells large enough to tap on mobile */
        .rdp-coastal .rdp-day {
          width: 44px;
          height: 44px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .rdp-coastal .rdp-weekday {
          width: 44px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #9a8a78;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .rdp-coastal .rdp-month_caption {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2c2416;
          padding-bottom: 8px;
        }
        .rdp-coastal .rdp-nav button {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          color: #6b5d4f;
        }
        .rdp-coastal .rdp-nav button:hover {
          background-color: #f0e8dc;
        }
        .rdp-coastal .rdp-day_button {
          width: 44px;
          height: 44px;
          border-radius: 0.5rem;
          touch-action: manipulation;
          font-weight: 500;
          color: #4a6030;
          background-color: #eef3e8;
        }
        .rdp-coastal .rdp-day_button:hover:not(:disabled) {
          background-color: #c5ddb0;
        }
        .rdp-coastal .rdp-selected .rdp-day_button,
        .rdp-coastal .rdp-range_start .rdp-day_button,
        .rdp-coastal .rdp-range_end .rdp-day_button {
          background-color: #6b7c4a;
          color: #fff;
          border-radius: 0.5rem;
        }
        .rdp-coastal .rdp-range_middle .rdp-day_button {
          background-color: #d8ebc8;
          color: #4a6030;
          border-radius: 0;
        }
        .rdp-coastal .rdp-range_start .rdp-day_button {
          border-radius: 0.5rem 0 0 0.5rem;
        }
        .rdp-coastal .rdp-range_end .rdp-day_button {
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .rdp-coastal .rdp-disabled .rdp-day_button {
          background-color: #fdf0f0;
          color: #c07070;
        }
        .rdp-coastal .rdp-today .rdp-day_button {
          outline: 2px solid #6b7c4a;
          outline-offset: 1px;
        }
        /* Mobile: make it fill width nicely */
        @media (max-width: 767px) {
          .rdp-coastal {
            width: 100%;
          }
          .rdp-coastal .rdp-month_grid {
            width: 100%;
          }
          .rdp-coastal .rdp-day,
          .rdp-coastal .rdp-weekday {
            width: calc((100vw - 64px) / 7);
          }
          .rdp-coastal .rdp-day_button {
            width: 100%;
            height: 44px;
          }
        }
      `}</style>
    </>
  );
}

export default HeroDatePicker;
