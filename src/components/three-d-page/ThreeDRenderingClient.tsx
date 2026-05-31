'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, Layers, Cuboid, Eye, ArrowDown, ChevronRight, Play, Box } from 'lucide-react'
import ThreeDRenderingForm from '@/components/forms/ThreeDRenderingForm'

const ThreeDShowcaseScene = dynamic(() => import('@/components/three/ThreeDShowcaseScene'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

/* ─── Stagger fade-in helper ─── */
const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } },
  item: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } },
}

/* ─── Gallery images ─── */
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop', label: 'Living Room' },
  { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop', label: 'Bedroom Suite' },
  { src: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop', label: 'Kitchen Design' },
  { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop', label: 'Luxury Villa' },
  { src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop', label: 'Dining Space' },
  { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop', label: 'Master Bath' },
]

/* ─── Process steps ─── */
const steps = [
  { num: '01', title: 'Share Your Floor Plan', desc: 'Upload your architectural drawings or share dimensions. Our team reviews every detail.' },
  { num: '02', title: 'Design Consultation', desc: 'We discuss your style preferences, color palettes, materials and lifestyle needs.' },
  { num: '03', title: 'Receive 3D Renders', desc: 'Get photorealistic renders of every room. Request unlimited revisions until perfect.' },
  { num: '04', title: 'Begin Construction', desc: 'Start your interior project with complete visual clarity. No surprises, no regrets.' },
]

export default function ThreeDRenderingClient({ price }: { price: string }) {
  const heroRef = useRef<HTMLElement>(null)
  const processRef = useRef<HTMLElement>(null)
  const [activeGallery, setActiveGallery] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

  /* ─── GSAP scroll animations for process section ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.process-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, x: i % 2 === 0 ? -60 : 60, rotateY: i % 2 === 0 ? 6 : -6 },
          {
            opacity: 1, x: 0, rotateY: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.stat-counter').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1, scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          }
        )
      })
    }, processRef)

    return () => ctx.revert()
  }, [])

  /* ─── Gallery auto-cycle ─── */
  useEffect(() => {
    const interval = setInterval(() => setActiveGallery((p) => (p + 1) % galleryImages.length), 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative bg-[#0d0a07] text-white overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
          HERO — Full-screen 3D Scene + Overlay Text
      ═══════════════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        {/* Three.js Canvas */}
        <ThreeDShowcaseScene />

        {/* Dark gradient overlays for text readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0d0a07] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0d0a07]/80 via-[#0d0a07]/40 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-[1400px] mx-auto w-full px-5 sm:px-6 lg:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center pt-28 pb-20 sm:pt-32 lg:py-0"
        >
          <div className="space-y-6 sm:space-y-8">
            <motion.div variants={stagger.item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 sm:px-5 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[#C8A47E] backdrop-blur-md">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Premium 3D Home Visualization
            </motion.div>

            <motion.h1 variants={stagger.item} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[5.2rem] leading-[1.05] tracking-tight">
              See your home
              <br />
              <span className="bg-gradient-to-r from-[#C8A47E] via-[#e8d5b8] to-[#C8A47E] bg-clip-text text-transparent italic">
                before it&apos;s built.
              </span>
            </motion.h1>

            <motion.p variants={stagger.item} className="max-w-lg text-base sm:text-lg text-white/60 leading-relaxed font-light">
              Experience photorealistic 3D renders of your future interiors. Every texture, every shadow, every detail — visualized with cinematic precision.
            </motion.p>

            <motion.div variants={stagger.item} className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 sm:px-6 py-3 sm:py-4">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/40">Starting at</p>
                <p className="font-display text-2xl sm:text-3xl text-white mt-1">
                  ₹{price}
                  <span className="text-xs sm:text-sm font-sans font-normal text-white/40"> /sq.ft.</span>
                </p>
              </div>
              <a href="#contact-form" className="group flex items-center gap-3 rounded-2xl bg-[#C8A47E] px-5 sm:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#1a1511] transition-all hover:bg-white hover:shadow-xl hover:shadow-[#C8A47E]/20">
                Get Started
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>

          {/* Right side stats — visible on mobile as horizontal row, vertical column on lg */}
          <motion.div variants={stagger.item} className="flex flex-row lg:flex-col items-stretch lg:items-end gap-3 sm:gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {[
              { value: '1000+', label: 'Renders Delivered' },
              { value: '100%', label: 'Client Satisfaction' },
              { value: '48h', label: 'Average Turnaround' },
            ].map((s, i) => (
              <div key={i} className="flex-shrink-0 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm px-5 sm:px-8 py-4 sm:py-5 text-center lg:text-right min-w-[120px]">
                <p className="font-display text-xl sm:text-3xl text-white">{s.value}</p>
                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Scroll to explore</p>
          <ArrowDown className="h-4 w-4 text-white/30 animate-bounce" />
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES SECTION — Dark immersive
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#0d0a07]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-[#C8A47E]/30" />
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12 sm:mb-20"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A47E] mb-4">Why 3D Visualization</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              Beyond imagination.<br />
              <span className="text-white/40">Into reality.</span>
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:gap-8 md:grid-cols-3">
            {[
              { icon: Cuboid, title: 'Spatial Clarity', desc: 'Understand the exact scale, proportion, and flow of your rooms before a single brick is laid.' },
              { icon: Layers, title: 'Material Preview', desc: 'Test different laminates, veneers, paints, and finishes virtually to find the perfect combination.' },
              { icon: Eye, title: 'Lighting Design', desc: 'See exactly how natural and artificial light will illuminate and transform your space throughout the day.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-3xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#C8A47E]/20 hover:bg-white/[0.04]"
              >
                <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#C8A47E]/10 text-[#C8A47E] transition-colors group-hover:bg-[#C8A47E] group-hover:text-[#1a1511]">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-white mb-2 sm:mb-3">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          GALLERY — Cinematic showcase
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#100d09]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A47E] mb-4">Portfolio</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white">Sample 3D Renders</h2>
          </motion.div>

          {/* Main showcase image */}
          <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden aspect-[4/3] sm:aspect-[16/9] mb-4 sm:mb-6 shadow-2xl shadow-black/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGallery}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={galleryImages[activeGallery].src}
                  alt={galleryImages[activeGallery].label}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </motion.div>
            </AnimatePresence>

            {/* Label overlay */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-10">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/50">Featured Render</p>
              <p className="font-display text-xl sm:text-3xl text-white mt-1">{galleryImages[activeGallery].label}</p>
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-10 flex gap-1.5 sm:gap-2">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${i === activeGallery ? 'w-8 bg-[#C8A47E]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveGallery(i)}
                className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-500 ${i === activeGallery ? 'ring-2 ring-[#C8A47E] ring-offset-2 ring-offset-[#100d09]' : 'opacity-50 hover:opacity-80'}`}
              >
                <Image src={img.src} alt={img.label} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section ref={processRef} className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#0d0a07]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A47E] mb-4">How It Works</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white">Four simple steps</h2>
          </motion.div>

          <div className="grid gap-5 sm:gap-8 md:grid-cols-2">
            {steps.map((step, i) => (
              <div
                key={i}
                className="process-card group rounded-3xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 transition-all duration-500 hover:border-[#C8A47E]/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-6">
                  <div className="stat-counter flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#C8A47E]/10 font-display text-lg sm:text-2xl text-[#C8A47E] group-hover:bg-[#C8A47E] group-hover:text-[#1a1511] transition-colors">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl text-white mb-2">{step.title}</h3>
                    <p className="text-white/50 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CONTACT FORM — Glassy dark theme
      ═══════════════════════════════════════════════════════════ */}
      <section id="contact-form" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#100d09]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-[#C8A47E]/30" />

        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A47E] mb-4">Get Started</p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
                  Request your<br />
                  <span className="text-white/40">3D consultation.</span>
                </h2>
                <p className="text-white/50 text-lg leading-relaxed">
                  Fill out the form and our design team will get back to you within 24 hours with a personalized quote based on your project area.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Box, text: 'Photorealistic renders of every room' },
                  { icon: Layers, text: 'Unlimited revision rounds included' },
                  { icon: Eye, text: 'Virtual walkthrough experience' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8A47E]/10 text-[#C8A47E]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="text-white/60">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ThreeDRenderingForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
