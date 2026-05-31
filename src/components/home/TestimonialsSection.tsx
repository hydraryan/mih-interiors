"use client"

import { TestimonialsColumn, type TestimonialItem } from "@/components/ui/testimonials-columns-1"
import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { Star, MessageSquareQuote } from "lucide-react"

const testimonials: TestimonialItem[] = [
  {
    text: "Quick service, flexible appointments, reasonable pricing, and speedy response. The quotation was clear and easy to understand.",
    name: "Sourav Kumar",
    role: "Verified Client Review",
    rating: 5,
  },
  {
    text: "I met MIH through Justdial and they proved me wrong in the best way. Mohit Mahajan handled the project seriously and we finished on time while saving money.",
    name: "Akshit Sharma",
    role: "Verified Client Review",
    rating: 5,
  },
  {
    text: "Exceptional finishing, polishing, designing, and space utilization. High-quality materials, unique designs, and on-time delivery.",
    name: "Himanshu Poddar",
    role: "Verified Client Review",
    rating: 5,
  },
  {
    text: "Thanks to MIH Interiors for making my dream house. Totally satisfied with the design. Special thanks to Mr. Mohit for understanding my budget.",
    name: "Joni Pandit",
    role: "Verified Client Review",
    rating: 5,
  },
  {
    text: "Very professional team. They clearly understood our requirements and budget, and gave us the best possible outcome.",
    name: "Harsimranleen Kaur",
    role: "Verified Client Review",
    rating: 5,
  },
  {
    text: "Top-notch interior designers in Tricity. They delivered high-quality interior work for my retail stores.",
    name: "Monty Singh",
    role: "Verified Client Review",
    rating: 5,
  },
  {
    text: "Professional and up to date with new materials. Renovation quality was excellent and budget-friendly.",
    name: "Alika Sharma",
    role: "Verified Client Review",
    rating: 5,
  },
  {
    text: "Totally happy with MIH Interiors. Great experience and very professional team. We still get compliments from everyone.",
    name: "Nisha Badhwar",
    role: "Verified Client Review",
    rating: 5,
  },
  {
    text: "Great job with excellent design solutions. The architects were composed, helpful, and highly professional.",
    name: "Anuroop Singh",
    role: "Verified Client Review",
    rating: 5,
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section ref={sectionRef} className="bg-[#FAF8F4] relative overflow-hidden pt-20 md:pt-28 pb-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-charcoal-900/8 to-transparent" />
      <div className="absolute top-1/2 -translate-y-1/2 -left-20 font-display text-[18rem] leading-none text-charcoal-900/[0.012] pointer-events-none select-none tracking-tighter rotate-90">
        Reviews
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14"
        >
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-amber-500" />
              <span className="font-body text-xs text-amber-500 uppercase tracking-[0.3em] font-semibold">Client Feedback</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal-900 leading-[1.1] tracking-tight">
              Trusted by 1000+{" "}
              <span className="italic font-light text-charcoal-900/50">Families.</span>
            </h2>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex items-center gap-6"
          >
            {/* Average rating */}
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-charcoal-900/[0.05] shadow-sm">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="w-px h-5 bg-charcoal-900/8" />
              <span className="font-display text-lg text-charcoal-900">4.9</span>
              <span className="font-body text-[11px] text-charcoal-900/40 uppercase tracking-wider">Avg Rating</span>
            </div>

            {/* Google badge */}
            <div className="hidden sm:flex items-center gap-2.5 px-5 py-3 bg-white rounded-xl border border-charcoal-900/[0.05] shadow-sm">
              <MessageSquareQuote size={16} className="text-amber-500" />
              <span className="font-body text-[11px] text-charcoal-900/50 uppercase tracking-wider">Verified Reviews</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Scrolling Columns ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.25 }}
          className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[700px] overflow-hidden"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={22} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={26} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={24} />
        </motion.div>

        {/* ── Bottom trust line ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <div className="w-12 h-px bg-charcoal-900/8" />
          <p className="font-body text-charcoal-900/35 text-xs uppercase tracking-[0.25em]">
            Real feedback from clients across Chandigarh & Tricity
          </p>
          <div className="w-12 h-px bg-charcoal-900/8" />
        </motion.div>
      </div>
    </section>
  )
}
