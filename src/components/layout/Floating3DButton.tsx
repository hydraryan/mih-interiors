'use client'

import Link from 'next/link'
import { Box } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Floating3DButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show button after a small delay
    const timer1 = setTimeout(() => setIsVisible(true), 1500)
    
    // Show notification bubble shortly after button appears
    const timer2 = setTimeout(() => setShowNotification(true), 2500)
    
    // Hide notification bubble after a few seconds
    const timer3 = setTimeout(() => setShowNotification(false), 8000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  // Don't show the button if we are already on the 3d-rendering page or in the admin portal
  if (pathname === '/3d-rendering' || pathname?.startsWith('/admin')) return null

  return (
    <div 
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-700 flex items-center ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Notification Bubble */}
      <div 
        className={`absolute right-[calc(100%+12px)] whitespace-nowrap transition-all duration-500 origin-right ${
          showNotification ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="relative rounded-2xl bg-white px-4 py-3 shadow-xl shadow-charcoal-900/10 border border-cream-200">
          <p className="text-xs font-semibold text-charcoal-900">
            Get your 3D House Model types! <span className="inline-block animate-bounce ml-1">🏠</span>
          </p>
          {/* Right pointing arrow/triangle */}
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-[6px] border-transparent border-l-white drop-shadow-sm" />
        </div>
      </div>

      <Link 
        href="/3d-rendering"
        className="group relative flex items-center bg-[#2d241e]/90 backdrop-blur-md rounded-l-2xl border-y border-l border-white/10 p-3 shadow-2xl shadow-charcoal-900/40 hover:bg-[#1a1511] transition-colors duration-300"
        aria-label="3D Visualization Service"
      >
        <div className="absolute inset-0 rounded-l-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Expanded text on hover */}
        <div className="overflow-hidden w-0 group-hover:w-[120px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap pl-2">
            3D Design
          </span>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-[#C8A47E] rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity animate-pulse" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#3d312a] to-[#2d241e] text-[#f6efe6] border border-white/10 group-hover:bg-[#C8A47E] group-hover:text-white transition-all duration-300 shadow-inner">
            <Box className="h-6 w-6" strokeWidth={1.5} />
          </div>
        </div>
      </Link>
    </div>
  )
}
