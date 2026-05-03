import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const FALLBACK_SERVICES = [
  {
    title: "Residential Interiors",
    description: "Premium designs for 1-4 BHK apartments, Villas, and Kothis with end-to-end execution.",
    link: "/services/residential-interiors",
    image: "/services-residential.jpg",
  },
  {
    title: "Commercial Interiors",
    description: "Transform your workspace, retail store, or hospitality venue into an inspiring environment.",
    link: "/services/commercial-interiors",
    image: "/services-commercial.jpg",
  },
  {
    title: "3D Visualization",
    description: "Hyper-realistic 3D renders that eliminate surprises before we lay the first brick.",
    link: "/services/3d-visualization",
    image: "/services-3d.jpg",
  },
  {
    title: "Home Construction",
    description: "Complete architecture and construction services starting at just Rs. 1,250/sq.ft.",
    link: "/services/construction-architecture",
    image: "/services-construction.jpg",
  },
];

interface ServicesGridProps {
  imageMap?: Record<string, string>
  initialServices?: any[]
}

export default function ServicesGrid({ imageMap = {}, initialServices = [] }: ServicesGridProps) {
  const displayServices = initialServices.length > 0 
    ? initialServices.map(s => ({
        title: s.title,
        description: s.shortDescription || s.hero?.subtitle || "",
        link: `/services/${s.slug}`,
        image: s.hero?.image || s.image || "/services-residential.jpg"
      }))
    : FALLBACK_SERVICES;
  return (
    <section className="bg-[#FAF8F4] py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        
        {/* ── Majestic Centered Header ── */}
        <div className="flex flex-col items-center text-center mb-16">
          <ScrollReveal>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-amber-500" />
                <span className="font-body text-xs text-amber-500 uppercase tracking-[0.3em] font-semibold">Our Expertise</span>
                <div className="w-8 h-px bg-amber-500" />
              </div>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal-900 leading-[1.1] tracking-tight mb-10 max-w-4xl">
                Services Tailored <br className="hidden sm:block" />
                <span className="italic font-light text-charcoal-900/60">to Your Vision.</span>
              </h2>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Unique Interactive Accordion ── */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-col lg:flex-row w-full h-[800px] lg:h-[650px] gap-4">
            {displayServices.map((service, index) => (
              <div
                key={service.title}
                className="group relative flex-1 hover:flex-[2.5] lg:hover:flex-[3] transition-[flex] duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] rounded-3xl overflow-hidden cursor-pointer shadow-lg"
              >
                {/* Background Image */}
                <Image
                  src={imageMap[service.image] || service.image}
                  alt={`${service.title} service`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-[2s] ease-out"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-charcoal-900/30 group-hover:bg-charcoal-900/10 transition-colors duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  
                  {/* Category / Number */}
                  <div className="flex items-center gap-3 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                    <span className="w-8 h-px bg-amber-400" />
                    <span className="font-body text-[10px] text-amber-400 font-bold tracking-[0.2em] uppercase">
                      0{index + 1}
                    </span>
                  </div>
                  
                  {/* Title (Stays visible) */}
                  <h3 className="font-display text-3xl md:text-4xl text-white leading-tight mb-2 drop-shadow-md">
                    {service.title}
                  </h3>
                  
                  {/* Expandable Text & Button (Hidden default, reveals on hover) */}
                  <div className="grid grid-rows-[0fr] lg:grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]">
                    <div className="overflow-hidden">
                      <div className="pt-2">
                        <p className="font-body text-white/80 text-sm md:text-base leading-relaxed mb-6 max-w-md line-clamp-2 md:line-clamp-none">
                          {service.description}
                        </p>
                        <Link
                          href={service.link}
                          className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-body text-xs uppercase tracking-[0.2em] hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-all duration-300"
                        >
                          Explore Service
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
