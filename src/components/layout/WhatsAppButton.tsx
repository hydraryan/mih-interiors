'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const WHATSAPP_NUMBER = '916399936333'
const PRE_FILLED_MESSAGE = encodeURIComponent("Hi MIH Interiors! I'd like to discuss my interior design project.")

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${PRE_FILLED_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MIH Interiors on WhatsApp"
      className="fixed bottom-[4.5rem] right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#25D366] text-white shadow-[0_14px_34px_rgba(18,140,126,0.30)] transition hover:-translate-y-0.5 hover:bg-[#128C7E] hover:shadow-[0_18px_42px_rgba(18,140,126,0.36)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] md:w-auto md:gap-2.5 md:px-4"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95">
        <Image src="/whatsapp-svgrepo-com.svg" alt="" width={20} height={20} className="pointer-events-none" />
      </span>
      <span className="hidden text-sm font-semibold leading-none md:inline">WhatsApp</span>
    </motion.a>
  )
}
