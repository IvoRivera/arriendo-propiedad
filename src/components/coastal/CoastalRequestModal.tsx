"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, CheckCircle2, Calendar, Users, MessageSquare, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { supabasePublic } from "@/lib/supabase";

import { useConfig } from "@/components/providers/ConfigProvider";
import { heroData } from "@/data/mockData";

const countries = [
  { name: "Chile", code: "+56", flag: "🇨🇱", placeholder: "9 1234 5678" },
  { name: "Argentina", code: "+54", flag: "🇦🇷", placeholder: "9 11 1234-5678" },
  { name: "España", code: "+34", flag: "🇪🇸", placeholder: "600 000 000" },
  { name: "Estados Unidos", code: "+1", flag: "🇺🇸", placeholder: "(555) 000-0000" },
  { name: "Perú", code: "+51", flag: "🇵🇪", placeholder: "900 000 000" },
  { name: "Colombia", code: "+57", flag: "🇨🇴", placeholder: "300 000 0000" },
  { name: "Brasil", code: "+55", flag: "🇧🇷", placeholder: "11 90000-0000" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾", placeholder: "090 000 000" },
  { name: "Otro", code: "+", flag: "🌐", placeholder: "Prefijo + Número" },
];

const normalizePhone = (code: string, number: string) => {
  // Remove all non-numeric characters except + at the start
  const cleaned = number.replace(/[^\d+]/g, "");
  
  // If user typed a + at the start, use it as is
  if (cleaned.startsWith("+")) return cleaned;

  // Special case: Chile local mobile format
  if (code === "+56") {
    // If it starts with 9 and has 9 digits, it's a mobile
    if (cleaned.length === 9 && cleaned.startsWith("9")) {
      return `+56${cleaned}`;
    }
  }

  // Ensure there's a + at the start of the final number
  const prefix = code.startsWith("+") ? code : `+${code}`;
  return `${prefix}${cleaned}`;
};

const requestSchema = z.object({
  full_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  country_code: z.string(),
  phone: z.string().min(7, "Ingresa un número válido"),
  guests_count: z.string(),
  check_in: z.string().min(1, "La fecha de llegada es obligatoria"),
  check_out: z.string().min(1, "La fecha de salida es obligatoria"),
  trip_reason: z.string().min(10, "Cuéntanos un poco más sobre tu viaje (mín. 10 carac.)"),
  referred_by_name: z.string().min(2, "Ingresa el nombre de quién te recomendó"),
  referred_by_relation: z.string().min(1, "Selecciona tu relación"),
}).refine((data) => {
  if (data.check_in && data.check_out) {
    return new Date(data.check_out) > new Date(data.check_in);
  }
  return true;
}, {
  message: "La fecha de salida debe ser posterior a la de llegada",
  path: ["check_out"],
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState<"preparing" | "form">("preparing");

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

  // Sync initial dates when modal opens and handle automatic transition
  useEffect(() => {
    if (isOpen) {
      // Si no hay fechas iniciales, vamos directo al formulario
      if (!initialDates) {
        setStep("form");
      } else {
        setStep("preparing");
        
        // Format to YYYY-MM-DD for <input type="date" />
        const formatDate = (date: Date) => {
          const d = new Date(date);
          d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
          return d.toISOString().split('T')[0];
        };

        setValue("check_in", formatDate(initialDates.checkIn), { shouldValidate: true });
        setValue("check_out", formatDate(initialDates.checkOut), { shouldValidate: true });

        // Automatizar transición tras 2.5 segundos
        const timer = setTimeout(() => {
          setStep("form");
        }, 2500);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, initialDates, setValue]);

  const onSubmit = async (data: RequestFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const finalPhone = normalizePhone(data.country_code, data.phone);
    const finalReferral = `${data.referred_by_name} (${data.referred_by_relation})`;

    try {
      const { error: supabaseError } = await supabasePublic
        .from("booking_requests")
        .insert([
          {
            full_name: data.full_name,
            email: data.email,
            phone: finalPhone,
            guests_count: parseInt(data.guests_count.split(" ")[0]) || 4,
            check_in: data.check_in,
            check_out: data.check_out,
            trip_reason: data.trip_reason,
            referred_by: finalReferral,
            status: "pending"
          }
        ]);

      if (supabaseError) throw supabaseError;

      // Silently notify owner via email
      try {
        fetch("/api/notify-new-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            phone: finalPhone,
            referred_by: finalReferral,
            status: "pending"
          }),
        });
      } catch (emailErr) {
        console.error("Failed to trigger email notification:", emailErr);
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting request:", err);
      setSubmitError("Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente o contáctanos directamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkInStr = watch("check_in");
  const checkOutStr = watch("check_out");
  
  const { getValue } = useConfig();
  
  const getStaySummary = () => {
    if (!checkInStr || !checkOutStr) return null;
    const d1 = new Date(checkInStr);
    const d2 = new Date(checkOutStr);
    const nights = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    
    const livePriceStr = getValue("PROPERTY_RENT_VALUE") || "80000";
    const pricePerNightNum = parseInt(livePriceStr.replace(/\D/g, ''));
    const total = nights * pricePerNightNum;
    const formattedTotal = new Intl.NumberFormat('es-CL').format(total);
    
    const formatDateShort = (d: Date) => d.toLocaleDateString("es-CL", { day: "numeric", month: "short" });

    return {
      nights,
      total: formattedTotal,
      checkIn: formatDateShort(d1),
      checkOut: formatDateShort(d2)
    };
  };

  const summary = getStaySummary();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1b1c1a]/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#faf7f2] border border-[#e2d9cc]/50 rounded-[32px] shadow-[0px_24px_48px_rgba(27,28,26,0.12)] overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#6b5d4f] hover:text-[#2c2416] transition-colors p-2 z-20"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            {!isSubmitted ? (
              <div className="px-6 sm:px-10 pt-12 pb-10 min-h-[400px] flex flex-col">
                <AnimatePresence mode="wait">
                  {step === "preparing" && summary ? (
                    <motion.div
                      key="preparing"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex-1 flex flex-col items-center justify-center text-center py-8"
                    >
                      <div className="mb-10">
                        <div className="relative inline-block">
                          <div className="w-16 h-16 border-t-2 border-[#6b7c4a] rounded-full animate-spin mb-6 opacity-30" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-[#6b7c4a] opacity-50" />
                          </div>
                        </div>
                        <h3 className="font-serif text-4xl text-[#2c2416] italic tracking-tight mb-4">
                          Estamos preparando tu estadía...
                        </h3>
                        <p className="font-sans text-sm text-[#6b5d4f] max-w-sm mx-auto leading-relaxed">
                          Confirmando detalles para tu experiencia frente al mar en La Serena.
                        </p>
                      </div>

                      <div className="w-full max-w-sm bg-white/50 border border-[#e2d9cc] rounded-2xl p-6 mb-10 flex flex-col gap-5">
                        <div className="flex items-center justify-center gap-8">
                          <div className="text-right flex-1">
                            <p className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-medium mb-0.5">Llegada</p>
                            <p className="text-sm font-semibold text-[#2c2416]">{summary.checkIn}</p>
                          </div>
                          <div className="text-[#e2d9cc]">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-medium mb-0.5">Salida</p>
                            <p className="text-sm font-semibold text-[#2c2416]">{summary.checkOut}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#f0e8dc] flex flex-col gap-1">
                          <p className="text-xs text-[#6b5d4f] font-light">
                            {summary.nights} {summary.nights === 1 ? "noche" : "noches"} de descanso
                          </p>
                          <div className="flex justify-between items-baseline mt-1">
                            <p className="text-[10px] uppercase tracking-widest text-[#2c2416] font-medium">Total estimado</p>
                            <p className="text-2xl font-serif text-[#2c2416] italic" style={{ fontFamily: "var(--font-newsreader), serif" }}>
                              ${summary.total}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-[10px] text-[#9a8a78] uppercase tracking-[0.15em] font-light">
                        * No es un compromiso de pago aún
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-full"
                    >
                      {/* Header */}
                      <div className="text-center mb-10">
                        <h3 className="font-serif text-4xl text-[#2c2416] italic tracking-tight mb-3">
                          Solicitar tu Estadía
                        </h3>
                        <p className="font-sans text-sm text-[#6b5d4f] max-w-sm mx-auto leading-relaxed">
                          Estás a un paso de una experiencia de desconexión frente al Pacífico.
                        </p>
                      </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded-xl border border-red-100 mb-4 font-medium">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1 flex items-center gap-2">
                        Nombre Completo
                      </label>
                      <input
                        {...register("full_name")}
                        type="text"
                        className={`w-full bg-white border ${errors.full_name ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none placeholder:text-[#e2d9cc] font-sans`}
                        placeholder="Ej. Julián del Mar"
                      />
                      {errors.full_name && (
                        <p className="text-[10px] text-red-500 ml-1 mt-1">{errors.full_name.message}</p>
                      )}
                    </div>
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1">
                        Correo Electrónico
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        className={`w-full bg-white border ${errors.email ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none placeholder:text-[#e2d9cc] font-sans`}
                        placeholder="contacto@ejemplo.com"
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-500 ml-1 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1">
                        Teléfono de Contacto
                      </label>
                      <div className="flex gap-2">
                        {/* Country Selector */}
                        <div className="relative w-[110px] shrink-0">
                          <select
                            {...register("country_code")}
                            className="w-full bg-white border border-[#e2d9cc] rounded-xl pl-3 pr-8 py-3 text-sm text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none appearance-none font-sans cursor-pointer"
                          >
                            {countries.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9a8a78]">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </div>
                        </div>

                        {/* Number Input */}
                        <div className="flex-1">
                          <input
                            {...register("phone")}
                            type="tel"
                            className={`w-full bg-white border ${errors.phone ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none placeholder:text-[#e2d9cc] font-sans`}
                            placeholder={selectedCountry.placeholder}
                          />
                        </div>
                      </div>
                      {errors.phone && (
                        <p className="text-[10px] text-red-500 ml-1 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    {/* Number of People */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1 flex items-center gap-1.5">
                        <Users className="w-3 h-3" /> Número de Personas
                      </label>
                      <div className="relative">
                        <select
                          {...register("guests_count")}
                          className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none appearance-none font-sans cursor-pointer"
                        >
                          <option>1 Huésped</option>
                          <option>2 Huéspedes</option>
                          <option>3 Huéspedes</option>
                          <option>Retiro Privado (4+)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9a8a78]">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Check-in */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> Check-in
                      </label>
                      <input
                        {...register("check_in")}
                        type="date"
                        className={`w-full bg-white border ${errors.check_in ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none font-sans`}
                      />
                      {errors.check_in && (
                        <p className="text-[10px] text-red-500 ml-1 mt-1">{errors.check_in.message}</p>
                      )}
                    </div>
                    {/* Check-out */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> Check-out
                      </label>
                      <input
                        {...register("check_out")}
                        type="date"
                        className={`w-full bg-white border ${errors.check_out ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none font-sans`}
                      />
                      {errors.check_out && (
                        <p className="text-[10px] text-red-500 ml-1 mt-1">{errors.check_out.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Travel Reason */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" /> Motivo del viaje
                    </label>
                    <textarea
                      {...register("trip_reason")}
                      className={`w-full bg-white border ${errors.trip_reason ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none resize-none placeholder:text-[#e2d9cc] font-sans`}
                      placeholder="Cuéntanos sobre tu búsqueda de desconexión..."
                      rows={3}
                    ></textarea>
                    {errors.trip_reason && (
                      <p className="text-[10px] text-red-500 ml-1 mt-1">{errors.trip_reason.message}</p>
                    )}
                  </div>

                  {/* Recommendation */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1 flex items-center gap-1.5">
                      <UserPlus className="w-3 h-3" /> ¿Quién te recomendó este lugar? <span className="text-[#6b7c4a] font-bold">*</span>
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <input
                          {...register("referred_by_name")}
                          type="text"
                          className={`w-full bg-white border ${errors.referred_by_name ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none placeholder:text-[#e2d9cc] font-sans`}
                          placeholder="Ej: Juan Pérez"
                        />
                        {errors.referred_by_name && (
                          <p className="text-[10px] text-red-500 ml-1 mt-1">{errors.referred_by_name.message}</p>
                        )}
                      </div>

                      {/* Relation */}
                      <div className="relative">
                        <select
                          {...register("referred_by_relation")}
                          className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 text-sm text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none appearance-none font-sans cursor-pointer"
                        >
                          <option value="Amigo/a">Amigo/a</option>
                          <option value="Familiar">Familiar</option>
                          <option value="Pareja">Pareja</option>
                          <option value="Compañero/a de trabajo">Compañero/a de trabajo</option>
                          <option value="Otro cercano">Otro cercano</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9a8a78]">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#9a8a78] leading-relaxed italic ml-1">
                      “Este lugar se comparte a través de personas cercanas para mantener un ambiente tranquilo, cómodo y pensado para el descanso.”
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 flex justify-center">
                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="w-full md:w-auto px-12 py-4 bg-[#6b7c4a] text-white rounded-full font-sans text-xs font-semibold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:bg-[#5a6a3d] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[240px]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        "Enviar Postulación"
                      )}
                    </button>
                  </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-10 py-24 text-center flex flex-col items-center gap-6"
              >
                <div className="w-20 h-20 bg-[#6b7c4a]/10 rounded-full flex items-center justify-center text-[#6b7c4a] mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-3xl text-[#2c2416] italic">¡Tu escapada a La Serena está cerca!</h3>
                <p className="font-sans text-sm text-[#6b5d4f] max-w-sm leading-relaxed">
                  Te contactaremos pronto para preparar tu llegada y que solo te preocupes de descansar.
                </p>
                <p className="font-sans text-sm font-semibold text-[#6b5d4f] mt-2">
                  ¡Estamos a un paso de comenzar tus vacaciones!
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 text-[10px] uppercase tracking-widest font-bold text-[#6b7c4a] hover:text-[#5a6a3d] transition-colors"
                >
                  Cerrar ventana
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
