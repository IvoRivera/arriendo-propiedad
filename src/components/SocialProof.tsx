import { Star, Quote } from "lucide-react";

export default function SocialProof() {
  const testimonials = [
    {
      name: "María José Valdés",
      role: "Viajera de Santiago",
      text: "Las fotos no le hacen justicia a la vista. Despertar y tomar café mirando el mar desde la terraza fue lo mejor de nuestras vacaciones. El departamento está impecable y muy bien equipado.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Estadía de negocios",
      text: "Ubicación inmejorable en Cuatro Esquinas. Excelente internet para trabajar y por las tardes el sonido del mar ayuda a desconectar. La atención fue rápida y muy amable por WhatsApp.",
      rating: 5,
    },
    {
      name: "Familia Silva",
      role: "Vacaciones familiares",
      text: "Fuimos con mi pareja y nuestro hijo. Los espacios son amplios, limpios y muy modernos. Tener estacionamiento seguro es un plus gigante. Volveremos la próxima temporada de todas maneras.",
      rating: 5,
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experiencias que hablan por sí solas</h2>
          <p className="text-slate-400">Descubre por qué nuestros huéspedes nos eligen una y otra vez.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="glass-panel p-8 rounded-2xl relative group hover:-translate-y-2 transition-transform duration-300">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800 group-hover:text-cyan-900 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                ))}
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed italic text-sm md:text-base">
                "{t.text}"
              </p>
              
              <div>
                <h4 className="text-slate-100 font-semibold">{t.name}</h4>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
