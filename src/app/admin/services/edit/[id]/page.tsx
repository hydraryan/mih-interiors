'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Save, ArrowLeft, Loader2, Search, CheckCircle2 } from 'lucide-react'
import MediaSelectorModal from '@/components/admin/MediaSelectorModal'
import { formatStartingPrice } from '@/lib/services/pricing'

type ServiceDetails = {
  _id: string
  title?: string
  category?: string
  shortDescription?: string
  startingPrice?: number | null
  publishStatus?: string
  showOnHomepage?: boolean
  hero?: {
    title?: string
    subtitle?: string
    image?: string
  }
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    shortDescription: '',
    startingPrice: '',
    publishStatus: 'draft',
    showOnHomepage: false,
    hero: {
      title: '',
      subtitle: '',
      image: ''
    }
  })

  useEffect(() => {
    const loadService = async () => {
      try {
        const res = await fetch(`/api/admin/services`)
        const data = await res.json() as { success?: boolean; services?: ServiceDetails[] }
        if (data.success) {
          const service = data.services?.find((item) => item._id === id)
          if (service) {
            setFormData({
              title: service.title || '',
              category: service.category || '',
              shortDescription: service.shortDescription || '',
              startingPrice: service.startingPrice?.toString() || '',
              publishStatus: service.publishStatus || 'draft',
              showOnHomepage: service.showOnHomepage || false,
              hero: {
                title: service.hero?.title || '',
                subtitle: service.hero?.subtitle || '',
                image: service.hero?.image || ''
              }
            })
          }
        }
      } catch (error: unknown) {
        console.error('Error fetching service:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadService()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const payload = {
        ...formData,
        startingPrice: formData.startingPrice === '' ? undefined : Number(formData.startingPrice),
      }

      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Service updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error(data.error || 'Failed to update')
      }
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update service',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cream-100">
        <Loader2 className="animate-spin text-brown-800 h-10 w-10" />
      </div>
    )
  }

  return (
    <div className="bg-cream-100 min-h-screen p-8 text-charcoal-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/services" className="p-2 hover:bg-cream-200 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-display text-4xl text-brown-800">Edit Service</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-brown-800 text-white px-8 py-2.5 rounded-md font-body text-sm flex items-center gap-2 hover:bg-brown-900 transition-all disabled:opacity-50 shadow-md"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' && <CheckCircle2 size={18} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white p-8 rounded-sm border border-cream-200 shadow-sm space-y-6">
            <h2 className="font-display text-xl text-charcoal-900 border-b border-cream-100 pb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Service Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded focus:outline-none focus:border-brown-400 transition-colors"
                  placeholder="e.g. Residential Interiors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded focus:outline-none focus:border-brown-400 transition-colors"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="construction">Construction</option>
                  <option value="architecture">Architecture</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Starting Price (INR)</label>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded focus:outline-none focus:border-brown-400 transition-colors"
                  placeholder="e.g. 650000"
                />
                <p className="text-[10px] text-charcoal-400">
                  Displayed publicly as {formatStartingPrice(Number(formData.startingPrice) || null) || 'the starting price'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Short Description (for Homepage & Cards)</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded focus:outline-none focus:border-brown-400 transition-colors"
                placeholder="A brief summary of this service..."
              />
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.showOnHomepage}
                  onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                  className="w-5 h-5 rounded border-cream-300 text-brown-600 focus:ring-brown-500 cursor-pointer"
                />
                <span className="text-sm font-body text-charcoal-700 group-hover:text-charcoal-900 transition-colors">Show on Homepage Services Section</span>
              </label>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Publish Status:</label>
                <div className="flex gap-2">
                  {['draft', 'published'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, publishStatus: status })}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                        formData.publishStatus === status 
                          ? 'bg-brown-800 text-white shadow-md' 
                          : 'bg-cream-100 text-charcoal-400 hover:bg-cream-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white p-8 rounded-sm border border-cream-200 shadow-sm space-y-6">
            <h2 className="font-display text-xl text-charcoal-900 border-b border-cream-100 pb-4">Homepage / Hero Display</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Hero Subtitle / Description</label>
              <input
                type="text"
                value={formData.hero.subtitle}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded focus:outline-none focus:border-brown-400 transition-colors"
                placeholder="Secondary description used in hero sections"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Hero Image / Homepage Background</label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.hero.image}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, image: e.target.value } })}
                      className="flex-1 px-4 py-2.5 bg-cream-50 border border-cream-200 rounded focus:outline-none focus:border-brown-400 transition-colors text-sm"
                      placeholder="e.g. /services-residential.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="px-4 py-2 bg-charcoal-900 text-white rounded hover:bg-brown-800 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                    >
                      <Search size={14} />
                      Library
                    </button>
                  </div>
                  <p className="text-[10px] text-charcoal-400 italic">
                    Tip: Use the **Library** button to select or upload a new photo.
                  </p>
                </div>
                {formData.hero.image && (
                  <div className="w-full md:w-48 aspect-video relative rounded border border-cream-200 overflow-hidden bg-cream-50 shrink-0 group">
                    <Image src={formData.hero.image} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         type="button"
                         onClick={() => setIsMediaModalOpen(true)}
                         className="bg-white text-charcoal-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl"
                       >
                         Change Photo
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <MediaSelectorModal 
              isOpen={isMediaModalOpen} 
              onClose={() => setIsMediaModalOpen(false)} 
              onSelect={(url) => setFormData({ ...formData, hero: { ...formData.hero, image: url } })}
            />
          </div>

          <div className="flex justify-end pt-4">
             <p className="text-xs text-charcoal-400 max-w-xs text-right">
                Note: This editor focuses on high-level details. For complex sections and content, please use the API or contact the developer for a custom layout.
             </p>
          </div>
        </form>
      </div>
    </div>
  )
}
