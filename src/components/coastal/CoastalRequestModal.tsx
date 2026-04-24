"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, CheckCircle2, CalendarDays, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";

import { supabasePublic } from "@/lib/supabase";
import { siteConfig } from "@/data/mockData";

const countries = [
  { name: "Chile", code: "+56", flag: "🇨🇱", placeholder: "9 1234 5678", pattern: /^9\d{8}$/, error: "Formato: 9 XXXX XXXX" },
  { name: "Argentina", code: "+54", flag: "🇦🇷", placeholder: "9 11 1234-5678", pattern: /^\d{10,11}$/, error: "Número inválido" },
  { name: "España", code: "+34", flag: "🇪🇸", placeholder: "600 000 000", pattern: /^[67]\d{8}$/, error: "Número inválido" },
  { name: "Estados Unidos", code: "+1", flag: "🇺🇸", placeholder: "(555) 000-0000", pattern: /^\d{10}$/, error: "Número inválido" },
  { name: "Perú", code: "+51", flag: "🇵🇪", placeholder: "900 000 000", pattern: /^9\d{8}$/, error: "Número inválido" },
  { name: "Colombia", code: "+57", flag: "🇨🇴", placeholder: "300 000 0000", pattern: /^3\d{9}$/, error: "Número inválido" },
  { name: "Brasil", code: "+55", flag: "🇧🇷", placeholder: "11 90000-0000", pattern: /^\d{10,11}$/, error: "Número inválido" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾", placeholder: "090 000 000", pattern: /^09\d{7}$/, error: "Número inválido" },
  { name: "Otro", code: "+", flag: "🌐", placeholder: "Prefijo + Número", pattern: /^\d{7,15}$/, error: "Número inválido" },
];

const normalizePhone = (code: string, number: string) => {
  const cleaned = number.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (code === "+56" && cleaned.length === 9 && cleaned.startsWith("9")) {
    return `+56${cleaned}`;
  }
  const prefix = code.startsWith("+") ? code : `+${code}`;
  return `${prefix}${cleaned}`;
};

const calendarStyles = `
  .rdp {
    --rdp-cell-size: 38px;
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
  country_code: z.string(),
  phone: z.string(),
  guests_count: z.string().refine(val => {
    const num = parseInt(val.split(" ")[0]);
    return num >= 1 && num <= 4;
  }, "La capacidad máxima es de 4 personas"),
  check_in: z.string().min(1, "La fecha de llegada es obligatoria"),
  check_out: z.string().min(1, "La fecha de salida es obligatoria"),
  trip_reason: z.string().min(10, "Cuéntanos un poco más sobre tu viaje (mín. 10 carac.)"),
  referred_by_name: z.string().min(2, "Ingresa el nombre de quién te recomendó"),
  referred_by_relation: z.string().min(1, "Selecciona tu relación"),
  rules_accepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar las reglas de la casa" }),
  }),
}).superRefine((data, ctx) => {
  // 1. Phone Validation
  const country = countries.find(c => c.code === data.country_code);
  if (country) {
    const cleaned = data.phone.replace(/[^\d]/g, "");
    if (!country.pattern.test(cleaned)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: country.error,
        path: ["phone"],
      });
    }
  }

  // 2. Dates Validation
  if (data.check_in && data.check_out) {
    if (new Date(data.check_out) <= new Date(data.check_in)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de salida debe ser posterior a la de llegada",
        path: ["check_out"],
      });
    }
  }
});

type RequestFormData = z.infer<typeof requestSchema>;

interface CoastalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDates?: { checkIn: Date; checkOut: Date } | null;
}

export const CoastalRequestModal: React.FC<CoastalRequestModalProps> = ({ 
  isOpen, 
  onClose,
  initialDates 
}) => {
  const [mounted, setMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [blockedDateStrings, setBlockedDateStrings] = useState<string[]>([]);
  const [activePicker, setActivePicker] = useState<'check_in' | 'check_out' | null>(null);

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
      referred_by_relation: "Amigo/a",
    }
  });

  const selectedCountryCode = watch("country_code");
  const selectedCountry = countries.find(c => c.code === selectedCountryCode) || countries[countries.length - 1];

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
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error('[CoastalRequestModal] fetchAvailability error:', e);
      setAvailabilityStatus('error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailability();
    }
  }, [isOpen]);

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

  const checkInValue = watch("check_in");
  const checkOutValue = watch("check_out");

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
    if (date <= checkInDate) return true;
    
    // Check range logic
    let current = new Date(checkInDate);
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
      // 1. Concurrency Check (Server-side re-validation)
      // We check if any of the selected dates are blocked
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`/api/public/availability?t=${Date.now()}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const availability = await res.json();
      
      if (availability.success && availability.data) {
        const currentBlocks = availability.data.blockedDates || [];
        
        // Generate range of dates to check
        const start = parseISO(data.check_in);
        const end = parseISO(data.check_out);
        let curr = new Date(start);
        const datesToRequest: string[] = [];
        while (curr <= end) {
          const year = curr.getFullYear();
          const month = String(curr.getMonth() + 1).padStart(2, '0');
          const day = String(curr.getDate()).padStart(2, '0');
          datesToRequest.push(`${year}-${month}-${day}`);
          curr.setDate(curr.getDate() + 1);
        }

        const isConflict = datesToRequest.some(d => currentBlocks.includes(d));
        if (isConflict) {
          setSubmitError("Lo sentimos, las fechas que seleccionaste acaban de ser reservadas. Por favor, elige nuevas fechas.");
          fetchAvailability(); // Refresh calendar
          return;
        }
      }

      // 2. Anti-Fiesta Scoring (Scoring Logic)
      const keywords = ["fiesta", "cumpleaños", "carrete", "celebración", "evento", "despedida", "juntada", "party", "reunión"];
      const reasonLower = data.trip_reason.toLowerCase();
      let riskScore = "Bajo";
      
      const hasKeywords = keywords.some(k => reasonLower.includes(k));
      if (hasKeywords) {
        riskScore = "Alto";
      } else if (data.trip_reason.length < 20) {
        riskScore = "Medio";
      }

      // 3. Insert into Supabase
      const { error: supabaseError } = await supabasePublic
        .from("booking_requests")
        .insert([{
          full_name: data.full_name,
          email: data.email,
          phone: finalPhone,
          guests_count: parseInt(data.guests_count.split(" ")[0]) || 4,
          check_in: data.check_in,
          check_out: data.check_out,
          trip_reason: data.trip_reason,
          referred_by: finalReferral,
          status: "pending",
          risk_score: riskScore,
          rules_accepted: true
        }]);

      if (supabaseError) throw supabaseError;
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("[CoastalRequestModal] Submission error:", message);
      setSubmitError("Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.");
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
            isPreparing ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500 min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#e2d9cc] border-t-[#6b7c4a] rounded-full animate-spin"></div>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#2c2416] italic">Estamos preparando tu estadía...</h3>
                  <p className="text-[#6b5d4f] text-sm font-light">Verificando opciones frente al mar</p>
                </div>
              </div>
            ) : (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h3 className="font-serif text-3xl sm:text-4xl text-[#2c2416] italic tracking-tight">Solicitar Estadía</h3>
                <p className="text-[#9a8a78] text-[10px] uppercase tracking-widest mt-2 font-bold">Completa tus datos para postular</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {submitError && (
                  <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl border border-red-100">
                    {submitError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Nombre Completo</label>
                    <input {...register("full_name")} type="text" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" />
                    {errors.full_name && <p className="text-[10px] text-red-500 ml-1">{errors.full_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Email</label>
                    <input {...register("email")} type="email" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" />
                    {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Teléfono Móvil</label>
                    <div className="flex gap-2">
                      <select {...register("country_code")} className="bg-white border border-[#e2d9cc] rounded-xl px-3 py-3.5 text-base sm:text-sm outline-none focus:border-[#6b7c4a] min-w-[90px]">
                        {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                      </select>
                      <input {...register("phone")} type="tel" placeholder={selectedCountry.placeholder} className="flex-1 min-w-0 bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" />
                    </div>
                    {errors.phone && <p className="text-[10px] text-red-500 ml-1">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Huéspedes</label>
                    <div className="relative">
                      <select {...register("guests_count")} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#6b7c4a] shadow-sm appearance-none cursor-pointer">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Fecha Llegada</label>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setActivePicker(activePicker === 'check_in' ? null : 'check_in')}
                        className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm text-left outline-none focus:border-[#6b7c4a] shadow-sm flex items-center justify-between"
                      >
                        <span className={checkInValue ? "text-[#2c2416]" : "text-[#b5a99a]"}>
                          {checkInValue ? format(parseISO(checkInValue), "PPP", { locale: es }) : "Seleccionar fecha"}
                        </span>
                        <CalendarDays className="w-4 h-4 text-[#9a8a78]" />
                      </button>
                      {activePicker === 'check_in' && (
                        <div className="absolute top-full left-0 mt-2 z-[50] bg-white border border-[#e2d9cc] rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                          <style>{calendarStyles}</style>
                          <DayPicker
                            mode="single"
                            selected={checkInValue ? parseISO(checkInValue) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                setValue("check_in", `${year}-${month}-${day}`, { shouldValidate: true });
                                setActivePicker(null);
                              }
                            }}
                            disabled={isDateDisabled}
                            locale={es}
                          />
                        </div>
                      )}
                    </div>
                    {errors.check_in && <p className="text-[10px] text-red-500 ml-1">{errors.check_in.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Fecha Salida</label>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setActivePicker(activePicker === 'check_out' ? null : 'check_out')}
                        className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm text-left outline-none focus:border-[#6b7c4a] shadow-sm flex items-center justify-between"
                      >
                        <span className={checkOutValue ? "text-[#2c2416]" : "text-[#b5a99a]"}>
                          {checkOutValue ? format(parseISO(checkOutValue), "PPP", { locale: es }) : "Seleccionar fecha"}
                        </span>
                        <CalendarDays className="w-4 h-4 text-[#9a8a78]" />
                      </button>
                      {activePicker === 'check_out' && (
                        <div className="absolute top-full right-0 mt-2 z-[50] bg-white border border-[#e2d9cc] rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                          <style>{calendarStyles}</style>
                          <DayPicker
                            mode="single"
                            selected={checkOutValue ? parseISO(checkOutValue) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                setValue("check_out", `${year}-${month}-${day}`, { shouldValidate: true });
                                setActivePicker(null);
                              }
                            }}
                            disabled={isCheckOutDisabled}
                            locale={es}
                            defaultMonth={checkInValue ? parseISO(checkInValue) : undefined}
                          />
                        </div>
                      )}
                    </div>
                    {errors.check_out && <p className="text-[10px] text-red-500 ml-1">{errors.check_out.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Propósito del Viaje</label>
                  <textarea {...register("trip_reason")} placeholder="Cuéntanos un poco más sobre tu estadía..." className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] transition-all shadow-sm" rows={3}></textarea>
                  {errors.trip_reason && <p className="text-[10px] text-red-500 ml-1">{errors.trip_reason.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Recomendado por</label>
                    <input {...register("referred_by_name")} type="text" placeholder="Nombre" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#6b7c4a] shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Relación</label>
                    <select {...register("referred_by_relation")} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-base sm:text-sm outline-none focus:border-[#6b7c4a] shadow-sm">
                      <option value="Amigo/a">Amigo/a</option>
                      <option value="Familiar">Familiar</option>
                      <option value="Pareja">Pareja</option>
                      <option value="Compañero/a de trabajo">Compañero/a de trabajo</option>
                      <option value="Otro cercano">Otro cercano</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 bg-white/50 border border-[#e2d9cc] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-[#6b7c4a]" />
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[#2c2416]">Reglas de la Casa</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {siteConfig.houseRules.map((rule, idx) => (
                      <li key={idx} className="flex gap-3 text-xs text-[#6b5d4f] leading-relaxed">
                        <span className="text-[#6b7c4a] mt-0.5">•</span>
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
                        <div className="w-5 h-5 border-2 border-[#e2d9cc] rounded-md transition-all group-hover:border-[#6b7c4a] peer-checked:bg-[#6b7c4a] peer-checked:border-[#6b7c4a]"></div>
                        <CheckCircle2 className="absolute inset-0 w-5 h-5 text-white scale-0 transition-transform peer-checked:scale-75" />
                      </div>
                      <span className="text-xs text-[#2c2416] font-medium select-none">
                        Acepto las reglas de la casa y confirmo el motivo de mi viaje.
                      </span>
                    </label>
                    {errors.rules_accepted && <p className="text-[10px] text-red-500 mt-1 ml-8">{errors.rules_accepted.message}</p>}
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    type="submit" 
                    disabled={!isValid || isSubmitting} 
                    className="w-full py-4 bg-[#6b7c4a] text-white rounded-full font-bold uppercase tracking-[0.25em] text-[12px] hover:bg-[#5a6a3d] transition-all shadow-xl active:scale-[0.97] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? "Procesando solicitud..." : "Enviar Postulación"}
                  </button>

                  <p className="mt-4 text-[9px] text-center text-[#9a8a78] uppercase tracking-widest leading-relaxed">
                    * Tu postulación será revisada personalmente<br />por el equipo de Playa Serena.
                  </p>
                </div>
              </form>
            </div>
            )
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-[#6b7c4a]/10 rounded-full flex items-center justify-center text-[#6b7c4a] mb-2 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-3xl sm:text-4xl text-[#2c2416] italic">¡Solicitud Recibida!</h3>
                <p className="text-[#6b5d4f] text-sm font-light max-w-sm mx-auto leading-relaxed">
                  Gracias por tu interés en Playa Serena. Revisaremos tu postulación y te contactaremos a la brevedad luego de revisar tu solicitud.
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="mt-4 px-10 py-3 border border-[#6b7c4a] text-[11px] uppercase tracking-widest font-bold text-[#6b7c4a] rounded-full hover:bg-[#6b7c4a] hover:text-white transition-all active:scale-95"
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
