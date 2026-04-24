"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, CheckCircle2 } from "lucide-react";

import { supabasePublic } from "@/lib/supabase";

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
  const cleaned = number.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (code === "+56" && cleaned.length === 9 && cleaned.startsWith("9")) {
    return `+56${cleaned}`;
  }
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
  const [mounted, setMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

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

  useEffect(() => {
    if (isOpen && initialDates) {
      const formatDate = (date: Date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
      };
      setValue("check_in", formatDate(initialDates.checkIn), { shouldValidate: true });
      setValue("check_out", formatDate(initialDates.checkOut), { shouldValidate: true });
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
        .insert([{
          full_name: data.full_name,
          email: data.email,
          phone: finalPhone,
          guests_count: parseInt(data.guests_count.split(" ")[0]) || 4,
          check_in: data.check_in,
          check_out: data.check_out,
          trip_reason: data.trip_reason,
          referred_by: finalReferral,
          status: "pending"
        }]);
      if (supabaseError) throw supabaseError;
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("[CoastalRequestModal] Submission error:", message);
      setSubmitError("Hubo un problema al procesar tu solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999999] flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-md overflow-y-auto overscroll-none">
      {/* Background overlay click to close */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 cursor-default" 
        aria-hidden="true"
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#faf7f2] sm:rounded-[32px] shadow-2xl min-h-full sm:min-h-0 flex flex-col z-10 m-0 sm:m-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[#6b5d4f] hover:text-[#2c2416] transition-colors p-3 z-20 rounded-full hover:bg-black/5"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="px-5 sm:px-10 pt-16 pb-12 flex-1">
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
                <p className="text-[#9a8a78] text-[10px] uppercase tracking-widest mt-2">Completa tus datos para postular</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                  <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl border border-red-100">
                    {submitError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Nombre Completo</label>
                    <input {...register("full_name")} type="text" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" />
                    {errors.full_name && <p className="text-[10px] text-red-500 ml-1">{errors.full_name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Email</label>
                    <input {...register("email")} type="email" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" />
                    {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Teléfono Móvil</label>
                    <div className="flex gap-2">
                      <select {...register("country_code")} className="bg-white border border-[#e2d9cc] rounded-xl px-2 py-3.5 text-xs outline-none focus:border-[#6b7c4a]">
                        {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                      </select>
                      <input {...register("phone")} type="tel" placeholder={selectedCountry.placeholder} className="flex-1 bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] outline-none transition-all shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Huéspedes</label>
                    <select {...register("guests_count")} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#6b7c4a] shadow-sm appearance-none">
                      <option>1 Huésped</option>
                      <option>2 Huéspedes</option>
                      <option>3 Huéspedes</option>
                      <option>Retiro Privado (4+)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Fecha Llegada</label>
                    <input {...register("check_in")} type="date" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#6b7c4a] shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Fecha Salida</label>
                    <input {...register("check_out")} type="date" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#6b7c4a] shadow-sm" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Propósito del Viaje</label>
                  <textarea {...register("trip_reason")} placeholder="Cuéntanos un poco más sobre tu estadía..." className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#6b7c4a] focus:ring-1 focus:ring-[#6b7c4a] transition-all shadow-sm" rows={3}></textarea>
                  {errors.trip_reason && <p className="text-[10px] text-red-500 ml-1">{errors.trip_reason.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Recomendado por</label>
                    <input {...register("referred_by_name")} type="text" placeholder="Nombre" className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#6b7c4a] shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#9a8a78] font-bold ml-1">Relación</label>
                    <select {...register("referred_by_relation")} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#6b7c4a] shadow-sm">
                      <option value="Amigo/a">Amigo/a</option>
                      <option value="Familiar">Familiar</option>
                      <option value="Pareja">Pareja</option>
                      <option value="Compañero/a de trabajo">Compañero/a de trabajo</option>
                      <option value="Otro cercano">Otro cercano</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={!isValid || isSubmitting} 
                    className="w-full py-4.5 bg-[#6b7c4a] text-white rounded-full font-bold uppercase tracking-[0.25em] text-[12px] hover:bg-[#5a6a3d] transition-all shadow-xl active:scale-[0.97] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
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
