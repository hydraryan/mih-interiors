"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, ArrowLeft, MapPin } from "lucide-react"
import ScrollReveal from "@/components/ui/ScrollReveal"
import { getDirectImageUrl } from "@/lib/utils/imageUtils"

/* Fallback projects in case DB is empty or request fails */
const FALLBACK_PROJECTS = [
  { _id: "f1", mainImage: "/hero_image.jpg", title: "Modern Villa", location: "Chandigarh", type: "Residential" },
  { _id: "f2", mainImage: "/services-residential.jpg", title: "Contemporary Home", location: "Mohali", type: "Residential" },
  { _id: "f3", mainImage: "/services-commercial.jpg", title: "Corporate Office", location: "Chandigarh", type: "Commercial" },
  { _id: "f4", mainImage: "/services-3d.jpg", title: "Luxury Apartment", location: "Panchkula", type: "Residential" },
  { _id: "f5", mainImage: "/mih_about_hero_interior.png", title: "Boutique Hotel", location: "Mohali", type: "Commercial" },
]

export const ShuffleHero = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  /* Fetch projects from DB */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects?featured=true")
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data.slice(0, 8)) // 8 featured + 1 "View All" = 9 cards
        } else {
          setProjects(FALLBACK_PROJECTS)
        }
      } catch {
        setProjects(FALLBACK_PROJECTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return
    const cardWidth = container.querySelector<HTMLElement>("[data-project-card]")?.offsetWidth ?? 500
    const gap = 28
    container.scrollBy({ left: direction === "right" ? cardWidth + gap : -(cardWidth + gap), behavior: "smooth" })
  }

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return
    const cardWidth = container.querySelector<HTMLElement>("[data-project-card]")?.offsetWidth ?? 500
    const idx = Math.round(container.scrollLeft / (cardWidth + 28))
    setActiveIndex(Math.min(idx, projects.length - 1))
  }

  return (
    <section ref={sectionRef} className="w-full bg-[#FAF8F4] relative overflow-hidden pt-20 sm:pt-28 pb-6">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-charcoal-900/10 to-transparent" />

      {/* Background watermark */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 font-display text-[14rem] md:text-[22rem] leading-none text-charcoal-900/[0.015] pointer-events-none select-none tracking-tighter">
        Works
      </div>

      {/* ── Header Row ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-14">
          <ScrollReveal>
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-amber-500" />
                <span className="font-body text-xs text-amber-500 uppercase tracking-[0.3em] font-semibold">Our Portfolio</span>
              </div>
              <h3 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal-900 leading-[1.1] tracking-tight mb-4">
                Spaces Crafted{" "}
                <span className="italic font-light text-charcoal-900/50">with Artistry.</span>
              </h3>
              <p className="font-body text-charcoal-900/50 text-sm md:text-base max-w-md">
                Each project reflects a unique vision — browse our curated collection of luxury spaces.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-charcoal-900/12 flex items-center justify-center text-charcoal-900/50 hover:bg-charcoal-900 hover:text-white hover:border-charcoal-900 transition-all duration-300"
                aria-label="Previous project"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-charcoal-900/12 flex items-center justify-center text-charcoal-900/50 hover:bg-charcoal-900 hover:text-white hover:border-charcoal-900 transition-all duration-300"
                aria-label="Next project"
              >
                <ArrowRight size={18} />
              </button>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-charcoal-900 text-white rounded-full font-body text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-600 transition-all duration-500 ml-2 shadow-lg shadow-charcoal-900/10"
              >
                View All
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Horizontal Scroll Gallery ── */}
      {loading ? (
        /* Loading skeleton */
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex gap-7 overflow-hidden">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[40vw] lg:w-[30vw] xl:w-[26vw]">
                <div className="w-full aspect-[3/4] rounded-[1.5rem] bg-charcoal-900/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-6 md:px-12 max-w-[1400px] mx-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project._id || index}
              data-project-card
              className="group flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[40vw] lg:w-[30vw] xl:w-[26vw] snap-start"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.08 }}
            >
              <Link href={`/projects`} className="block">
                {/* Image Card */}
                <div className="relative w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-lg shadow-charcoal-900/8 group-hover:shadow-2xl group-hover:shadow-charcoal-900/15 transition-shadow duration-700">
                  <Image
                    src={getDirectImageUrl(project.mainImage)}
                    alt={`${project.title} — ${project.location}`}
                    fill
                    className="object-cover group-hover:scale-[1.06] transition-transform duration-[1.2s] ease-out"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 26vw"
                  />

                  {/* Bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-charcoal-900/5 to-transparent" />

                  {/* Category pill */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-lg font-body text-[10px] text-charcoal-900 font-bold uppercase tracking-[0.15em] shadow-sm">
                      {project.type}
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="font-display text-2xl md:text-[1.65rem] text-white leading-tight mb-1.5 drop-shadow-sm">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-amber-400" />
                          <span className="font-body text-white/70 text-xs">{project.location}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-400 flex-shrink-0 ml-4">
                        <ArrowRight size={16} className="-rotate-45 text-white group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* "View All" End Card */}
          <motion.div
            className="flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[40vw] lg:w-[30vw] xl:w-[26vw] snap-start"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/projects"
              className="group relative flex flex-col items-center justify-center w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-charcoal-900 shadow-lg"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(61,43,15,0.3)_0%,transparent_70%)]" />
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

              <div className="relative z-10 text-center px-8">
                <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-6 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-all duration-500">
                  <ArrowRight size={28} className="text-amber-500 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <span className="font-display text-3xl text-white mb-3 block">Explore All Projects</span>
                <span className="font-body text-white/40 text-sm block mb-6">1000+ spaces transformed across North India</span>
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/70 font-body text-xs uppercase tracking-[0.2em] group-hover:border-amber-500 group-hover:text-amber-400 transition-all duration-500">
                  View Portfolio
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      )}

      {/* ── Dot Indicators ── */}
      {!loading && (
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                i === activeIndex ? "w-10 bg-amber-500" : "w-1.5 bg-charcoal-900/12"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
