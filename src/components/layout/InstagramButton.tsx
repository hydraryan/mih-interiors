'use client'

import { motion } from 'framer-motion'

const INSTAGRAM_URL = 'https://www.instagram.com/mihinteriors/'

function IgIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function InstagramButton() {
  return (
    <motion.a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow MIH Interiors on Instagram"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-[0_14px_34px_rgba(221,42,123,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(221,42,123,0.36)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DD2A7B] md:w-auto md:gap-2.5 md:px-4"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95">
        <IgIcon className="h-4 w-4 text-[#DD2A7B]" />
      </span>
      <span className="hidden text-sm font-semibold leading-none md:inline">Instagram</span>
    </motion.a>
  )
}
