import { MapPin, Navigation, Utensils, Compass } from "lucide-react";

export default function Location() {
  const mapUrl = "https://maps.app.goo.gl/SfjUJLWFQcFtjJzC6";

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800" id="ubicacion">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 mb-6 text-cyan-400">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Avenida del Mar 3500</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              El corazón de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Cuatro Esquinas</span>
            </h2>
            
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Edificio Playa Serena se encuentra en el punto más estratégico y cotizado de la Avenida del Mar. Disfruta la tranquilidad de la playa y la cercanía a la mejor gastronomía.
            </p>

            <ul className="space-y-6 mb-10">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-slate-200 font-semibold mb-1">Conectividad Inmediata</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">A pasos de la intersección Cuatro Esquinas, permitiendo rápido acceso a la Ruta 5 y centros comerciales.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 text-orange-400">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-slate-200 font-semibold mb-1">Polo Gastronómico</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Rodeado de los mejores restaurantes, cafeterías y bares de la costanera. Todo a distancia caminable.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 text-teal-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-slate-200 font-semibold mb-1">Playa Ideal</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Sector de playa amplia, limpia y segura, perfecta para caminatas matutinas y deportes acuáticos.</p>
                </div>
              </li>
            </ul>

            <a 
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
            >
              <span>Ver indicaciones en Google Maps</span>
              <Navigation className="w-4 h-4" />
            </a>
          </div>

          {/* Map Illustration / Embed placeholder */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden glass-panel group">
             {/* In a real scenario, use Google Maps iframe. Using a stylized placeholder for visual excellence */}
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3458.742468307434!2d-71.26871032394334!3d-29.90053937499645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691ca5cd0e6af11%3A0xc66c1b3fbc062b14!2sAv.%20del%20Mar%203500%2C%20La%20Serena%2C%20Coquimbo!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(90%) hue-rotate(180deg)' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              ></iframe>
            </div>
            
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
                <div>
                  <p className="text-white text-sm font-semibold">Edificio Playa Serena</p>
                  <p className="text-slate-400 text-xs">La Serena, Chile</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
