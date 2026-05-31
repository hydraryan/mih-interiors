"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Award, Users, Calendar, TrendingUp, ArrowRight, Sparkles, Shield, Eye, Gem } from "lucide-react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="w-full relative overflow-hidden"
    >
      {/* ── Cream-to-Dark transition zone ── */}
      <div className="bg-[#FAF8F4] pb-16 md:pb-20" />

      {/* ── Dark Section ── */}
      <div className="bg-charcoal-900 relative">
        {/* Curved top edge */}
        <div className="absolute -top-1 left-0 w-full overflow-hidden" style={{ height: "80px" }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 80V40C0 40 360 0 720 0C1080 0 1440 40 1440 40V80H0Z" fill="#1a1a1a" />
          </svg>
        </div>
        <div className="absolute -top-1 left-0 w-full" style={{ height: "80px" }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 80V40C0 40 360 0 720 0C1080 0 1440 40 1440 40V80H0Z" className="fill-charcoal-900" />
          </svg>
        </div>

        {/* Ambient glows */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-amber-600/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative pt-24 md:pt-32 pb-20 md:pb-28">
          <div className="max-w-[1300px] mx-auto px-6 md:px-12">

            {/* ── Label ── */}
            <motion.div
              className="flex items-center gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-px bg-amber-500" />
              <span className="font-body text-xs text-amber-400 uppercase tracking-[0.35em] font-semibold">About MIH Interiors</span>
            </motion.div>

            {/* ── Main Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-28">

              {/* Left: Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] text-white leading-[1.08] tracking-tight mb-8">
                  Where Vision Meets<br />
                  <span className="text-amber-400">Masterful</span> Execution.
                </h2>

                <p className="font-body text-white/60 text-base md:text-[1.05rem] leading-[1.8] mb-5 max-w-lg">
                  Founded by <strong className="text-white font-semibold">Ar. Mohit Mahajan</strong>, MIH Interiors has transformed over 1,000 spaces across Chandigarh, Punjab & North India — blending timeless aesthetics with modern precision.
                </p>
                <p className="font-body text-white/35 text-sm leading-relaxed mb-10 max-w-lg">
                  Every project begins with a hyper-realistic 3D visualization and transparent pricing. No surprises — just quality craftsmanship from concept to completion.
                </p>

                {/* Trust Pillars — Icon Grid */}
                <div className="grid grid-cols-2 gap-4 mb-12 max-w-lg">
                  {[
                    { icon: <Eye size={18} />, label: "3D Visualization", desc: "See it before we build it" },
                    { icon: <Shield size={18} />, label: "Transparent Pricing", desc: "Zero hidden costs, ever" },
                    { icon: <Sparkles size={18} />, label: "End-to-End Service", desc: "Concept to completion" },
                    { icon: <Gem size={18} />, label: "Premium Materials", desc: "Only the finest quality" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/[0.04] rounded-xl px-4 py-4 hover:bg-white/[0.07] transition-colors duration-400 group">
                      <div className="text-amber-400 mb-2.5 group-hover:text-amber-300 transition-colors">{item.icon}</div>
                      <span className="font-body text-[13px] font-semibold text-white/85 block mb-0.5">{item.label}</span>
                      <span className="font-body text-[11px] text-white/30">{item.desc}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-charcoal-900 rounded-full font-body text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-400 transition-all duration-500 shadow-lg shadow-amber-500/20"
                >
                  More About Us
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>

              {/* Right: Image Composition */}
              <motion.div
                className="relative lg:pt-4"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.3 }}
              >
                {/* Main image */}
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                  <Image
                    src="/residential-sites-photos/17.jpeg"
                    alt="MIH Interiors — Premium Interior Design"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/50 via-transparent to-charcoal-900/10" />

                  {/* Founder credit overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-charcoal-900 font-display text-lg font-bold flex-shrink-0">
                        M
                      </div>
                      <div>
                        <p className="font-body text-white text-sm font-semibold">Ar. Mohit Mahajan</p>
                        <p className="font-body text-white/50 text-xs">Founder & Lead Architect</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating accent image */}
                <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-[40%] aspect-[3/4] rounded-xl overflow-hidden border-[3px] border-charcoal-900 shadow-xl z-10">
                  <Image
                    src="/commercial-sites-photos/1.jpeg"
                    alt="MIH Interiors Studio"
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                </div>

                {/* Experience tag */}
                <div className="absolute top-8 right-6 md:right-8 z-10">
                  <div className="bg-charcoal-900/80 backdrop-blur-md border border-white/10 text-white px-4 py-3 rounded-xl shadow-xl">
                    <span className="font-display text-2xl block leading-none text-amber-400">18+</span>
                    <span className="font-body text-[8px] text-white/50 uppercase tracking-[0.2em] mt-0.5 block">Years</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Stats Row ── */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { icon: <Award size={18} />, value: 1000, label: "Projects", suffix: "+" },
                { icon: <Users size={18} />, value: 1200, label: "Happy Clients", suffix: "+" },
                { icon: <Calendar size={18} />, value: 18, label: "Years", suffix: "+" },
                { icon: <TrendingUp size={18} />, value: 98, label: "Satisfaction", suffix: "%" },
              ].map((stat, i) => (
                <StatCell key={stat.label} {...stat} index={i} />
              ))}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Stat Cell ── */
function StatCell({ icon, value, label, suffix, index }: { icon: React.ReactNode; value: number; label: string; suffix: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const springValue = useSpring(0, { stiffness: 50, damping: 12 })

  useEffect(() => {
    springValue.set(isInView ? value : 0)
  }, [isInView, value, springValue])

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest))

  return (
    <div
      ref={ref}
      className="text-center group"
    >
      <div className="font-display text-4xl md:text-5xl text-white tracking-tight flex items-center justify-center mb-2">
        <motion.span>{displayValue}</motion.span>
        <span className="text-amber-400">{suffix}</span>
      </div>
      <div className="w-8 h-px bg-white/10 mx-auto mb-2 group-hover:bg-amber-500/40 group-hover:w-12 transition-all duration-500" />
      <p className="font-body text-white/35 text-[10px] uppercase tracking-[0.25em] font-medium">{label}</p>
    </div>
  )
}
