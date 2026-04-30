"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, CheckCircle2, CalendarDays, ShieldCheck, Clock } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { toast } from "react-hot-toast";

import { SITE_CONTENT } from "@/config/site-content";
import { getPriceForDate, type SeasonalPricing } from "@/lib/pricingClient";
import { isValidStay, calculateNights, isRangeBlocked } from "@/lib/dateUtils";

// Simplified country logic - only used for reference if needed in future
const CHILE_PREFIX = "+56";
const CHILE_PHONE_LENGTH = 9;

const normalizePhone = (code: string, number: string) => {
  // Normalize prefix: ensure it starts with + and contains only digits
  let cleanCode = code.replace(/[^\d+]/g, "");
  if (cleanCode && !cleanCode.startsWith("+")) cleanCode = "+" + cleanCode;

  // Normalize number: digits only
  let cleanNumber = number.replace(/[^\d]/g, "");

  // Avoid duplicate prefixes (e.g. if user pasted +56 in the number field)
  const codeDigits = cleanCode.replace("+", "");
  if (codeDigits && cleanNumber.startsWith(codeDigits)) {
    cleanNumber = cleanNumber.substring(codeDigits.length);
  }

  // Format E.164: +[code][number]
  return `${cleanCode}${cleanNumber}`;
};

const formatVisualPhone = (value: string, prefix: string) => {
  const digits = value.replace(/[^\d]/g, "");
  if (prefix === CHILE_PREFIX) {
    // Formato Chile: 9 1234 5678
    if (digits.length === 0) return "";
    let res = digits.charAt(0);
    if (digits.length > 1) res += " " + digits.slice(1, 5);
    if (digits.length > 5) res += " " + digits.slice(5, 9);
    return res;
  }
  return digits;
};

const calendarStyles = `
  .rdp {
    --rdp-accent-color: #00628f;
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
    color: #991b1b !important;
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

const requestSchema = z.object({
  full_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  country_code: z.string().min(2, "El prefijo es obligatorio"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
  guests_count: z.string().refine(val => {
    const num = parseInt(val.split(" ")[0]);
    return num >= 1 && num <= 4;
  }, "La capacidad máxima es de 4 personas"),
  // Standard fields (optional in schema to support long-stay switch, but validated in superRefine)
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  trip_reason: z.string().min(10, "Cuéntanos un poco más (mín. 10 carac.)"),
  referred_by_name: z.string().min(2, "Ingresa el nombre de quién te recomendó"),
  referred_by_relation: z.string().min(1, "Selecciona tu relación"),
  rules_accepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar las reglas de la casa" }),
  }),
  // Long Stay fields
  estimated_start_date: z.string().optional(),
  flexible_dates: z.boolean().optional(),
  estimated_duration: z.string().optional(),
  stay_type: z.string().optional(),
  budget: z.string().optional(),
  amenities: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  // 1. Phone & Prefix Validation
  const prefix = data.country_code;
  const digits = data.phone.replace(/[^\d]/g, "");

  if (!prefix.startsWith("+") || prefix.length < 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Prefijo inválido", path: ["country_code"] });
  }

  if (prefix === CHILE_PREFIX) {
    if (digits.length !== CHILE_PHONE_LENGTH) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Debe tener ${CHILE_PHONE_LENGTH} dígitos`, path: ["phone"] });
    } else if (!digits.startsWith("9")) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe empezar con 9", path: ["phone"] });
    }
  }

  // 2. Intent-based Validation
  // We'll pass the intentMode to the validator if possible, but superRefine only sees 'data'.
  // We can't easily see intentMode here unless we put it in the form data.
  // For now, we'll handle conditional requirement in the onSubmit or via manual checks in UI.
  
  if (data.check_in && data.check_out) {
    const start = parseISO(data.check_in);
    const end = parseISO(data.check_out);
    if (end <= start) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Fecha inválida", path: ["check_out"] });
    } else if (!isValidStay(start, end)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: SITE_CONTENT.availability.labels.minStayWarning, path: ["check_out"] });
    }
  }
});


