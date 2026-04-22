"use client";

import { motion, Variants } from "framer-motion";
import { Waves, Wine, Sunrise, Car, Wifi, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Waves,
    title: "Primera Línea Real",
    description: "Siente la brisa y escucha el mar desde tu terraza frontal. Sin calles intermedias que bloqueen tu vista."
  },
  {
    icon: Wine,
    title: "Diseño y Confort Premium",
    description: "Espacios minimalistas pensados para el descanso. Mobiliario de alta gama y ropa de cama calidad hotel boutique."
  },
  {
    icon: Sunrise,
    title: "Atardeceres Inolvidables",
    description: "Orientación poniente perfecta. Disfruta de la caída del sol sobre el océano Pacífico con una copa en mano."
  },
  {
    icon: Car,
    title: "Estacionamiento Privado",
    description: "Llega y estaciona sin estrés. Tu vehículo estará seguro en el recinto privado del edificio."
  },
  {
    icon: Wifi,
    title: "Conectividad Total",
    description: "Internet de alta velocidad (Fibra) para que puedas desconectar... o teletrabajar si lo necesitas."
  },
  {
    icon: ShieldCheck,
    title: "Seguridad 24/7",
    description: "Conserjería permanente, accesos controlados y circuito cerrado para tu total tranquilidad."
  }
];

export default function Benefits() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="py-24 px-6 lg:px-8 bg-slate-950 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mucho más que un <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">alojamiento</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Hemos cuidado cada detalle para ofrecerte una experiencia de nivel superior, donde tu única preocupación será decidir si bajar a la playa o quedarte en la terraza.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div 
                key={index} 
                variants={item}
                className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors duration-300 flex flex-col items-start hover:bg-slate-900/80"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 text-slate-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-100">{benefit.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
