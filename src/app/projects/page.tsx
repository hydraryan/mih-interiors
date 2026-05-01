'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, MapPin, Layers, LayoutGrid, Search } from 'lucide-react'
import ProjectModal from '@/components/projects/ProjectModal'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects', { next: { revalidate: 3600 } })
        const data = await res.json()
        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    if (filter === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.type === filter))
    }
  }, [filter, projects])

  const openProject = (project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#fbf4eb] text-charcoal-900 font-body selection:bg-brown-200 overflow-x-hidden">
      
      {/* CHAPTER 1: THE MASTERPIECE (Hero) */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white pt-24 md:pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fbf4eb] z-20" />
          <Image 
            src="/projects-hero.png"
            alt="Modern Legacies"
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
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal-700">The Portfolio Collection</span>
              </div>
              
              <h1 className="font-display text-7xl md:text-[11rem] leading-[0.8] text-charcoal-900 tracking-tighter">
                Modern <br />
                <span className="italic text-brown-600">Legacies.</span>
              </h1>
              
              <p className="mt-12 max-w-2xl text-lg md:text-2xl leading-relaxed text-charcoal-500 font-light">
                A definitive collection of architectural transformations, where vision meets meticulous execution.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CHAPTER 2: THE CURATION (Filters & Grid) */}
      <section className="relative z-10 py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Advanced Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-24 gap-12 border-b border-charcoal-900/10 pb-16">
            <ScrollReveal direction="left">
              <div className="space-y-4">
                <h2 className="font-display text-5xl md:text-6xl text-charcoal-900 leading-none">The Portfolio.</h2>
                <p className="text-charcoal-500 font-light text-sm tracking-wide">Showing {filteredProjects.length} curated transformations</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" className="flex flex-wrap gap-4">
              {['All', 'Residential', 'Commercial'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`group relative px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 ${
                    filter === type
                      ? 'bg-charcoal-900 text-white shadow-2xl'
                      : 'bg-white text-charcoal-400 border border-charcoal-900/5 hover:border-brown-300'
                  }`}
                >
                  {type}
                  {filter === type && (
                    <motion.div 
                      layoutId="filter-active"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brown-600"
                    />
                  )}
                </button>
              ))}
            </ScrollReveal>
          </div>

          {/* Masterpiece Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="aspect-[4/5] bg-white/50 animate-pulse rounded-[3.5rem] p-6">
                    <div className="h-full w-full bg-charcoal-100/50 rounded-[2.5rem]" />
                  </div>
                ))
              ) : (
                filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    onClick={() => openProject(project)}
                    className="group relative aspect-[4/5] overflow-hidden rounded-[3.5rem] cursor-pointer bg-white border border-charcoal-900/5 p-4 shadow-sm hover:shadow-2xl hover:shadow-brown-900/5 transition-all duration-700"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
                      <Image
                        src={getDirectImageUrl(project.mainImage)}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                      
                      {/* Floating Metadata */}
                      <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-20">
                         <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-[9px] font-bold uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            {project.type}
                         </div>
                      </div>

                      <div className="absolute bottom-10 left-10 right-10 z-20 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                        <div className="flex items-center gap-3 text-white/60 font-bold text-[9px] uppercase tracking-[0.4em] mb-4">
                           <MapPin size={12} className="text-brown-400" />
                           <span>{project.location}</span>
                        </div>
                        <h3 className="text-white font-display text-3xl md:text-4xl leading-tight drop-shadow-xl group-hover:text-brown-200 transition-colors">
                          {project.title}
                        </h3>
                        
                        <div className="mt-8 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100">
                           <div className="flex items-center gap-4 text-white text-[9px] font-bold uppercase tracking-[0.4em]">
                              Explore Story
                              <div className="h-px w-12 bg-white/30" />
                           </div>
                           <div className="h-12 w-12 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-charcoal-900 transition-all duration-500">
                              <ArrowRight size={18} />
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-48">
               <Layers className="h-12 w-12 text-charcoal-200 mx-auto mb-8" />
               <h3 className="font-display text-4xl text-charcoal-300 italic">No masterpieces found.</h3>
               <p className="mt-4 text-charcoal-400 font-light">Explore other categories to see our work.</p>
            </div>
          )}
        </div>
      </section>

      {/* CHAPTER 3: THE CALL (Modern CTA) */}
      <section className="py-56 px-6 bg-white rounded-t-[5rem]">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24">
             <div className="w-full md:w-1/2 space-y-12">
                <div className="space-y-6">
                   <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">The Collaboration</span>
                   <h2 className="font-display text-6xl md:text-8xl text-charcoal-900 leading-tight">Your vision, <br /> <span className="italic text-brown-600">Our Craft.</span></h2>
                </div>
                <p className="text-xl text-charcoal-500 font-light leading-relaxed max-w-xl">
                   Every legacy begins with a conversation. Let's discuss how we can transform your space into a masterpiece of modern living.
                </p>
             </div>
             
             <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <button 
                  onClick={() => { window.location.hash = 'quote' }}
                  className="group relative h-72 w-72 rounded-full bg-charcoal-900 flex items-center justify-center text-center p-8 transition-all hover:bg-brown-900 hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                   <div className="absolute inset-0 rounded-full border border-white/10 scale-90 group-hover:scale-110 transition-transform duration-700" />
                   <div className="space-y-4">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Start Your</span>
                      <span className="block font-display text-3xl text-white">Project.</span>
                      <ArrowRight className="mx-auto h-8 w-8 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" />
                   </div>
                </button>
             </div>
          </div>
        </ScrollReveal>
      </section>

      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
