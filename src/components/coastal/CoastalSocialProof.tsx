import { Star } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";

export function CoastalSocialProof() {
  return (
    <section className="bg-[#faf7f2] px-6 py-14 md:py-20 border-t border-[#e2d9cc]/60">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#9a8a78] mb-4">
              Prueba social
            </p>
            <h2 className="text-3xl md:text-5xl font-serif-luxury text-[#2c2416] leading-tight mb-5">
              {SITE_CONTENT.socialProof.sectionTitle}
            </h2>
            <p className="text-[#6b5d4f] text-sm md:text-base leading-relaxed max-w-md">
              {SITE_CONTENT.socialProof.sectionSubtitle}
            </p>

            <div className="mt-8 inline-flex items-center gap-4 rounded-3xl bg-white border border-[#e2d9cc] px-5 py-4 shadow-sm">
              <div className="text-3xl font-serif-luxury text-[#00628f]">
                {SITE_CONTENT.socialProof.averageRating}
              </div>
              <div>
                <div className="flex gap-1 text-[#c8883a]" aria-label="Valoracion promedio 4.9 de 5">
                  {[0, 1, 2, 3, 4].map((item) => (
                    <Star key={item} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[10px] text-[#8a7a6a] uppercase tracking-widest mt-1">
                  {SITE_CONTENT.socialProof.reviewCount} referencias internas
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SITE_CONTENT.socialProof.testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="bg-[#f5f0e8] border border-[#e2d9cc]/70 rounded-[2rem] p-6 md:p-7"
              >
                <div className="flex gap-1 text-[#c8883a] mb-5" aria-hidden="true">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[#2c2416] text-sm leading-relaxed italic mb-6">
                  “{testimonial.quote}”
                </p>
                <div>
                  <h3 className="text-sm font-bold text-[#2c2416]">{testimonial.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#8a7a6a] mt-1">
                    {testimonial.context}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoastalSocialProof;
