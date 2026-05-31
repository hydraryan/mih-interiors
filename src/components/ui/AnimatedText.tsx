'use client'

import { motion, cubicBezier } from 'framer-motion'

interface Props {
  text: string
  className?: string
  trigger?: 'scroll' | 'immediate'
  type?: 'words' | 'chars'
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const childVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.8, ease: cubicBezier(0.25, 0.46, 0.45, 0.94) },
  },
}

export default function AnimatedText({ text, className, trigger = 'scroll', type = 'words' }: Props) {
  const items = type === 'chars' ? text.split('') : text.split(' ')

  if (type === 'chars') {
    return (
      <motion.h1
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={trigger === 'immediate' ? 'visible' : undefined}
        whileInView={trigger === 'scroll' ? 'visible' : undefined}
        viewport={{ once: true, margin: '-40px' }}
      >
        {items.map((char, index) => (
          <span key={`${char}-${index}`} className="inline-block overflow-hidden align-bottom">
            <motion.span variants={childVariants} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </span>
        ))}
      </motion.h1>
    )
  }

  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={trigger === 'immediate' ? 'visible' : undefined}
      whileInView={trigger === 'scroll' ? 'visible' : undefined}
      viewport={{ once: true, margin: '-40px' }}
    >
      {items.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span variants={childVariants} className="inline-block whitespace-pre">
            {word}
            {'\u00A0'}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}
