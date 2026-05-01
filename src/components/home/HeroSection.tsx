'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'

export default function HeroSection({ imageSrc = '/hero_image.jpg' }: { imageSrc?: string }) {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  
  const imgY = useTransform(scrollY, [0, 600], [0, 120])
  const imgScale = useTransform(scrollY, [0, 600], [1.05, 1.15])
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section 
      ref={containerRef}
      className="relative h-screen min-h-200 overflow-hidden bg-cream-50 flex flex-col justify-center items-center"
    >
      {/* ── Background Image with Parallax ── */}
      <motion.div 
        style={{ scale: imgScale, y: imgY }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={imageSrc}
          alt="Luxury Interior Design by MIH Interiors, Chandigarh"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* ── Radial White Opacity Overlay ── */}
      {/* This makes the text highly readable in the center but keeps the image fully visible at the edges */}
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.5)_40%,rgba(255,255,255,0.1)_100%)] backdrop-blur-[1px]" />
      
      {/* ── Main Content: Perfectly Centered ── */}
      <motion.div 
        style={{ opacity: contentOpacity }}
        className="relative z-10 w-full px-4 sm:px-6 md:px-12 flex flex-col justify-center items-center pt-32 sm:pt-28 pb-8"
      >
        <div className="max-w-4xl w-full flex flex-col items-center text-center">

          {/* Headline */}
          <div className="space-y-1 mb-6">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] text-brown-900 leading-none tracking-tight"
              >
                Your Dream Space
              </motion.h1>
            </div>
            <div className="overflow-hidden pb-3">
              <motion.h2
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[5rem] text-brown-800 leading-[1.1]"
              >
                Starts <span className="italic font-light">with Artistry.</span>
              </motion.h2>
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="max-w-2xl text-charcoal-800/80 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-10"
          >
            Bespoke interiors curated by <span className="font-medium text-charcoal-900">MIH Interiors</span>. From concept to 3D reality, we transform spaces into timeless legacies.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full"
          >
            {/* Primary Dark Button */}
            <button
              onClick={() => { window.location.hash = 'quote' }}
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-brown-900 text-cream-100 rounded-full font-body text-xs uppercase tracking-[0.15em] font-bold hover:bg-brown-800 transition-all duration-500 shadow-xl shadow-brown-900/20"
            >
              Get Free Estimate
            </button>

            {/* Secondary White Button */}
            <Link
              href="/projects"
              className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-full border border-charcoal-900/10 bg-white/80 backdrop-blur-sm font-body text-xs uppercase tracking-[0.15em] font-bold text-charcoal-900 hover:bg-white hover:border-charcoal-900/20 transition-colors shadow-sm"
            >
              Explore Portfolio
              <ArrowRight className="w-4 h-4 text-charcoal-900/50 group-hover:text-charcoal-900 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>

          {/* ── Premium Highlighted Trust Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 w-full max-w-5xl mx-auto"
          >
            <div className="relative bg-white/95 backdrop-blur-xl border-x border-b border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden group">
              {/* Premium Top Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-400 to-amber-600" />
              
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-linear-to-b from-white/50 to-transparent pointer-events-none" />

              <div className="relative flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 py-6 sm:py-8 gap-y-6">
                
                {/* Stat 1 */}
                <div className="flex items-center gap-4 flex-1 justify-center md:justify-start w-full">
                  <span className="font-display text-5xl sm:text-6xl text-charcoal-900 leading-none font-bold tracking-tight">18<span className="text-amber-500 font-medium text-4xl sm:text-5xl">+</span></span>
                  <div className="flex flex-col text-left">
                    <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal-900 font-bold leading-tight">Years of</span>
                    <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal-500 font-semibold leading-tight">Excellence</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full md:w-px h-px md:h-16 bg-linear-to-b from-transparent via-charcoal-900/15 to-transparent" />

                {/* Stat 2 */}
                <div className="flex items-center gap-4 flex-1 justify-center w-full">
                  <span className="font-display text-5xl sm:text-6xl text-charcoal-900 leading-none font-bold tracking-tight">1000<span className="text-amber-500 font-medium text-4xl sm:text-5xl">+</span></span>
                  <div className="flex flex-col text-left">
                    <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal-900 font-bold leading-tight">Luxury</span>
                    <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal-500 font-semibold leading-tight">Projects</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full md:w-px h-px md:h-16 bg-linear-to-b from-transparent via-charcoal-900/15 to-transparent" />

                {/* Stat 3 */}
                <div className="flex items-center gap-4 flex-1 justify-center md:justify-end w-full">
                  <span className="font-display text-5xl sm:text-6xl text-charcoal-900 leading-none font-bold tracking-tight">5.0</span>
                  <div className="flex flex-col items-start">
                    <div className="flex gap-0.75 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal-900 font-bold leading-none">Google Rating</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
      
    </section>
  )
}
