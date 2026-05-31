'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { urls } from '@/lib/urls'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Pages with dark hero backgrounds where navbar needs light text
  const isDarkPage = pathname === '/3d-rendering'
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: urls.services() },
    { label: 'Projects', href: urls.projects() },
    { label: 'Blogs', href: urls.blogs() },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-100 flex justify-center pointer-events-none p-4 md:p-6">
        <motion.nav
          initial={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            backdropFilter: 'blur(0px)',
            borderRadius: '0px',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            boxShadow: '0 0px 0px rgba(0,0,0,0)',
            border: '1px solid rgba(255,255,255,0)',
          }}
          animate={{
            width: isScrolled ? 'auto' : '100%',
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0)',
            backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
            borderRadius: isScrolled ? '100px' : '0px',
            paddingLeft: isScrolled ? '2rem' : '1.5rem',
            paddingRight: isScrolled ? '2rem' : '1.5rem',
            paddingTop: isScrolled ? '0.75rem' : '0.5rem',
            paddingBottom: isScrolled ? '0.75rem' : '0.5rem',
            boxShadow: isScrolled ? '0 20px 40px -15px rgba(0,0,0,0.1)' : '0 0px 0px rgba(0,0,0,0)',
            border: isScrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0)',
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 30
          }}
          className="pointer-events-auto flex items-center justify-between gap-12 max-w-350 w-full"
        >
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center shrink-0">
            <motion.img 
              initial={{ height: 42, filter: 'brightness(0)' }}
              animate={{ 
                height: isScrolled ? 28 : 42,
                filter: isScrolled ? 'brightness(1) contrast(1.2)' : (isDarkPage ? 'brightness(0) invert(1)' : 'brightness(0)') 
              }}
              src="/logo.png" 
              alt="MIH Interiors" 
              className="w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-10 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className={`font-body text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300 relative group whitespace-nowrap
                    ${isActive 
                      ? (isScrolled ? 'text-blush-600' : (isDarkPage ? 'text-[#C8A47E] border-b border-[#C8A47E]' : 'text-brown-900 border-b border-brown-900')) 
                      : (isScrolled ? 'text-charcoal-700 hover:text-brown-900' : (isDarkPage ? 'text-white/80 hover:text-white' : 'text-charcoal-800 hover:text-brown-900'))}`}
                >
                  {link.label}
                  {isActive && isScrolled && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 h-[1.5px] bg-blush-500 w-full" 
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Section: CTA & Mobile Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => { window.location.hash = 'quote' }}
              className={`hidden md:flex items-center gap-2 px-8 py-3 rounded-full font-body text-[10px] uppercase tracking-widest font-bold transition-all duration-500 active:scale-95 whitespace-nowrap
                ${isScrolled 
                  ? 'bg-charcoal-900 text-white hover:bg-blush-500 shadow-lg shadow-charcoal-900/10' 
                  : (isDarkPage ? 'bg-[#C8A47E] text-[#1a1511] hover:bg-white shadow-xl shadow-black/20' : 'bg-charcoal-900 text-white hover:bg-brown-900 shadow-xl shadow-black/10')}`}
            >
              Get a Quote <ArrowRight size={12} />
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? 'text-charcoal-900 hover:bg-charcoal-900/5' : (isDarkPage ? 'text-white hover:bg-white/10' : 'text-charcoal-900 hover:bg-black/5')}`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-150 bg-charcoal-900 pt-32 px-8 pb-12 flex flex-col justify-between lg:hidden"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 p-4 text-white hover:bg-white/10 rounded-full"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    className={`font-display text-6xl ${pathname === link.href ? 'text-blush-400 italic underline' : 'text-white'}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <button 
              onClick={() => { window.location.hash = 'quote' }}
              className="w-full bg-blush-500 text-white py-6 rounded-full font-body text-xs uppercase tracking-[0.3em] font-bold shadow-2xl shadow-blush-500/20"
            >
              Start Your Project
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
