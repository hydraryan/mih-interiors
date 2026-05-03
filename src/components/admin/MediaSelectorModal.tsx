'use client'

import { X } from 'lucide-react'
import MediaManager from './MediaManager'

interface MediaSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function MediaSelectorModal({ isOpen, onClose, onSelect }: MediaSelectorModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[1400px] h-full bg-cream-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/20">
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-cream-200">
          <h3 className="font-display text-2xl text-charcoal-900">Select Image from Library</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors text-charcoal-400 hover:text-charcoal-900"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-cream-100">
          <MediaManager onSelect={(url) => {
            onSelect(url)
            onClose()
          }} />
        </div>
      </div>
    </div>
  )
}
