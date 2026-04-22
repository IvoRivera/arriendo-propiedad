import { Maximize, BedDouble, Bath, Car, Banknote } from "lucide-react";

export default function Details() {
  const specs = [
    { label: "Superficie Total", value: "79 m²", icon: Maximize },
    { label: "Superficie Útil", value: "62.94 m²", icon: Maximize },
    { label: "Terraza", value: "16.06 m²", icon: Maximize },
    { label: "Dormitorios", value: "2", icon: BedDouble },
    { label: "Baños", value: "1", icon: Bath },
    { label: "Estacionamiento", value: "1 Privado", icon: Car },
    { label: "Valor por noche", value: "$100k - $180k CLP", icon: Banknote },
  ];

  return (
    <section className="py-24 bg-slate-950 text-slate-200">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl font-bold mb-10 text-center relative z-10">Especificaciones</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
            {specs.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-cyan-400 mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{spec.label}</span>
                  <span className="text-lg font-semibold text-slate-100">{spec.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
