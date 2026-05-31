"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Phone, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CTABanner({ imageSrc = '/commercial-sites-photos/2.jpeg' }: { imageSrc?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section ref={sectionRef} className="relative bg-cream-100 pt-4 pb-16 md:pb-24 px-6 md:px-12">
      <div className="max-w-325 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-4xl overflow-hidden bg-charcoal-900 min-h-105 md:min-h-120"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={imageSrc}
              alt="MIH Interiors — Premium Interior"
              fill
              className="object-cover opacity-[0.15]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-r from-charcoal-900 via-charcoal-900/95 to-charcoal-900/70" />
          </div>

          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-100 h-100 bg-amber-500/8 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-75 h-75 bg-amber-600/5 rounded-full blur-[80px]" />

          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 p-10 md:p-16 lg:p-20">

            {/* Left: Text */}
            <div className="max-w-xl text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex items-center gap-3 mb-6 justify-center lg:justify-start"
              >
                <div className="w-8 h-px bg-amber-500" />
                <span className="font-body text-xs text-amber-400 uppercase tracking-[0.3em] font-semibold">Start Your Project</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] text-white leading-[1.08] tracking-tight mb-6"
              >
                Ready to Transform{" "}
                <span className="text-amber-400">Your Space?</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-body text-white/50 text-base md:text-lg leading-relaxed mb-10"
              >
                Get a transparent, AI-driven estimate in minutes — or speak directly with Ar. Mohit Mahajan about your vision.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 text-charcoal-900 rounded-full font-body text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-400 transition-all duration-500 shadow-lg shadow-amber-500/20"
                >
                  <Sparkles size={16} />
                  Get Instant Quote
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/6 backdrop-blur-sm text-white border border-white/10 rounded-full font-body text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                >
                  <Phone size={14} />
                  Contact Us
                  <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>
            </div>

            {/* Right: Trust indicators */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="shrink-0 hidden lg:block"
            >
              <div className="relative w-70">
                {/* Glass card */}
                <div className="bg-white/6 backdrop-blur-md border border-white/8 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-5">
                    <Sparkles size={24} className="text-amber-400" />
                  </div>
                  <span className="font-display text-5xl text-white block mb-1">Free</span>
                  <span className="font-body text-white/40 text-sm block mb-6">AI-Powered Estimate</span>

                  <div className="w-full h-px bg-white/6 mb-6" />

                  <div className="space-y-3 text-left">
                    {[
                      "Instant room-by-room pricing",
                      "3D visualization preview",
                      "No obligations attached",
                      "Direct architect consultation",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <div className="w-1 h-1 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <span className="font-body text-white/50 text-[13px] leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-amber-500 text-charcoal-900 px-4 py-2 rounded-xl font-body text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-amber-500/25">
                  ✦ Popular
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
