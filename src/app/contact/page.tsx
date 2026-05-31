'use client'

import React from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { Phone, Mail, MapPin, MessageSquare, Send } from 'lucide-react'
import { InstagramLogoIcon } from '@radix-ui/react-icons'

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)

const JustdialIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
)

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
    projectType: 'residential'
  })
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const socials = [
    { icon: <InstagramLogoIcon className="h-5 w-5" />, href: "https://www.instagram.com/mihinteriors/", label: "Instagram" },
    { icon: <FacebookIcon className="h-5 w-5" />, href: "https://www.facebook.com/profile.php?id=100088721091794", label: "Facebook" },
    { icon: <JustdialIcon className="h-5 w-5" />, href: "https://www.justdial.com/Chandigarh/Mih-Architects-and-Interiors-Main-Market-Chandigarh-Sector-17a/0172PX172-X172-241024174522-K6P7_BZDET", label: "Justdial" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', city: '', message: '', projectType: 'residential' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf4eb] text-charcoal-900 selection:bg-brown-200 overflow-x-hidden">
      
      {/* CHAPTER 1: THE MINIMALIST HERO */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#fbf4eb] z-20" />
          <Image 
            src="/contact-hero.png"
            alt="Minimalist Sanctuary"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-30 text-center px-6">
          <ScrollReveal>
            <h1 className="font-display text-7xl md:text-[11rem] leading-[0.8] tracking-tighter text-charcoal-900">
              Let&apos;s <br />
              <span className="italic text-brown-600">Manifest.</span>
            </h1>
            <p className="mt-12 mx-auto max-w-xl text-lg md:text-2xl text-charcoal-500 font-light leading-relaxed">
              Every masterpiece begins with a conversation. <br className="hidden md:block" />
              We are here to listen, design, and deliver.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CHAPTER 2: THE ESSENTIALS */}
      <section className="relative z-10 py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            
            {/* Column 1: Directory & Socials */}
            <div className="space-y-24">
              <ScrollReveal direction="left">
                <div className="space-y-16">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">The Directory</span>
                    <h2 className="font-display text-5xl md:text-6xl text-charcoal-900 leading-tight">Direct Channels.</h2>
                  </div>

                  <div className="space-y-12">
                    <ContactInfoItem 
                      icon={MapPin} 
                      label="Design Studio" 
                      value="MIH INTERIORS SCO - 62-63 , 3rd Floor , Sector 17 A , Near Oyster Hotel CHANDIGARH, Chandigarh 160017" 
                      href="https://maps.app.goo.gl/nh54NTND4Jgn8wRG6" 
                    />
                    <ContactInfoItem 
                      icon={Phone} 
                      label="Direct Talk" 
                      value="+91 6399936333" 
                      href="tel:+916399936333" 
                    />
                    <ContactInfoItem 
                      icon={Mail} 
                      label="Editorial Write" 
                      value="info@mihinteriors.in" 
                      href="mailto:info@mihinteriors.in" 
                    />
                  </div>
                </div>

                <div className="pt-16 border-t border-charcoal-900/10 space-y-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal-400">Social Connectivity</p>
                  <div className="flex gap-6">
                    {socials.map((social) => (
                      <a 
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-14 w-14 rounded-full border border-charcoal-900/10 flex items-center justify-center text-charcoal-400 hover:border-brown-400 hover:text-brown-600 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Column 2: Minimal Form */}
            <div className="relative">
              <ScrollReveal direction="right">
                <div className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl shadow-brown-900/5 border border-white">
                  {status === 'success' ? (
                    <div className="py-20 text-center space-y-8">
                      <div className="h-20 w-20 rounded-full bg-brown-50 text-brown-600 flex items-center justify-center mx-auto">
                        <Send className="h-8 w-8" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-display text-4xl text-charcoal-900">Message Sent.</h3>
                        <p className="text-charcoal-500 font-light">We will respond to your vision within 24 hours.</p>
                      </div>
                      <button 
                        onClick={() => setStatus('idle')}
                        className="text-xs font-bold uppercase tracking-widest text-brown-600 border-b border-brown-200 pb-1"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-12 space-y-4">
                        <h3 className="font-display text-3xl text-charcoal-900">Send a Brief Message</h3>
                        <p className="text-charcoal-500 font-light text-sm">Our team will respond to your inquiry within 24 hours.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-8">
                          <MinimalInput 
                            label="Name" 
                            placeholder="E.g. Mohit Mahajan" 
                            value={formData.name}
                            onChange={(val) => setFormData(f => ({ ...f, name: val }))}
                            required
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <MinimalInput 
                              label="Phone" 
                              placeholder="E.g. +91 6399936333" 
                              type="tel"
                              value={formData.phone}
                              onChange={(val) => setFormData(f => ({ ...f, phone: val }))}
                              required
                            />
                            <MinimalInput 
                              label="City" 
                              placeholder="E.g. Chandigarh" 
                              value={formData.city}
                              onChange={(val) => setFormData(f => ({ ...f, city: val }))}
                            />
                          </div>
                          <MinimalInput 
                            label="Email (Optional)" 
                            placeholder="E.g. hello@example.com" 
                            type="email" 
                            value={formData.email}
                            onChange={(val) => setFormData(f => ({ ...f, email: val }))}
                          />
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">Your Vision</label>
                            <textarea 
                              rows={4}
                              required
                              value={formData.message}
                              onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                              placeholder="Tell us about the space you want to manifest..."
                              className="w-full bg-transparent border-b border-charcoal-900/10 pb-4 outline-none focus:border-brown-400 transition-colors text-lg font-light"
                            />
                          </div>
                        </div>
                        
                        <button 
                          type="submit"
                          disabled={status === 'loading'}
                          className="group flex w-full items-center justify-between rounded-2xl bg-charcoal-900 px-10 py-7 text-xs font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-brown-900 hover:shadow-xl disabled:opacity-50"
                        >
                          {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" />
                        </button>
                        {status === 'error' && (
                          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">Failed to send. Please check your connection.</p>
                        )}
                      </form>
                    </>
                  )}

                  <div className="mt-16 pt-12 border-t border-charcoal-900/5 text-center">
                     <button 
                       onClick={() => { window.location.hash = 'quote' }}
                       className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-brown-600 hover:text-charcoal-900 transition-colors"
                     >
                       <MessageSquare className="h-4 w-4" />
                       Try Interactive Estimate
                     </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* CHAPTER 3: THE STUDIO FOOTER */}
      <section className="py-24 px-6 text-center bg-white border-t border-charcoal-900/5">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal-400">Design Studio Hours</p>
         <p className="mt-4 font-display text-2xl text-charcoal-900 italic">Monday — Saturday / 10:00 — 19:00</p>
      </section>
    </div>
  )
}

function ContactInfoItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href: string
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block space-y-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-brown-400" />
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal-400">{label}</span>
      </div>
      <p className="font-display text-3xl md:text-4xl text-charcoal-900 group-hover:text-brown-600 transition-colors duration-500 leading-tight">
        {value}
      </p>
    </a>
  )
}

function MinimalInput({ 
  label, 
  placeholder, 
  type = 'text', 
  value, 
  onChange,
  required = false
}: { 
  label: string, 
  placeholder: string, 
  type?: string, 
  value?: string, 
  onChange?: (val: string) => void,
  required?: boolean
}) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        className="w-full bg-transparent border-b border-charcoal-900/10 pb-4 outline-none focus:border-brown-400 transition-colors text-lg font-light"
      />
    </div>
  )
}
