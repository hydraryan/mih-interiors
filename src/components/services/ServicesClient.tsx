'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Ruler, IndianRupee } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { buildServiceQuoteHref } from '@/lib/services/pricing'

interface ServiceCard {
  _id: string
  slug: string
  title: string
  category?: string
  shortDescription?: string
  startingPrice?: number | null
  hero?: {
    image?: string
  }
}

interface ServicesClientProps {
  initialServices: ServiceCard[]
  heroImage: string
  showcaseImages?: string[]
}

function buildCompactPriceLabel(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return { amount: 'Request', unit: 'pricing' }
  }

  return {
    amount: `Rs. ${new Intl.NumberFormat('en-IN').format(Number(value))}/-`,
    unit: 'sq.ft',
  }
}

export default function ServicesClient({ initialServices, heroImage, showcaseImages = [] }: ServicesClientProps) {
  const router = useRouter()
  const [services, setServices] = useState<ServiceCard[]>(initialServices)
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    // Only fetch if initialServices is empty (shouldn't happen with server components but good for safety)
    if (initialServices.length === 0) {
      const fetchServices = async () => {
        setLoading(true)
        try {
          const res = await fetch("/api/services")
          const data = await res.json() as { success?: boolean; services?: ServiceCard[] }
          if (data.success) {
            setServices(data.services || [])
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

  const filteredServices = useMemo(() => {
    if (activeCategory === "All") {
      return services
    }

    return services.filter((service) => service.category?.toLowerCase() === activeCategory.toLowerCase())
  }, [activeCategory, services])

  const categories = ["All", ...Array.from(new Set(services.map((service) => service.category).filter((cat): cat is string => Boolean(cat))))]

  const showcaseStories = [
    {
      id: '01',
      tag: 'Culinary Excellence',
      title: 'Intelligent Modular Kitchens',
      desc: 'The heart of an Indian home requires a delicate balance of robust functionality and seamless aesthetics. We design ergonomic layouts with premium hardware, ensuring adequate ventilation and customized storage.',
      bullets: ['Moisture-resistant materials', 'Custom pantry units', 'Integrated lighting'],
      image: showcaseImages[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left',
      serviceSlug: 'residential-interiors',
      hasStats: false
    },
    {
      id: '02',
      tag: 'Shared Moments',
      title: 'Elevated Living Spaces',
      desc: 'We treat living spaces as the narrative core of the home. Through layered lighting, rich material textures, and bespoke joinery, we craft environments that naturally invite conversation and grand entertaining.',
      bullets: [],
      image: showcaseImages[1] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      alignment: 'right',
      serviceSlug: 'residential-interiors',
      hasStats: true,
      stats: [
        { value: '300+', label: 'Spaces unified' },
        { value: '100%', label: 'Tailored comfort' }
      ]
    },
    {
      id: '03',
      tag: 'Personal Sanctuaries',
      title: 'Master En-suites',
      desc: 'Bedrooms should act as sensory reset spaces. We integrate deeply personalized configurations, soothing color palettes, and ambient lighting to ensure the hours of your day are grounded in tranquility.',
      bullets: ['Acoustic treatments', 'Ambient dimming', 'Bespoke bedframes'],
      image: showcaseImages[2] || 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left',
      serviceSlug: 'residential-interiors',
      hasStats: false
    },
    {
      id: '04',
      tag: 'Curated Storage',
      title: 'Bespoke Wardrobes',
      desc: 'Custom-built wardrobes that combine architectural refinement with precise internal organization. Crafted securely to safeguard luxury garments while complementing the overarching visual language.',
      bullets: ['Climate-controlled zones', 'Soft-close mechanisms', 'Fluted glass facades'],
      image: showcaseImages[3] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left-split',
      serviceSlug: 'residential-interiors',
      hasStats: false
    },
    {
      id: '05',
      tag: 'Productivity Focused',
      title: 'Commercial Offices',
      desc: 'High-performance workspaces designed to enhance productivity, embody brand identity, and support collaborative dynamics without sacrificing acoustic privacy or ergonomic comfort.',
      bullets: ['Acoustic privacy pods', 'Ergonomic layouts', 'Brand-aligned palettes'],
      image: showcaseImages[4] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left',
      serviceSlug: 'commercial-interiors',
      hasStats: false
    },
    {
      id: '06',
      tag: 'Customer Experience',
      title: 'Retail & Showrooms',
      desc: 'Inviting spatial strategies that naturally guide foot traffic, highlight product portfolios brilliantly, and create memorable brand touchpoints ensuring clients return time and again.',
      bullets: [],
      image: showcaseImages[5] || 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200',
      alignment: 'right',
      serviceSlug: 'commercial-interiors',
      hasStats: true,
      stats: [
        { value: '45%', label: 'Avg. Stay Increase' },
        { value: 'Custom', label: 'Display Systems' }
      ]
    },
    {
      id: '07',
      tag: 'Hospitality',
      title: 'Restaurant & Cafe Ambience',
      desc: 'Crafting immersive dining atmospheres that balance operational efficiency with distinct aesthetic themes. We design spaces that look photogenic while withstanding the rigors of heavy commercial use.',
      bullets: ['Durable finish selections', 'Mood-centric lighting', 'Optimized circulation'],
      image: showcaseImages[6] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left',
      serviceSlug: 'commercial-interiors',
      hasStats: false
    },
    {
      id: '08',
      tag: 'Wellness & Clinical',
      title: 'Healthcare Spaces',
      desc: 'Warm, approachable, and calming clinical environments. We shift away from sterile aesthetics to deliver spaces that soothe patient anxieties while maintaining strict sanitation and functional standards.',
      bullets: ['Calming pastel tones', 'Anti-microbial surfaces', 'Seamless accessibility'],
      image: showcaseImages[7] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left-split',
      serviceSlug: 'commercial-interiors',
      hasStats: false
    },
    {
      id: '09',
      tag: 'Future Forward',
      title: 'Smart Home Environments',
      desc: 'Invisible integration of automation. From motorized window treatments to scene-based lighting control, we ensure technological capability never compromises aesthetic refinement.',
      bullets: [],
      image: showcaseImages[8] || 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200',
      alignment: 'right',
      serviceSlug: 'residential-interiors',
      hasStats: true,
      stats: [
        { value: '1Touch', label: 'Ambient control' },
        { value: 'Hidden', label: 'Wire management' }
      ]
    },
    {
      id: '10',
      tag: 'Boundless Horizons',
      title: 'Outdoor & Balcony Extensions',
      desc: 'Transforming transitional outdoor spaces into lush, usable extensions of your interior. We specify weather-resistant decking, vertical gardens, and bespoke outdoor seating tailored for the Indian climate.',
      bullets: ['Weather-treated woods', 'Integrated planters', 'Subtle path lighting'],
      image: showcaseImages[9] || 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left',
      serviceSlug: 'residential-interiors',
      hasStats: false
    }
  ]

  return (
    <div className="min-h-screen bg-[#fbf4eb] text-charcoal-900 font-body selection:bg-brown-200 overflow-x-hidden">
      
      {/* CHAPTER 1: THE EXPERTISE (Hero) */}
      <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#fbf4eb] z-20" />
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
      <section className="relative z-10 py-20 md:py-28 px-6">
        <div className="max-w-400 mx-auto">
          
          {/* Advanced Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-24 gap-12 border-b border-charcoal-900/10 pb-16">
            <ScrollReveal direction="left">
              <div className="space-y-4">
                <h2 className="font-display text-5xl md:text-6xl text-charcoal-900 leading-none">The Services.</h2>
                <p className="text-charcoal-500 font-light text-sm tracking-wide">Explore our specialized design domains</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" className="flex flex-wrap gap-4">
              {categories.map((cat: string) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 2xl:gap-10">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [1, 2, 3].map(n => (
                  <div key={n} className="aspect-4/5 bg-white/50 animate-pulse rounded-[3.5rem] p-6">
                    <div className="h-full w-full bg-charcoal-100/50 rounded-[2.5rem]" />
                  </div>
                ))
              ) : (
                filteredServices.map((service: ServiceCard, idx: number) => (
                  <motion.div
                    key={service._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    {(() => {
                      const price = buildCompactPriceLabel(service.startingPrice)

                      return (
                    <div className="group bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brown-900/5 transition-all duration-700 border border-charcoal-900/5 h-full flex flex-col p-3">
                      <Link href={`/services/${service.slug}`} className="block">
                        <div className="relative aspect-16/10 overflow-hidden rounded-3xl mb-6">
                        <Image
                          src={service.hero?.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200"}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-charcoal-900/5 group-hover:bg-transparent transition-all" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-charcoal-900 text-[9px] font-bold uppercase tracking-[0.22em] shadow-sm border border-charcoal-900/5">
                            {service.category}
                          </span>
                        </div>
                        </div>
                      </Link>

                      <div className="px-5 pb-6 flex flex-col flex-1">
                        <Link href={`/services/${service.slug}`} className="block">
                          <h3 className="font-display text-3xl xl:text-2xl 2xl:text-3xl text-charcoal-900 mb-5 group-hover:text-brown-700 transition-colors leading-tight">
                            {service.title}
                          </h3>
                        </Link>

                        <p className="font-body text-charcoal-500 text-sm leading-relaxed line-clamp-3 mb-7 font-light">
                          {service.shortDescription || "Elevating your space through meticulous design and expert project management."}
                        </p>

                        <div className="mt-auto pt-6 border-t border-charcoal-900/5 space-y-4">
                          <Link
                            href={buildServiceQuoteHref('/services', service.slug)}
                            onClick={(e) => {
                              e.preventDefault()
                              const href = buildServiceQuoteHref('/services', service.slug)
                              router.push(href, { scroll: false })
                              
                              // Force a hashchange event if router.push doesn't trigger it
                              // or if we're already on the page with a different query but same hash
                              if (window.location.hash === '#quote') {
                                // If already has #quote, we might need to manually trigger the handler
                                window.dispatchEvent(new HashChangeEvent('hashchange'))
                              } else {
                                window.location.hash = 'quote'
                              }
                            }}
                            className="group/price grid w-full grid-cols-[auto_1fr] items-center gap-x-3 rounded-2xl border border-amber-500/25 bg-linear-to-r from-[#fff6db] via-white to-[#fbf4eb] px-4 py-3 text-charcoal-900 shadow-[0_12px_28px_rgba(61,31,13,0.08)] transition-all hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-[0_18px_40px_rgba(61,31,13,0.13)]"
                          >
                            <span className="row-span-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white transition-colors group-hover/price:bg-brown-800">
                              <IndianRupee size={16} />
                            </span>
                            <span className="min-w-0 text-[9px] font-bold uppercase tracking-[0.22em] text-charcoal-900/45">
                              Starts from
                            </span>
                            <span className="flex min-w-0 items-baseline gap-1.5">
                              <span className="whitespace-nowrap font-display text-lg leading-none text-brown-900 2xl:text-xl">
                                {price.amount}
                              </span>
                              <span className="shrink-0 translate-y-1 text-[9px] font-bold uppercase leading-none tracking-[0.14em] text-brown-800/62">
                                {price.unit}
                              </span>
                            </span>
                          </Link>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#fbf4eb] flex items-center justify-center text-brown-600">
                                <Ruler size={16} />
                              </div>
                              <Link href={`/services/${service.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 hover:text-brown-700 transition-colors">
                                View Domain
                              </Link>
                            </div>
                            <ArrowRight size={20} className="text-charcoal-300 group-hover:translate-x-2 group-hover:text-brown-600 transition-all duration-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                      )
                    })()}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CHAPTER 3: THE CRAFT (Storytelling Showcase) */}
      <section className="relative py-32 md:py-56 px-6 bg-[#fbf4eb]">
        <div className="max-w-400 mx-auto">
          <ScrollReveal>
            <div className="mb-24 max-w-4xl">
              <h2 className="font-display text-5xl md:text-8xl text-charcoal-900 leading-none tracking-tight mb-8">
                The key difference between <br className="hidden md:block"/> ordinary and <span className="italic text-brown-600">special.</span>
              </h2>
              <p className="text-xl md:text-2xl text-charcoal-500 font-light leading-relaxed">
                No matter the season, our spaces are as nuanced as the lifestyles they reflect. Explore the meticulous details that turn a house into a bespoke Indian home.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-32 md:space-y-56">

            {/* Story 1: Modular Kitchens */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="md:col-span-7 relative h-[60vh] md:h-[80vh] rounded-[2.5rem] overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
                  alt="Intelligent Modular Kitchens"
                  fill
                  className="object-cover"
                />
              </motion.div>
              
              <div className="md:col-span-5 md:-ml-24 z-10 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white p-10 md:p-14 rounded-4xl shadow-2xl shadow-brown-900/5 relative"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brown-600 mb-6 block">01 / Culinary Excellence</span>
                  <h3 className="font-display text-4xl md:text-5xl text-charcoal-900 mb-6 leading-tight">Intelligent Modular Kitchens</h3>
                  <p className="text-charcoal-600 font-light leading-relaxed md:text-lg mb-8">
                    The heart of an Indian home requires a delicate balance of robust functionality and seamless aesthetics. We design ergonomic layouts with premium hardware, ensuring adequate ventilation, seamless appliance integration, and customized storage for every spice and utensil.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {['Moisture-resistant materials', 'Custom pantry units', 'Integrated ambient lighting'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-charcoal-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-brown-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Story 2: Living Spaces with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
              <div className="md:col-span-4 md:col-start-2 z-10 order-2 md:order-1">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                  className="space-y-12"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brown-600 mb-6 block">02 / Shared Moments</span>
                    <h3 className="font-display text-4xl md:text-5xl text-charcoal-900 mb-6 leading-tight">Elevated Living Rooms</h3>
                    <p className="text-charcoal-600 font-light leading-relaxed md:text-lg">
                      We treat living spaces as the narrative core of the home. Through layered lighting, rich material textures, and bespoke joinery, we craft environments that naturally invite conversation, relaxation, and grand entertaining.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 border-t border-charcoal-900/10 pt-10">
                    <div>
                      <p className="font-display text-5xl text-brown-700 mb-2">300<span className="text-brown-400">+</span></p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-500">Spaces unified</p>
                    </div>
                    <div>
                      <p className="font-display text-5xl text-brown-700 mb-2">100<span className="text-brown-400">%</span></p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-500">Tailored comfort</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1 }}
                className="md:col-span-6 md:col-start-7 relative h-[70vh] md:h-[90vh] rounded-[2.5rem] overflow-hidden order-1 md:order-2"
              >
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
                  alt="Elevated Living Rooms"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Story 3: Bedrooms & Retreats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="relative h-[65vh] rounded-[2.5rem] overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200"
                  alt="Master Bedroom Sanctuaries"
                  fill
                  className="object-cover"
                />
              </motion.div>
              
              <div className="flex flex-col justify-center h-full space-y-12">
                 <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                 >
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brown-600 mb-6 block">03 / Personal Sanctuaries</span>
                    <h3 className="font-display text-4xl md:text-5xl text-charcoal-900 mb-6 leading-tight">Master En-suites & Wardrobes</h3>
                    <p className="text-charcoal-600 font-light leading-relaxed md:text-lg mb-8">
                      Bedrooms should act as sensory reset spaces. We integrate deeply personalized wardrobe architecture, soothing color palettes, and ambient lighting to ensure the first and last hours of your day are grounded in tranquility.
                    </p>
                 </motion.div>
                 
                 <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative h-[40vh] w-[80%] rounded-4xl overflow-hidden ml-auto"
                 >
                  <Image
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1000"
                    alt="Wardrobe Details"
                    fill
                    className="object-cover"
                  />
                 </motion.div>
              </div>
            </div>

            {/* Story 4: Materials & Execution */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="bg-charcoal-900 rounded-[3rem] p-10 md:p-24 text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-125 h-125 bg-brown-800/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
              
              <div className="relative z-10 max-w-3xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brown-400 mb-6 block">04 / The Finer Grain</span>
                <h3 className="font-display text-4xl md:text-6xl text-white mb-8 leading-tight">
                  Materials with longevity. <br/> Execution with exactness.
                </h3>
                <p className="text-white/70 font-light leading-relaxed md:text-lg mb-12 max-w-2xl">
                  From imported Italian marble and Indian granites, to bespoke brass inlays and acoustic wooden paneling—we source and execute materials that don't just look spectacular on day one, but age gracefully with your building.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/20 pt-12">
                  {[
                    { label: 'Surface Textures', value: 'Bespoke' },
                    { label: 'Wood & Joinery', value: 'Precision' },
                    { label: 'Metal Details', value: 'Crafted' },
                    { label: 'Spatial Light', value: 'Sculpted' },
                  ].map((item, i) => (
                    <div key={i}>
                       <p className="font-display text-2xl md:text-3xl text-white mb-2">{item.value}</p>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CHAPTER 4: THE METHOD (Process CTA) */}
      <section className="py-56 px-6 bg-white rounded-t-[5rem]">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24">
             <div className="w-full md:w-1/2 space-y-12">
                <div className="space-y-6">
                   <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">The Collaboration</span>
                   <h2 className="font-display text-6xl md:text-8xl text-charcoal-900 leading-tight">Bespoke <br /> <span className="italic text-brown-600">Mastery.</span></h2>
                </div>
                 <p className="text-xl text-charcoal-500 font-light leading-relaxed max-w-xl">
                   Ready to transform your vision into an architectural reality? Let&apos;s discuss your project goals and create something extraordinary.
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
