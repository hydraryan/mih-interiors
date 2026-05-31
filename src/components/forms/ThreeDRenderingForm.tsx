'use client'

import { useState } from 'react'
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ThreeDRenderingForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      projectType: formData.get('projectType'),
      areaSqft: formData.get('areaSqft'),
    }

    try {
      const res = await fetch('/api/leads/3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Failed to submit form')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </div>
        <h3 className="font-display text-3xl text-white mb-3">Request Received</h3>
        <p className="text-white/50 leading-relaxed max-w-md mx-auto">
          Thank you for your interest in our 3D Visualization service. Our design team will contact you within 24 hours.
        </p>
      </div>
    )
  }

  const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-[#C8A47E]/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#C8A47E]/30 backdrop-blur-sm'
  const labelClass = 'text-[10px] font-bold uppercase tracking-[0.2em] text-white/40'

  return (
    <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 backdrop-blur-md">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className={labelClass}>Full Name</label>
          <input required id="name" name="name" type="text" className={inputClass} placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className={labelClass}>Phone Number</label>
          <input required id="phone" name="phone" type="tel" className={inputClass} placeholder="+91 98765 43210" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="city" className={labelClass}>City</label>
          <input required id="city" name="city" type="text" className={inputClass} placeholder="Chandigarh" />
        </div>
        <div className="space-y-2">
          <label htmlFor="projectType" className={labelClass}>Project Type</label>
          <select required id="projectType" name="projectType" className={inputClass}>
            <option value="" className="bg-[#1a1511]">Select Type</option>
            <option value="residential" className="bg-[#1a1511]">Residential</option>
            <option value="commercial" className="bg-[#1a1511]">Commercial</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="areaSqft" className={labelClass}>Estimated Area (Sq. Ft.)</label>
        <input required id="areaSqft" name="areaSqft" type="number" min="100" className={inputClass} placeholder="e.g. 1500" />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button type="submit" disabled={loading} className="group relative w-full overflow-hidden rounded-2xl bg-[#C8A47E] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1511] transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-[#C8A47E]/20 disabled:opacity-70">
        <span className="relative z-10 flex items-center justify-center gap-3">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Request 3D Consultation'}
          {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </span>
      </button>
    </form>
  )
}
