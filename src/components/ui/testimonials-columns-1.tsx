"use client"

import React from "react"
import { motion } from "motion/react"
import { Star, Quote } from "lucide-react"

export type TestimonialItem = {
  text: string
  name: string
  role: string
  rating?: number
}

const getInitials = (name: string) => {
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
}

const avatarColors = [
  "bg-amber-500",
  "bg-charcoal-900",
  "bg-amber-600",
  "bg-stone-700",
  "bg-amber-700",
  "bg-neutral-800",
]

const getAvatarColor = (name: string) => {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0)
  return avatarColors[code % avatarColors.length]
}

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: TestimonialItem[]
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, role, rating = 5 }, i) => (
                <div
                  className="group relative p-7 rounded-2xl bg-white border border-charcoal-900/[0.05] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] max-w-[340px] w-full transition-shadow duration-500"
                  key={i}
                >
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote size={20} className="text-amber-400/60 fill-amber-400/20" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        size={13}
                        className={si < rating ? "text-amber-400 fill-amber-400" : "text-charcoal-900/10 fill-charcoal-900/5"}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="font-body text-[13.5px] text-charcoal-900/70 leading-[1.75] mb-6">{text}</p>

                  {/* Divider */}
                  <div className="w-full h-px bg-charcoal-900/[0.05] mb-5" />

                  {/* Author */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`h-10 w-10 rounded-full ${getAvatarColor(name)} text-white flex items-center justify-center font-body text-xs font-bold tracking-wider flex-shrink-0`}
                      aria-label={`${name} avatar`}
                    >
                      {getInitials(name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-display text-charcoal-900 text-[15px] leading-tight font-medium truncate">{name}</span>
                      <span className="font-body text-charcoal-900/35 text-[11px] tracking-wide">{role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}
