'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { buildServiceQuoteHref } from '@/lib/services/pricing'

interface ShowcaseStory {
  id: string
  tag: string
  title: string
  desc: string
  bullets?: string[]
  image: string
  alignment: 'left' | 'right' | 'left-split'
  serviceSlug: string
  hasStats: boolean
  stats?: { value: string; label: string }[]
}

interface DomainShowcaseClientProps {
  domainName: string;
  stories: ShowcaseStory[]
}

export default function DomainShowcaseClient({ domainName, stories }: DomainShowcaseClientProps) {
  const router = useRouter()

  if (!stories || stories.length === 0) return null;

  return (
    <section className="relative pt-24 pb-32 md:pt-32 md:pb-48 px-6 bg-[#fbf4eb]">
      <div className="max-w-[1600px] mx-auto">
        <ScrollReveal>
          <div className="mb-24 max-w-4xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600 mb-6 block">The Details</span>
            <h2 className="font-display text-5xl md:text-7xl text-charcoal-900 leading-none tracking-tight mb-8">
              Micro-environments <br className="hidden md:block"/> in <span className="italic text-brown-600">{domainName}.</span>
            </h2>
            <p className="text-xl md:text-2xl text-charcoal-500 font-light leading-relaxed">
              Explore the critical zones where functional rigor meets aesthetic clarity. These are the spaces we obsess over.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-32 md:space-y-48">
          {stories.map((story) => {
            const isRight = story.alignment === 'right';
            const isSplit = story.alignment === 'left-split';

            return (
              <div key={story.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                {/* Image Column */}
                <motion.div 
                  initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                  className={`relative h-[60vh] md:h-[80vh] rounded-[2.5rem] overflow-hidden ${
                    isSplit ? 'md:col-span-6' : 'md:col-span-7'
                  } ${isRight ? 'md:order-2' : 'md:order-1'}`}
                >
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Text Column */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`space-y-12 ${
                    isSplit ? 'md:col-span-6' : 'md:col-span-5'
                  } ${isRight ? 'md:order-1' : 'md:order-2'}`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold font-mono text-brown-600 border border-brown-600/30 px-3 py-1 rounded-full">
                        {story.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-400">
                        {story.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-4xl md:text-6xl text-charcoal-900 leading-tight">
                      {story.title}
                    </h3>
                    <p className="text-xl text-charcoal-500 font-light leading-relaxed">
                      {story.desc}
                    </p>
                  </div>

                  {story.bullets && story.bullets.length > 0 && (
                    <ul className="space-y-4 border-l border-brown-200 pl-6">
                      {story.bullets.map((bullet, idx) => (
                        <li key={idx} className="text-sm font-light text-charcoal-600 flex items-center justify-between">
                          {bullet}
                          <ArrowRight size={16} className="text-charcoal-300" />
                        </li>
                      ))}
                    </ul>
                  )}

                  {story.hasStats && story.stats && (
                    <div className="grid grid-cols-2 gap-8 border-t border-charcoal-900/10 pt-8 mt-12">
                      {story.stats.map((stat, i) => (
                        <div key={i}>
                           <p className="font-display text-4xl md:text-5xl text-charcoal-900 mb-2">{stat.value}</p>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-8">
                     <Link 
                        href={buildServiceQuoteHref('/services', story.serviceSlug)}
                        onClick={(e) => {
                          e.preventDefault();
                          const href = buildServiceQuoteHref('/services', story.serviceSlug);
                          router.push(href, { scroll: false });
                          if (window.location.hash === '#quote') {
                            window.dispatchEvent(new HashChangeEvent('hashchange'));
                          } else {
                            window.location.hash = 'quote';
                          }
                        }}
                        className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-brown-600 hover:text-brown-800 transition-colors group"
                     >
                       Discuss This Detail
                       <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                     </Link>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}