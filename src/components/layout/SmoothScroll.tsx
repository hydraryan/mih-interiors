'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Disable smooth scrolling on admin routes as it breaks fixed layout scrolling
  if (pathname?.startsWith('/admin') || pathname === '/login') {
    return <>{children}</>
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
