'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
  className?: string
}

const variants = {
  up:    { hidden: { opacity: 0, y: 40 },      visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -40 },     visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 },      visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
}

export default function ScrollReveal({ children, delay = 0, direction = 'up', className }: Props) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants[direction]}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
