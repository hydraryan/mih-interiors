"use client"

import Link from 'next/link'
import React from 'react'

interface Props {
  href: string
  className?: string
  children: React.ReactNode
}

export default function OpenQuoteLink({ href, className, children }: Props) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault()
        const [urlWithoutHash] = href.split('#')
        history.pushState(null, '', urlWithoutHash)
        window.location.hash = 'quote'
      }}
      className={className}
    >
      {children}
    </Link>
  )
}
