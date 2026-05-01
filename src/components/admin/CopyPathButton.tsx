'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyPathButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-charcoal-900/10 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-charcoal-700 transition-colors hover:border-brown-200 hover:text-brown-700"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy path'}
    </button>
  )
}
