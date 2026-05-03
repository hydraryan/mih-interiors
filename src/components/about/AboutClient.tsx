'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { Sparkles, Quote, MoveRight, Layers, Fingerprint, Compass, Zap, Heart } from 'lucide-react'

interface AboutClientProps {
  images: {
    hero: string
    vision: string
    visionDetail: string
    craft: string
    materials: string
    founder: string
  }
}

export default function AboutClient({ images }: AboutClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001
  })

  const heroScale = useTransform(smoothProgress, [0, 0.15], [1, 1.05])
  const heroOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#fbf4eb] text-charcoal-900 font-body selection:bg-brown-200 selection:text-charcoal-900 overflow-x-hidden">
      
      {/* CHAPTER 1: THE PRELUDE (Pure Ethereal Hero) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-white/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-[#fbf4eb] z-20" />
          <Image 
            src={images.hero}
            alt="The Modern Sanctuary"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>

        <div className="relative z-30 text-center px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-10 inline-flex items-center gap-3 rounded-full border border-charcoal-900/10 bg-[#fbf4eb]/50 px-5 py-2 backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-brown-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal-700">The MIH Narrative</span>
              </motion.div>
              
              <h1 className="font-display text-7xl md:text-[11rem] leading-[0.8] text-charcoal-900 tracking-tighter">
                Art of <br />
                <span className="italic text-brown-600">Soulful</span> Living.
              </h1>
              
              <p className="mt-12 max-w-xl text-lg md:text-xl leading-relaxed text-charcoal-500 font-light">
                Since 2009, we have been crafting modern legacies that resonate with the quiet confidence of home.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-charcoal-300">
          <div className="h-16 w-px bg-gradient-to-b from-charcoal-900/20 to-transparent animate-pulse" />
        </div>
      </section>

      {/* CHAPTER 2: THE VISION (Warm, Airy, layered) */}
      <section className="relative z-10 py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-16">
              <ScrollReveal direction="left">
                <div className="space-y-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">Chapter I: The Vision</span>
                  <h2 className="font-display text-6xl md:text-8xl leading-tight text-charcoal-900">
                    Redefining <br /> 
                    <span className="text-brown-700 italic">Elegance.</span>
                  </h2>
                </div>
                <div className="space-y-8 text-xl leading-relaxed text-charcoal-600 font-light">
                  <p>
                    Luxury is not a price tag; it is a feeling of absolute belonging. We believe every space should be a mirror to your highest self.
                  </p>
                  <p className="text-charcoal-400">
                    Our approach combines the rigour of architectural planning with the warmth of handcrafted materiality.
                  </p>
                </div>
                
                <div className="pt-12 grid grid-cols-2 gap-12 border-t border-charcoal-900/10">
                  <div className="space-y-2">
                    <span className="block font-display text-5xl text-brown-800">500+</span>
                    <span className="block text-[9px] uppercase tracking-widest font-bold text-charcoal-400">Projects Manifested</span>
                  </div>
                  <div className="space-y-2">
                    <span className="block font-display text-5xl text-brown-800">120+</span>
                    <span className="block text-[9px] uppercase tracking-widest font-bold text-charcoal-400">Master Craftsmen</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="relative">
              <ScrollReveal direction="right">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl border-[16px] border-white">
                  <Image 
                    src={images.vision}
                    alt="The MIH Vision"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <motion.div 
                  style={{ y: useTransform(smoothProgress, [0.1, 0.4], [50, -50]) }}
                  className="absolute -bottom-16 -left-16 hidden md:block w-72 h-96 overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl"
                >
                  <Image 
                    src={images.visionDetail}
                    alt="Material Detail"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 3: THE CRAFT (Editorial Detail) */}
      <section className="py-48 bg-white border-y border-charcoal-900/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto mb-32 space-y-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">Chapter II: The Craft</span>
              <h2 className="font-display text-6xl md:text-8xl text-charcoal-900 leading-[1.1]">Where Art Meets <span className="italic text-brown-600">Texture.</span></h2>
              <p className="text-xl text-charcoal-500 font-light leading-relaxed">
                We obsess over the details that others overlook—the way light hits a grain of wood, the tactile weight of a stone handle, the silent flow of a corridor.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal direction="up">
               <div className="group relative aspect-[16/10] overflow-hidden rounded-[3rem] shadow-xl bg-[#f6efe6]">
                  <Image 
                    src={images.craft} 
                    alt="Craftmanship" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-charcoal-900/5 group-hover:bg-transparent transition-all" />
               </div>
               <div className="mt-8 text-left space-y-3">
                  <h4 className="font-display text-2xl text-charcoal-900">Artisanal Precision</h4>
                  <p className="text-sm text-charcoal-500 max-w-sm">Every piece is hand-finished by masters who have dedicated their lives to their trade.</p>
               </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
               <div className="group relative aspect-[16/10] overflow-hidden rounded-[3rem] shadow-xl bg-[#f6efe6]">
                  <Image 
                    src={images.materials} 
                    alt="Materials" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-charcoal-900/5 group-hover:bg-transparent transition-all" />
               </div>
               <div className="mt-8 text-left space-y-3">
                  <h4 className="font-display text-2xl text-charcoal-900">Honest Materials</h4>
                  <p className="text-sm text-charcoal-500 max-w-sm">We believe in the beauty of raw textures—solid oak, natural marble, and layered linens.</p>
               </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CHAPTER 4: THE VISIONARY (Warm, Minimalist Founder) */}
      <section className="py-48 px-6 bg-[#fbf4eb]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="w-full lg:w-2/5">
                <ScrollReveal>
                   <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden shadow-2xl border-[16px] border-white">
                      <Image 
                        src={images.founder}
                        alt="Mohit Mahajan - Founder"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                   </div>
                </ScrollReveal>
             </div>
             
             <div className="w-full lg:w-3/5 space-y-12">
                <ScrollReveal direction="right">
                   <div className="space-y-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">Founder's Note</span>
                      <Quote className="h-12 w-12 text-brown-600/30" />
                      <h3 className="font-display text-4xl md:text-6xl leading-tight text-charcoal-900 italic">
                        "Your home is the silent witness to your life's greatest stories. It should be worthy of them."
                      </h3>
                   </div>
                   <p className="text-xl leading-relaxed text-charcoal-600 font-light max-w-2xl">
                      Since founding MIH in 2009, I have been on a mission to bring architectural integrity and soulful design to the most discerning homes in the region.
                   </p>
                   <div className="pt-8">
                      <span className="block font-display text-3xl text-charcoal-900">Mohit Mahajan</span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-brown-700">Founder & Visionary</span>
                   </div>
                </ScrollReveal>
             </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 5: THE PROCESS (Clean, Functional steps) */}
      <section className="py-48 px-6 bg-white rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">The Methodology</span>
              <h2 className="font-display text-6xl md:text-8xl text-charcoal-900 leading-none">The <span className="italic">Process.</span></h2>
            </div>
            <p className="text-charcoal-500 max-w-sm text-sm leading-relaxed">
              Every project is a unique composition, handled with absolute precision and devotion to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <ProcessCard 
               num="01" 
               title="Discovery" 
               desc="We dive deep into your lifestyle, aspirations, and the unique spirit of your space." 
               icon={Compass} 
             />
             <ProcessCard 
               num="02" 
               title="Curation" 
               desc="Architectural precision meets artistic selection of materials, lighting, and textures." 
               icon={Layers} 
             />
             <ProcessCard 
               num="03" 
               title="Transformation" 
               desc="The moment your vision is fully realized—a masterfully crafted home ready for you." 
               icon={Zap} 
             />
          </div>
        </div>
      </section>

      {/* CHAPTER 6: THE CALL (Soft, Elegant CTA) */}
      <section className="py-64 px-6 text-center bg-[#fbf4eb]">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto space-y-16">
            <h2 className="font-display text-7xl md:text-[11rem] leading-[0.8] text-charcoal-900 tracking-tighter">
              Build your <br /> <span className="italic text-brown-700">Sanctuary.</span>
            </h2>
            <p className="text-xl md:text-2xl text-charcoal-500 font-light max-w-2xl mx-auto">
              We work with only a few clients each year to ensure uncompromising excellence. Let's start the conversation.
            </p>
            <div className="pt-8">
               <button 
                 onClick={() => { window.location.hash = 'quote' }}
                 className="group inline-flex items-center gap-6 rounded-full bg-charcoal-900 px-16 py-8 text-xs font-bold uppercase tracking-[0.4em] text-white transition-all hover:bg-brown-900 hover:shadow-2xl active:scale-95 shadow-xl"
               >
                 Start Your Estimate
                 <MoveRight className="h-5 w-5 transition-transform group-hover:translate-x-3" />
               </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}

function ProcessCard({ num, title, desc, icon: Icon }: { num: string, title: string, desc: string, icon: any }) {
  return (
    <ScrollReveal className="relative group p-12 rounded-[3.5rem] border border-charcoal-900/5 bg-[#fbf4eb]/30 hover:bg-white hover:shadow-2xl transition-all duration-700">
       <div className="mb-12 flex items-start justify-between">
          <span className="font-display text-6xl text-charcoal-900/10">{num}</span>
          <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-brown-600 shadow-sm transition-colors group-hover:bg-charcoal-900 group-hover:text-white">
             <Icon className="h-6 w-6" />
          </div>
       </div>
       <h4 className="font-display text-3xl text-charcoal-900 mb-4">{title}</h4>
       <p className="text-sm leading-relaxed text-charcoal-500 font-light">{desc}</p>
    </ScrollReveal>
  )
}
