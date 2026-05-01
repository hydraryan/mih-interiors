'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, MapPin, Tag } from 'lucide-react'
import Image from 'next/image'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

interface ProjectModalProps {
  project: any
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!project) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal-900/90 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]"
          >
            {/* Image Carousel Section */}
            <div className="relative w-full md:w-3/5 bg-charcoal-900 h-64 md:h-auto">
              <Image
                src={getDirectImageUrl(project.images[currentImageIndex])}
                alt={project.title}
                fill
                className="object-contain"
              />
              
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.images.map((_: any, idx: number) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-cream-100 text-charcoal-400 transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-blush-50 text-blush-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                  {project.type}
                </span>
                <h2 className="font-display text-3xl text-brown-800 mb-4">{project.title}</h2>
                
                <div className="flex flex-col gap-3 text-sm font-body text-charcoal-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blush-400" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-blush-400" />
                    <span>{project.type} Project</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm prose-charcoal">
                <h4 className="font-display text-charcoal-800 mb-2">About the Project</h4>
                <p className="font-body text-charcoal-600 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-auto pt-12">
                <button
                  onClick={() => { window.location.hash = 'quote' }}
                  className="w-full bg-charcoal-900 text-white py-4 rounded-xl font-body uppercase tracking-widest text-xs hover:bg-brown-800 transition-colors shadow-lg shadow-charcoal-900/10"
                >
                  Get Similar Quote
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
