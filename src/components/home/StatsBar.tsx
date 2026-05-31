'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { label: 'Projects Completed', value: 1000, suffix: '+' },
  { label: 'Years of Excellence', value: 18, suffix: '+' },
  { label: 'Google Rating', value: 5.0, suffix: '★' },
]

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    numbersRef.current.forEach((el, index) => {
      if (!el) return
      
      const targetValue = stats[index].value
      const isDecimal = targetValue % 1 !== 0

      gsap.fromTo(el, 
        { textContent: '0' },
        {
          textContent: targetValue,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: isDecimal ? 0.1 : 1 },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
          onUpdate: function() {
            if (isDecimal) {
              el.innerHTML = Number(this.targets()[0].textContent).toFixed(1)
            }
          }
        }
      )
    })
  }, [])

  return (
    <section ref={containerRef} className="bg-cream-100 py-20 px-8 border-b border-cream-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        {stats.map((stat, i) => (
          <div key={i} className="text-center group w-full md:w-1/4">
            <h3 className="font-display text-5xl text-brown-800 mb-2 flex items-center justify-center">
              <span ref={el => { numbersRef.current[i] = el }}>0</span>
              <span>{stat.suffix}</span>
            </h3>
            <p className="font-body text-charcoal-800 text-sm uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
