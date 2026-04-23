"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, CheckCircle2, Calendar, Users, MessageSquare, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase";

const requestSchema = z.object({
  full_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z.string().min(8, "Ingresa un número de contacto válido"),
  guests_count: z.string(),
  check_in: z.string().min(1, "La fecha de llegada es obligatoria"),
  check_out: z.string().min(1, "La fecha de salida es obligatoria"),
  trip_reason: z.string().min(10, "Cuéntanos un poco más sobre tu viaje (mín. 10 carac.)"),
  referred_by: z.string().min(3, "Indica quién te recomendó o cómo nos conociste"),
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
}

export const CoastalRequestModal: React.FC<CoastalRequestModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    mode: "onChange",
    defaultValues: {
      guests_count: "2 Huéspedes",
    }
  });

  const onSubmit = async (data: RequestFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error: supabaseError } = await supabase
        .from("booking_requests")
        .insert([
          {
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            guests_count: parseInt(data.guests_count.split(" ")[0]) || 4,
            check_in: data.check_in,
            check_out: data.check_out,
            trip_reason: data.trip_reason,
            referred_by: data.referred_by,
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
              <div className="px-6 sm:px-10 pt-12 pb-10">
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
                      <input
                        {...register("phone")}
                        type="tel"
                        className={`w-full bg-white border ${errors.phone ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none placeholder:text-[#e2d9cc] font-sans`}
                        placeholder="+56 9 ..."
                      />
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1 flex items-center gap-1.5">
                      <UserPlus className="w-3 h-3" /> ¿Quién te recomendó? <span className="text-[#6b7c4a] font-bold">*</span>
                    </label>
                    <input
                      {...register("referred_by")}
                      type="text"
                      className={`w-full bg-white border ${errors.referred_by ? 'border-red-300' : 'border-[#e2d9cc]'} rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none placeholder:text-[#e2d9cc] font-sans`}
                      placeholder="Nombre de un miembro o invitado previo"
                    />
                    {errors.referred_by && (
                      <p className="text-[10px] text-red-500 ml-1 mt-1">{errors.referred_by.message}</p>
                    )}
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