type RequestFormData = z.infer<typeof requestSchema>;

interface CoastalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDates?: { checkIn: Date; checkOut: Date } | null;
  intentMode?: 'standard' | 'long-stay';
}


export const CoastalRequestModal: React.FC<CoastalRequestModalProps> = ({
  isOpen,
  onClose,
  initialDates,
  intentMode = 'standard'
}) => {
  const [mounted, setMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [availabilityStatus, setAvailabilityStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [blockedDateStrings, setBlockedDateStrings] = useState<string[]>([]);
  const [seasonalPrices, setSeasonalPrices] = useState<SeasonalPricing[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [calculatedPricing, setCalculatedPricing] = useState<{ totalPrice: number, breakdown: any[] } | null>(null);
  const [activePicker, setActivePicker] = useState<'check_in' | 'check_out' | null>(null);

  // 1. Centralized Cleanup & Lifecycle Control
  useEffect(() => {
    // Force close calendar if modal closes, user submits, or initial dates change
    if (!isOpen || isSubmitted) {
      setActivePicker(null);
    }
  }, [isOpen, isSubmitted, initialDates]);

  // Handle Escape key and outside clicks for the calendar
  useEffect(() => {
    if (!activePicker) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePicker(null);
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If click is outside the calendar portal and not on the trigger button
      if (!target.closest('.calendar-portal-content') && !target.closest('.picker-trigger')) {
        setActivePicker(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Lock body scroll when calendar is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = originalStyle;
    };
  }, [activePicker]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    mode: "onChange",
    defaultValues: {
      guests_count: "2 Huéspedes",
      country_code: "+56",
      phone: "",
      referred_by_relation: "Amigo/a",
    }
  });

  const selectedCountryCode = watch("country_code");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsPreparing(true);
      const timer = setTimeout(() => {
        setIsPreparing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchAvailability = async () => {
    setAvailabilityStatus('loading');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`/api/public/availability?t=${Date.now()}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success && data.data) {
        setBlockedDateStrings(data.data.blockedDates || []);
        setAvailabilityStatus('success');
      } else {
        setAvailabilityStatus('error');
      }
    } catch (e: unknown) {
      clearTimeout(timeoutId);
      console.error('[CoastalRequestModal] fetchAvailability error:', e);
      setAvailabilityStatus('error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailability();

      // Fetch pricing data
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
      fetchPricing();
    }
  }, [isOpen]);

  const checkInValue = watch("check_in");
  const checkOutValue = watch("check_out");

  useEffect(() => {
    if (checkInValue && checkOutValue && basePrice > 0) {
      const start = parseISO(checkInValue);
      const end = parseISO(checkOutValue);
      const nightsCount = calculateNights(start, end);

      if (nightsCount > 0) {
        // Check for overlaps
        const isBlocked = isRangeBlocked(start, end, blockedDateStrings);
        if (isBlocked) {
          setCalculatedPricing(null);
          return;
        }

        let total = 0;
        const breakdown = [];
        const curr = new Date(start);
        for (let i = 0; i < nightsCount; i++) {
          const { price, seasonName } = getPriceForDate(curr, seasonalPrices, basePrice, holidays);
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
  }, [checkInValue, checkOutValue, seasonalPrices, basePrice]);

  useEffect(() => {
    if (isOpen && initialDates) {
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      setValue("check_in", formatDate(initialDates.checkIn), { shouldValidate: true });
      setValue("check_out", formatDate(initialDates.checkOut), { shouldValidate: true });
    }
  }, [isOpen, initialDates, setValue]);

  useEffect(() => {
    if (checkInValue && checkOutValue) {
      const inDate = parseISO(checkInValue);
      const outDate = parseISO(checkOutValue);
      if (outDate <= inDate) {
        setValue("check_out", "", { shouldValidate: true });
      }
    }
  }, [checkInValue, checkOutValue, setValue]);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return blockedDateStrings.includes(dateStr);
  };

  const isCheckOutDisabled = (date: Date) => {
    if (!checkInValue) return isDateDisabled(date);
    const checkInDate = parseISO(checkInValue);
    const minCheckout = new Date(checkInDate);
    minCheckout.setDate(minCheckout.getDate() + 2);
    if (date < minCheckout) return true;

    // Check range logic
    const current = new Date(checkInDate);
    current.setDate(current.getDate() + 1);
    while (current < date) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      if (blockedDateStrings.includes(dateStr)) return true;
      current.setDate(current.getDate() + 1);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return blockedDateStrings.includes(dateStr);
  };

  const onSubmit = async (data: RequestFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const finalPhone = normalizePhone(data.country_code, data.phone);
    const finalReferral = `${data.referred_by_name} (${data.referred_by_relation})`;

    try {
      // 1. Conditional Concurrency Check for Standard Mode
      if (intentMode === 'standard' && data.check_in && data.check_out) {
        if (!isValidStay(data.check_in, data.check_out)) {
          throw new Error(SITE_CONTENT.availability.labels.minStayWarning);
        }

        const resAvail = await fetch(`/api/public/availability?t=${Date.now()}`);
        const availability = await resAvail.json();

        if (availability.success && availability.data) {
          const currentBlocks = availability.data.blockedDates || [];
          const start = parseISO(data.check_in);
          const end = parseISO(data.check_out);
          const curr = new Date(start);
          while (curr <= end) {
            const year = curr.getFullYear();
            const month = String(curr.getMonth() + 1).padStart(2, '0');
            const day = String(curr.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            if (currentBlocks.includes(dateStr)) {
              throw new Error("Lo sentimos, las fechas que seleccionaste acaban de ser reservadas. Por favor, elige nuevas fechas.");
            }
            curr.setDate(curr.getDate() + 1);
          }
        }
      }

      // 2. Format Payload
      let formattedReason = data.trip_reason;
      if (intentMode === 'long-stay') {
        const amenitiesStr = data.amenities?.length ? `\n- Necesidades: ${data.amenities.join(', ')}` : '';
        formattedReason = `[LONG STAY LEAD]\n- Inicio: ${data.estimated_start_date || 'Flexible'}\n- Duración: ${data.estimated_duration || 'Flexible'}\n- Tipo: ${data.stay_type || 'N/A'}\n- Presupuesto: ${data.budget || 'N/A'}${amenitiesStr}\n- Mensaje: ${data.trip_reason}`;
      }

      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          phone: finalPhone,
          guests_count: parseInt(data.guests_count.split(" ")[0]) || 1,
          check_in: intentMode === 'standard' ? data.check_in : null,
          check_out: intentMode === 'standard' ? data.check_out : null,
          trip_reason: formattedReason,
          referred_by: finalReferral,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Error al procesar la solicitud");
      }

      setIsSubmitted(true);
      toast.success(intentMode === 'standard' ? "¡Solicitud enviada!" : "¡Propuesta solicitada!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("[CoastalRequestModal] Submission error:", message);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999999] flex items-start justify-center bg-black/70 backdrop-blur-md overflow-y-auto overscroll-none py-6 sm:py-12 px-0 sm:px-6">
      {/* Background overlay click to close */}
      <div
        onClick={onClose}
        className="fixed inset-0 cursor-default"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#faf7f2] sm:rounded-[40px] shadow-2xl min-h-full sm:min-h-0 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 text-[#6b5d4f] hover:text-[#2c2416] transition-colors p-3 z-20 rounded-full hover:bg-black/5"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="px-6 sm:px-12 pt-16 pb-12 sm:pt-20 sm:pb-16 flex-1">
          {!isSubmitted ? (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
              {isPreparing && (
                <div className="absolute inset-0 z-50 bg-[#faf7f2] flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500 rounded-[40px]">
                  <div className="w-12 h-12 border-4 border-[#e2d9cc] border-t-[#00628f] rounded-full animate-spin"></div>
                  <div className="space-y-3 text-center px-6">
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#2c2416] font-bold">Estamos preparando tu estadía...</h3>
                    <p className="text-[#6b5d4f] text-sm font-light font-sans-luxury">Verificando opciones frente al mar</p>
                  </div>
                </div>
              )}

              <div className="text-center mb-10">
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#2c2416] font-bold tracking-tight">
                  {intentMode === 'standard' ? 'Solicitar Estadía' : 'Propuesta Personalizada'}
                </h3>
                <p className="text-[#9a8a78] text-[10px] uppercase tracking-luxury mt-2 font-bold font-sans-luxury">
                  {intentMode === 'standard' ? 'Completa tus datos para postular' : 'Cuéntanos sobre tu estadía ideal'}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {submitError && (
                  <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl border border-red-100">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Nombre Completo</label>
                    <input {...register("full_name")} type="text" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-[#00628f] focus:ring-1 focus:ring-[#00628f] outline-none transition-all shadow-sm" />
                    {errors.full_name && <p className="text-[10px] text-red-500 ml-1">{errors.full_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Email</label>
                    <input {...register("email")} type="email" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-[#00628f] focus:ring-1 focus:ring-[#00628f] outline-none transition-all shadow-sm" />
                    {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Teléfono Móvil</label>
                    <div className="flex items-center gap-2 w-full">
                      <input
                        {...register("country_code")}
                        placeholder="+56"
                        maxLength={6}
                        onInput={(e) => {
                          let val = e.currentTarget.value;
                          if (val && !val.startsWith("+")) val = "+" + val;
                          e.currentTarget.value = "+" + val.replace(/[^\d]/g, "");
                        }}
                        className="w-[80px] flex-shrink-0 bg-white border border-[#e2d9cc] rounded-xl px-3 py-3.5 text-base sm:text-sm outline-none focus:border-[#00628f] shadow-sm"
                      />

                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder={selectedCountryCode === CHILE_PREFIX ? "9 1234 5678" : "Número"}
                        maxLength={selectedCountryCode === CHILE_PREFIX ? 11 : 15}
                        onInput={(e) => {
                          let val = e.currentTarget.value.replace(/[^\d]/g, "");
                          const prefixDigits = selectedCountryCode?.replace("+", "") || "";
                          if (prefixDigits && val.startsWith(prefixDigits) && val.length > prefixDigits.length) {
                            val = val.substring(prefixDigits.length);
                          }
                          const formatted = formatVisualPhone(val, selectedCountryCode);
                          e.currentTarget.value = formatted;
                          setValue("phone", formatted, { shouldValidate: true });
                        }}
                        className="flex-1 min-w-0 bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-[#00628f] focus:ring-1 focus:ring-[#00628f] outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Huéspedes</label>
                    <div className="relative">
                      <select {...register("guests_count")} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#00628f] shadow-sm appearance-none cursor-pointer">
                        <option value="1 Huésped">1 Huésped</option>
                        <option value="2 Huéspedes">2 Huéspedes</option>
                        <option value="3 Huéspedes">3 Huéspedes</option>
                        <option value="4 Huéspedes">4 Huéspedes (Capacidad Máx.)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9a8a78]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {intentMode === 'standard' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="absolute -top-6 right-1 flex items-center gap-1.5 bg-[#00628f]/5 px-2.5 py-1 rounded-full border border-[#00628f]/10">
                      <Clock className="w-3 h-3 text-[#00628f]" />
                      <span className="text-[8px] uppercase tracking-luxury font-bold font-sans-luxury text-[#00628f]">
                        Mínimo de estadía: 2 noches
                      </span>
                    </div>

                    {activePicker && mounted && createPortal(
                      <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] calendar-portal-content animate-in fade-in duration-200">
                        <div
                          className="bg-white border border-[#e2d9cc] rounded-[32px] shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 max-w-sm w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setActivePicker(null)}
                            className="absolute top-4 right-4 p-2 text-[#9a8a78] hover:text-[#2c2416] transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>

                          <div className="mb-6 text-center">
                            <h4 className="text-xl font-bold font-sans-luxury text-[#2c2416]">
                              {activePicker === 'check_in' ? 'Fecha de Llegada' : 'Fecha de Salida'}
                            </h4>
                          </div>

                          <style>{calendarStyles}</style>
                          <DayPicker
                            mode="single"
                            selected={activePicker === 'check_in'
                              ? (checkInValue ? parseISO(checkInValue) : undefined)
                              : (checkOutValue ? parseISO(checkOutValue) : undefined)
                            }
                            onSelect={(date) => {
                              if (!date) return;
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              const dateStr = `${year}-${month}-${day}`;

                              if (activePicker === 'check_in') {
                                setValue("check_in", dateStr, { shouldValidate: true });
                                const suggested = new Date(date);
                                suggested.setDate(suggested.getDate() + 2);
                                const sDateStr = `${suggested.getFullYear()}-${String(suggested.getMonth() + 1).padStart(2, '0')}-${String(suggested.getDate()).padStart(2, '0')}`;
                                if (!checkOutValue || parseISO(checkOutValue) < suggested) {
                                  setValue("check_out", sDateStr, { shouldValidate: true });
                                }
                              } else {
                                setValue("check_out", dateStr, { shouldValidate: true });
                              }
                              setActivePicker(null);
                            }}
                            disabled={activePicker === 'check_in' ? isDateDisabled : isCheckOutDisabled}
                            locale={es}
                            defaultMonth={activePicker === 'check_out' && checkInValue ? parseISO(checkInValue) : undefined}
                            footer={activePicker === 'check_out' && (
                              <p className="text-[10px] text-center text-[#9a8a78] mt-4 italic font-medium">
                                Estancia mínima de 2 noches
                              </p>
                            )}
                            components={{
                              DayButton: (props) => {
                                const { day, ...buttonProps } = props as any;
                                const { date } = day;
                                const { price, isSeasonal, isHoliday } = getPriceForDate(date, seasonalPrices || [], basePrice || 0, holidays || []);
                                const formatted = price >= 1000
                                  ? new Intl.NumberFormat('es-CL').format(Math.floor(price / 1000)) + 'k'
                                  : price;

                                return (
                                  <button {...buttonProps}>
                                    <div className="flex flex-col items-center justify-center w-full h-full pt-1">
                                      <span className="text-[10px] font-medium leading-none">{date.getDate()}</span>
                                      {price > 0 && (
                                        <span className={`text-[7px] mt-0.5 leading-none font-bold tracking-tighter ${isHoliday ? 'text-rose-500' : isSeasonal ? 'text-[#00628f]' : 'text-[#b5a99a]'}`}>
                                          ${formatted}
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              }
                            }}
                          />
                        </div>
                      </div>,
                      document.body
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Fecha Llegada</label>
                      <button
                        type="button"
                        onClick={() => setActivePicker('check_in')}
                        className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm text-left outline-none focus:border-[#00628f] shadow-sm flex items-center justify-between"
                      >
                        <span className={checkInValue ? "text-[#2c2416]" : "text-[#b5a99a]"}>
                          {checkInValue ? format(parseISO(checkInValue), "PPP", { locale: es }) : "Seleccionar"}
                        </span>
                        <CalendarDays className="w-4 h-4 text-[#9a8a78]" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Fecha Salida</label>
                      <button
                        type="button"
                        onClick={() => setActivePicker('check_out')}
                        className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm text-left outline-none focus:border-[#00628f] shadow-sm flex items-center justify-between"
                      >
                        <span className={checkOutValue ? "text-[#2c2416]" : "text-[#b5a99a]"}>
                          {checkOutValue ? format(parseISO(checkOutValue), "PPP", { locale: es }) : "Seleccionar"}
                        </span>
                        <CalendarDays className="w-4 h-4 text-[#9a8a78]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Fecha estimada llegada</label>
                        <input {...register("estimated_start_date")} type="date" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-[#00628f] outline-none shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Duración estimada</label>
                        <select {...register("estimated_duration")} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#00628f] shadow-sm appearance-none cursor-pointer">
                          <option value="2-4 semanas">2 a 4 semanas</option>
                          <option value="1 mes">1 mes</option>
                          <option value="2 meses">2 meses</option>
                          <option value="Más de 2 meses">Más de 2 meses</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Tipo de estadía</label>
                        <select {...register("stay_type")} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#00628f] shadow-sm appearance-none cursor-pointer">
                          <option value="Teletrabajo">Teletrabajo</option>
                          <option value="Vacaciones largas">Vacaciones largas</option>
                          <option value="Mudanza / transición">Mudanza / transición</option>
                          <option value="Trabajo temporal">Trabajo temporal</option>
                          <option value="Visita familiar">Visita familiar</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Presupuesto (opcional)</label>
                        <input {...register("budget")} type="text" placeholder="Ej: $1.200.000 / mes" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-[#00628f] outline-none shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1 block">Necesidades importantes</label>
                      <div className="flex flex-wrap gap-2">
                        {['Buen internet', 'Escritorio', 'Estacionamiento', 'Cocina equipada', 'Lavadora', 'Flexibilidad'].map((item) => {
                          const selected = watch("amenities") || [];
                          const isSelected = selected.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                const next = isSelected ? selected.filter(i => i !== item) : [...selected, item];
                                setValue("amenities", next, { shouldValidate: true });
                              }}
                              className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-luxury font-sans-luxury border transition-all duration-300 ${
                                isSelected ? 'bg-[#00628f] border-[#00628f] text-white shadow-lg shadow-[#00628f]/20' : 'bg-white border-[#e2d9cc] text-[#9a8a78] hover:border-[#00628f]/30'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#00628f]/5 rounded-2xl border border-[#00628f]/10">
                      <input {...register("flexible_dates")} type="checkbox" id="flexible_dates" className="w-4 h-4 rounded border-[#e2d9cc] text-[#00628f] focus:ring-[#00628f]" />
                      <label htmlFor="flexible_dates" className="text-xs text-[#00628f] font-medium cursor-pointer">Tengo flexibilidad en mis fechas</label>
                    </div>
                  </div>
                )}


                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Propósito del Viaje</label>
                  <textarea {...register("trip_reason")} placeholder="Cuéntanos un poco más sobre tu estadía..." className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#00628f] focus:ring-1 focus:ring-[#00628f] transition-all shadow-sm" rows={3}></textarea>
                  {errors.trip_reason && <p className="text-[10px] text-red-500 ml-1">{errors.trip_reason.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Recomendado por</label>
                    <input {...register("referred_by_name")} type="text" placeholder="Nombre" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#00628f] shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury ml-1">Relación</label>
                    <select {...register("referred_by_relation")} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#00628f] shadow-sm">
                      <option value="Amigo/a">Amigo/a</option>
                      <option value="Familiar">Familiar</option>
                      <option value="Pareja">Pareja</option>
                      <option value="Compañero/a de trabajo">Compañero/a de trabajo</option>
                      <option value="Otro cercano">Otro cercano</option>
                    </select>
                  </div>
                </div>

                {calculatedPricing && (
                  <div className="bg-white border border-[#e2d9cc] rounded-3xl p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between border-b border-[#e2d9cc]/30 pb-4">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury text-[#2c2416]">Resumen de Estancia</h4>
                        <p className="text-[9px] text-[#9a8a78] uppercase tracking-luxury font-medium font-sans-luxury mt-0.5">Valores finales por noche</p>
                      </div>
                      <span className="bg-[#00628f]/10 text-[#00628f] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-luxury font-sans-luxury border border-[#00628f]/20">
                        {calculatedPricing.breakdown.length} noches
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[160px] overflow-y-auto pr-4 custom-scrollbar">
                      {calculatedPricing.breakdown.map((day, idx) => (
                        <div key={idx} className="flex justify-between items-center group">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#6b5d4f] font-light">
                              {format(parseISO(day.date), "eee d MMM", { locale: es })}
                            </span>
                            {day.seasonName && (
                              <span className="text-[8px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter border border-amber-100/50">
                                {day.seasonName}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold font-sans-luxury text-[#2c2416] group-hover:text-[#00628f] transition-colors">
                            ${new Intl.NumberFormat('es-CL').format(day.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-end pt-5 border-t border-[#00628f]/10">
                      <div className="space-y-0.5">
                        <span className="block text-[9px] uppercase tracking-widest text-[#9a8a78] font-bold">Total Estimado</span>
                        <span className="text-xs text-[#6b5d4f] font-light italic">Sujeto a confirmación</span>
                      </div>
                      <span className="text-3xl font-bold font-sans-luxury text-[#00628f] leading-none tracking-tight">
                        ${new Intl.NumberFormat('es-CL').format(calculatedPricing.totalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 bg-white/50 border border-[#e2d9cc] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-[#00628f]" />
                    <h4 className="text-xs uppercase tracking-luxury font-bold font-sans-luxury text-[#2c2416]">Reglas de la Casa</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {SITE_CONTENT.site.houseRules.map((rule, idx) => (
                      <li key={idx} className="flex gap-3 text-xs text-[#6b5d4f] leading-relaxed">
                        <span className="text-[#00628f] mt-0.5">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-[#e2d9cc] mt-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          {...register("rules_accepted")}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-[#e2d9cc] rounded-md transition-all group-hover:border-[#00628f] peer-checked:bg-[#00628f] peer-checked:border-[#00628f]"></div>
                        <CheckCircle2 className="absolute inset-0 w-5 h-5 text-white scale-0 transition-transform peer-checked:scale-75" />
                      </div>
                      <span className="text-xs text-[#2c2416] font-medium select-none">
                        Acepto las reglas de la casa y confirmo el motivo de mi viaje.
                      </span>
                    </label>
                    {errors.rules_accepted && <p className="text-[10px] text-red-500 mt-1 ml-8">{errors.rules_accepted.message}</p>}
                  </div>
                </div>

                {/* Recordatorio de Horarios */}
                <div className="bg-[#00628f]/[0.03] border border-[#00628f]/10 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#00628f] shadow-sm border border-[#00628f]/5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-luxury font-bold font-sans-luxury text-[#00628f]/80">Horarios de estadía</h4>
                    <p className="text-xs text-[#2c2416] font-bold mt-0.5 font-sans-luxury">
                      {SITE_CONTENT.availability.labels.stayHours}
                    </p>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="w-full py-4 bg-gradient-to-br from-[#00628f] to-[#007cb3] text-white rounded-full font-semibold uppercase tracking-[-0.01em] text-[12px] transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? "Procesando solicitud..." : (intentMode === 'standard' ? "Enviar Postulación" : "Solicitar Propuesta")}
                  </button>

                  <p className="mt-4 text-[9px] text-center text-[#9a8a78] uppercase tracking-luxury font-medium font-sans-luxury leading-relaxed">
                    * Cada reserva es revisada personalmente, cuidando cada detalle <br />para que vivas una experiencia relajada, exclusiva y frente al mar.
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-[#00628f]/10 rounded-full flex items-center justify-center text-[#00628f] mb-2 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl font-bold text-[#2c2416] font-serif-luxury">¡Solicitud Recibida!</h3>
                <p className="text-[#6b5d4f] text-sm font-light max-w-sm mx-auto leading-relaxed">
                  Gracias por tu interés en Playa La Serena. Revisaré personalmente tu solicitud y te contactaré a la brevedad. Recuerda revisar también tu bandeja de correo no deseado o spam por si mi respuesta llega allí.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-10 py-3 border border-[#00628f] text-[11px] uppercase tracking-luxury font-bold font-sans-luxury text-[#00628f] rounded-full hover:bg-[#00628f] hover:text-white transition-all active:scale-95"
              >
                Cerrar Ventana
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
