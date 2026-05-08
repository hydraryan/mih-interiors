'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Layers } from 'lucide-react'
import ProjectModal from '@/components/projects/ProjectModal'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

interface ServiceProjectsClientProps {
  projects: any[]
}

export default function ServiceProjectsClient({ projects }: ServiceProjectsClientProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openProject = (project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  return (
    <>
      <section className="relative z-10 py-16 md:py-24 px-6 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <ScrollReveal>
            <div className="mb-16 md:mb-24 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600 mb-6 block">Portfolio Signatures</span>
              <h2 className="font-display text-5xl md:text-7xl text-charcoal-900 leading-none">Featured Deliveries.</h2>
              <p className="text-xl md:text-2xl text-charcoal-500 font-light mt-6 max-w-3xl mx-auto">
                Real sites, real constraints, and meticulous execution. Explore works from this domain.
              </p>
            </div>
          </ScrollReveal>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {projects.map((project, idx) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  onClick={() => openProject(project)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] cursor-pointer bg-white border border-charcoal-900/5 p-4 shadow-sm hover:shadow-2xl hover:shadow-brown-900/5 transition-all duration-700"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
                    <Image
                      src={getDirectImageUrl(project.mainImage)}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                    
                    {/* Floating Metadata */}
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-20">
                       <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-[9px] font-bold uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          {project.type}
                       </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 z-20 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                      <div className="flex items-center gap-3 text-white/60 font-bold text-[9px] uppercase tracking-[0.4em] mb-4">
                         <MapPin size={12} className="text-brown-400" />
                         <span>{project.location}</span>
                      </div>
                      <h3 className="text-white font-display text-3xl leading-tight drop-shadow-xl group-hover:text-brown-200 transition-colors">
                        {project.title}
                      </h3>
                      
                      <div className="mt-6 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100">
                         <div className="flex items-center gap-4 text-white text-[9px] font-bold uppercase tracking-[0.4em]">
                            Explore Details
                            <div className="h-px w-10 bg-white/30" />
                         </div>
                         <div className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-charcoal-900 transition-all duration-500">
                            <ArrowRight size={16} />
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
               <Layers className="h-12 w-12 text-charcoal-200 mx-auto mb-8" />
               <h3 className="font-display text-3xl md:text-4xl text-charcoal-300 italic">Curating masterpieces...</h3>
               <p className="mt-4 text-charcoal-400 font-light">New works under this domain are currently being documented.</p>
            </div>
          )}
        </div>
      </section>

      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
