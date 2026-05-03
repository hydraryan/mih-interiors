'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Ruler } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface ServicesClientProps {
  initialServices: any[]
  heroImage: string
}

export default function ServicesClient({ initialServices, heroImage }: ServicesClientProps) {
  const [services, setServices] = useState<any[]>(initialServices)
  const [filteredServices, setFilteredServices] = useState<any[]>(initialServices)
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    // Only fetch if initialServices is empty (shouldn't happen with server components but good for safety)
    if (initialServices.length === 0) {
      const fetchServices = async () => {
        setLoading(true)
        try {
          const res = await fetch("/api/services")
          const data = await res.json()
          if (data.success) {
            setServices(data.services)
            setFilteredServices(data.services)
          }
        } catch (error) {
          console.error("Error fetching services:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchServices()
    }
  }, [initialServices])

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredServices(services)
    } else {
      setFilteredServices(services.filter((s) => s.category?.toLowerCase() === activeCategory.toLowerCase()))
    }
  }, [activeCategory, services])

  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))]

  return (
    <div className="min-h-screen bg-[#fbf4eb] text-charcoal-900 font-body selection:bg-brown-200 overflow-x-hidden">
      
      {/* CHAPTER 1: THE EXPERTISE (Hero) */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white pt-24 md:pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fbf4eb] z-20" />
          <Image 
            src={heroImage}
            alt="Architecting Ambience"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-30 text-center px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center">
              <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-charcoal-900/10 bg-white/50 px-6 py-2.5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-brown-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal-700">Design. Build. Deliver.</span>
              </div>
              
              <h1 className="font-display text-7xl md:text-[11rem] leading-[0.8] text-charcoal-900 tracking-tighter">
                Architecting <br />
                <span className="italic text-brown-600">Ambience.</span>
              </h1>
              
              <p className="mt-12 max-w-2xl text-lg md:text-2xl leading-relaxed text-charcoal-500 font-light">
                From structural concepts to the finest material details, we provide a holistic approach to luxury living.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CHAPTER 2: THE CURATION (Expertise Collection) */}
      <section className="relative z-10 py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Advanced Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-24 gap-12 border-b border-charcoal-900/10 pb-16">
            <ScrollReveal direction="left">
              <div className="space-y-4">
                <h2 className="font-display text-5xl md:text-6xl text-charcoal-900 leading-none">The Services.</h2>
                <p className="text-charcoal-500 font-light text-sm tracking-wide">Explore our specialized design domains</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" className="flex flex-wrap gap-4">
              {categories.map((cat: any) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`group relative px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 ${
                    activeCategory === cat
                      ? 'bg-charcoal-900 text-white shadow-2xl'
                      : 'bg-white text-charcoal-400 border border-charcoal-900/5 hover:border-brown-300'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div 
                      layoutId="service-filter-active"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brown-600"
                    />
                  )}
                </button>
              ))}
            </ScrollReveal>
          </div>

          {/* Masterpiece Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [1, 2, 3].map(n => (
                  <div key={n} className="aspect-[4/5] bg-white/50 animate-pulse rounded-[3.5rem] p-6">
                    <div className="h-full w-full bg-charcoal-100/50 rounded-[2.5rem]" />
                  </div>
                ))
              ) : (
                filteredServices.map((service, idx) => (
                  <motion.div
                    key={service._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="group block bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brown-900/5 transition-all duration-700 border border-charcoal-900/5 h-full flex flex-col p-4"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-8">
                        <Image
                          src={service.hero?.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200"}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-charcoal-900/5 group-hover:bg-transparent transition-all" />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-charcoal-900 text-[9px] font-bold uppercase tracking-[0.3em] shadow-sm border border-charcoal-900/5">
                            {service.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="px-8 pb-8 flex flex-col flex-1">
                        <h3 className="font-display text-3xl text-charcoal-900 mb-6 group-hover:text-brown-700 transition-colors leading-tight">
                          {service.title}
                        </h3>
                        
                        <p className="font-body text-charcoal-500 text-sm leading-relaxed line-clamp-3 mb-10 font-light">
                          {service.shortDescription || "Elevating your space through meticulous design and expert project management."}
                        </p>
                        
                        <div className="mt-auto pt-8 border-t border-charcoal-900/5 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#fbf4eb] flex items-center justify-center text-brown-600">
                                 <Ruler size={16} />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">View Domain</span>
                           </div>
                           <ArrowRight size={20} className="text-charcoal-300 group-hover:translate-x-2 group-hover:text-brown-600 transition-all duration-500" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CHAPTER 3: THE METHOD (Process CTA) */}
      <section className="py-56 px-6 bg-white rounded-t-[5rem]">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24">
             <div className="w-full md:w-1/2 space-y-12">
                <div className="space-y-6">
                   <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">The Collaboration</span>
                   <h2 className="font-display text-6xl md:text-8xl text-charcoal-900 leading-tight">Bespoke <br /> <span className="italic text-brown-600">Mastery.</span></h2>
                </div>
                <p className="text-xl text-charcoal-500 font-light leading-relaxed max-w-xl">
                   Ready to transform your vision into an architectural reality? Let's discuss your project goals and create something extraordinary.
                </p>
             </div>
             
             <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <Link 
                  href="/contact"
                  className="group relative h-72 w-72 rounded-full bg-charcoal-900 flex items-center justify-center text-center p-8 transition-all hover:bg-brown-900 hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                   <div className="absolute inset-0 rounded-full border border-white/10 scale-90 group-hover:scale-110 transition-transform duration-700" />
                   <div className="space-y-4">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Request a</span>
                      <span className="block font-display text-3xl text-white">Quote.</span>
                      <ArrowRight className="mx-auto h-8 w-8 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" />
                   </div>
                </Link>
             </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
