"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import { availabilityData, siteConfig } from "@/data/mockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ymd(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function localDate(year: number, month: number, day: number) {
  return new Date(year, month, day);
}

function fmt(date: Date) {
  return date.toLocaleDateString("es-CL", { day: "numeric", month: "long" });
}

function firstDayOffset(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday-first
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DAYS = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | { tag: "idle" }
  | { tag: "start"; start: Date }
  | { tag: "done"; start: Date; end: Date };

// ─── Component ────────────────────────────────────────────────────────────────

export function CoastalAvailability({ className = "" }: { className?: string }) {
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [phase, setPhase] = useState<Phase>({ tag: "idle" });

  // Set today on client only — avoids SSR/client date mismatch
  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setToday(d);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }, []);

  const blocked = useMemo(() => new Set(availabilityData.blockedDates), []);

  // ── Navigation ──────────────────────────────────────────────────────────────

  const canPrev = today
    ? view.year > today.getFullYear() || view.month > today.getMonth()
    : false;

  function goPrev() {
    if (!canPrev) return;
    setView(v => v.month === 0
      ? { year: v.year - 1, month: 11 }
      : { year: v.year, month: v.month - 1 }
    );
  }

  function goNext() {
    setView(v => v.month === 11
      ? { year: v.year + 1, month: 0 }
      : { year: v.year, month: v.month + 1 }
    );
  }

  // ── Date helpers ────────────────────────────────────────────────────────────

  function isPast(y: number, m: number, d: number) {
    if (!today) return false; // render all as available before hydration
    return localDate(y, m, d).getTime() < today.getTime();
  }

  function isBlocked(y: number, m: number, d: number) {
    return blocked.has(ymd(y, m, d));
  }

  function rangeHasBlocked(start: Date, end: Date) {
    const cur = new Date(start);
    cur.setDate(cur.getDate() + 1);
    while (cur.getTime() < end.getTime()) {
      if (blocked.has(ymd(cur.getFullYear(), cur.getMonth(), cur.getDate()))) return true;
      cur.setDate(cur.getDate() + 1);
    }
    return false;
  }

  // ── Click handler — no disabled on buttons, logic handled here ──────────────

  const handleDay = useCallback(
    (y: number, m: number, d: number) => {
      if (isPast(y, m, d) || isBlocked(y, m, d)) return;

      const tapped = localDate(y, m, d);

      if (phase.tag === "idle" || phase.tag === "done") {
        setPhase({ tag: "start", start: tapped });
        return;
      }

      if (tapped.getTime() === phase.start.getTime()) {
        setPhase({ tag: "idle" });
        return;
      }

      const [s, e] = tapped > phase.start
        ? [phase.start, tapped]
        : [tapped, phase.start];

      if (rangeHasBlocked(s, e)) {
        setPhase({ tag: "start", start: tapped });
        return;
      }

      setPhase({ tag: "done", start: s, end: e });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, today]
  );

  // ── WhatsApp URL ────────────────────────────────────────────────────────────

  const waUrl = useMemo(() => {
    if (phase.tag !== "done") return null;
    const nights = Math.round(
      (phase.end.getTime() - phase.start.getTime()) / 86_400_000
    );
    const msg =
      `Hola! Me interesa reservar el departamento en La Serena.\n` +
      `📅 Fechas: ${fmt(phase.start)} al ${fmt(phase.end)} (${nights} ${nights === 1 ? "noche" : "noches"}).\n` +
      `¿Está disponible?`;
    const phone = siteConfig.whatsappUrl.match(/wa\.me\/([^?]+)/)?.[1] ?? "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }, [phase]);

  // ── Day visual state ────────────────────────────────────────────────────────

  function dayRole(y: number, m: number, d: number) {
    if (isPast(y, m, d)) return "past";
    if (isBlocked(y, m, d)) return "blocked";

    const t = localDate(y, m, d).getTime();

    if (phase.tag === "start" && t === phase.start.getTime()) return "start";

    if (phase.tag === "done") {
      if (t === phase.start.getTime()) return "start";
      if (t === phase.end.getTime()) return "end";
      if (t > phase.start.getTime() && t < phase.end.getTime()) return "range";
    }

    if (today && d === today.getDate() && m === today.getMonth() && y === today.getFullYear()) {
      return "today";
    }

    return "free";
  }

  // ── Cell styles ─────────────────────────────────────────────────────────────

  const roleCls: Record<string, string> = {
    past:    "text-[#ccc] line-through cursor-default",
    blocked: "bg-[#fdf0f0] text-[#c07070] cursor-default",
    start:   "bg-[#6b7c4a] text-white cursor-pointer rounded-l-full",
    end:     "bg-[#6b7c4a] text-white cursor-pointer rounded-r-full",
    range:   "bg-[#d8ebc8] text-[#4a6030] cursor-pointer rounded-none",
    today:   "bg-[#eef3e8] text-[#4a6030] cursor-pointer ring-2 ring-[#6b7c4a] ring-offset-1",
    free:    "bg-[#eef3e8] text-[#4a6030] cursor-pointer",
  };

  // ── Render grid ─────────────────────────────────────────────────────────────

  function renderGrid() {
    const offset = firstDayOffset(view.year, view.month);
    const days   = daysInMonth(view.year, view.month);
    const cells  = [];

    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`e${i}`} aria-hidden />);
    }

    for (let day = 1; day <= days; day++) {
      const role = dayRole(view.year, view.month, day);

      cells.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDay(view.year, view.month, day)}
          aria-label={`${day} de ${MONTHS[view.month]}`}
          aria-pressed={role === "start" || role === "end" || role === "range"}
          className={[
            "flex items-center justify-center w-full rounded-lg text-sm font-medium min-h-[44px]",
            roleCls[role] ?? "bg-[#eef3e8] text-[#4a6030]",
          ].join(" ")}
          style={{ touchAction: "manipulation" }}
        >
          {day}
        </button>
      );
    }

    return cells;
  }

  // ── Render summary ──────────────────────────────────────────────────────────

  function renderSummary() {
    if (phase.tag === "idle") {
      return (
        <p className="text-[#8a7a6a] text-sm text-center w-full">
          Toca una fecha para comenzar
        </p>
      );
    }

    if (phase.tag === "start") {
      return (
        <div className="flex items-center justify-between w-full gap-2">
          <p className="text-[#2c2416] text-sm">
            <span className="font-medium">Desde:</span> {fmt(phase.start)}
          </p>
          <button
            type="button"
            onClick={() => setPhase({ tag: "idle" })}
            className="p-1.5 text-[#9a8a78] hover:text-[#6b5d4f]"
            style={{ touchAction: "manipulation" }}
            aria-label="Cancelar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    const nights = Math.round(
      (phase.end.getTime() - phase.start.getTime()) / 86_400_000
    );
    return (
      <div className="flex items-start justify-between w-full gap-2">
        <div>
          <p className="text-[#2c2416] text-sm font-medium">
            {fmt(phase.start)} → {fmt(phase.end)}
          </p>
          <p className="text-[#8a7a6a] text-xs mt-0.5">
            {nights} {nights === 1 ? "noche" : "noches"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPhase({ tag: "idle" })}
          className="p-1.5 text-[#9a8a78] hover:text-[#6b5d4f] flex-shrink-0"
          style={{ touchAction: "manipulation" }}
          aria-label="Cambiar fechas"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <section className={`bg-[#faf7f2] py-14 md:py-16 px-4 border-t border-[#e2d9cc] ${className}`}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className="text-2xl md:text-3xl font-serif font-normal text-[#2c2416] mb-2"
            style={{ fontFamily: "var(--font-newsreader), 'Georgia', serif" }}
          >
            {availabilityData.title}
          </h2>
          <p className="text-[#8a7a6a] text-sm font-light">{availabilityData.subtitle}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mb-6 text-xs text-[#6b5d4f]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#eef3e8] border border-[#c8dbb0]" />
            Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#6b7c4a]" />
            Seleccionado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#fdf0f0] border border-[#f0c0c0]" />
            Ocupado
          </span>
        </div>

        {/* Calendar card — NO overflow-hidden (blocks iOS touch events) */}
        <div className="bg-white rounded-2xl border border-[#e2d9cc] shadow-sm">

          {/* Month nav */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0e8dc]">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label="Mes anterior"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f5f0e8] disabled:opacity-30 transition-colors"
              style={{ touchAction: "manipulation" }}
            >
              <ChevronLeft className="w-5 h-5 text-[#6b5d4f]" />
            </button>

            <span
              suppressHydrationWarning
              className="font-medium text-[#2c2416] text-sm"
            >
              {MONTHS[view.month]} {view.year}
            </span>

            <button
              type="button"
              onClick={goNext}
              aria-label="Mes siguiente"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f5f0e8] transition-colors"
              style={{ touchAction: "manipulation" }}
            >
              <ChevronRight className="w-5 h-5 text-[#6b5d4f]" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-[#9a8a78] uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid — always rendered, no spinner gate */}
          <div className="grid grid-cols-7 gap-0.5 px-3 pb-4 min-h-[280px]">
            {renderGrid()}
          </div>

          {/* Selection summary */}
          <div className="px-5 py-4 border-t border-[#f0e8dc] min-h-[60px] flex items-center">
            {renderSummary()}
          </div>
        </div>

        {/* WhatsApp CTA */}
        {phase.tag === "done" && waUrl ? (
          <div className="mt-6">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#6b7c4a] hover:bg-[#5a6a3d] text-white font-medium text-sm px-6 py-4 rounded-full shadow-md transition-colors"
              style={{ touchAction: "manipulation" }}
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0" fill="currentColor" />
              Consultar estas fechas por WhatsApp
            </a>
            <p className="text-center text-[#9a8a78] text-xs mt-3">
              Sin formularios. Respuesta directa del anfitrión.
            </p>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#6b7c4a] hover:underline text-sm"
              style={{ touchAction: "manipulation" }}
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              {availabilityData.ctaText}
            </a>
          </div>
        )}

      </div>
    </section>
  );
}

export default CoastalAvailability;
