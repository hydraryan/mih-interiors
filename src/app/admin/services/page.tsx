'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Edit2, ExternalLink, Home, Star, Save, X, Check, Loader2 } from 'lucide-react'

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      if (data.success) {
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleHomepage = async (id: string, current: boolean) => {
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showOnHomepage: !current }),
      })
      if (res.ok) {
        setServices(services.map(s => s._id === id ? { ...s, showOnHomepage: !current } : s))
      }
    } catch (error) {
      alert('Failed to update service')
    } finally {
      setSavingId(null)
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setServices(services.filter(s => s._id !== id))
      }
    } catch (error) {
      alert('Failed to delete service')
    }
  }

  const homepageCount = services.filter(s => s.showOnHomepage).length

  return (
    <div className="bg-cream-100 min-h-screen p-8 text-charcoal-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-display text-4xl text-brown-800">Services Management</h1>
            <p className="font-body text-charcoal-500 mt-2 text-sm">
              Manage your service categories and select which ones appear on the homepage.
            </p>
          </div>
          <div className="flex gap-4">
            {/* Future: Add Service Button */}
            <Link 
              href="/admin" 
              className="text-sm font-body text-charcoal-600 hover:text-brown-800 underline self-center"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brown-800 h-10 w-10" />
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-cream-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-cream-200 bg-cream-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <Star size={16} className="text-amber-500" fill={homepageCount > 0 ? "currentColor" : "none"} />
                <span className="font-body text-charcoal-600">
                  <strong className="text-charcoal-900">{homepageCount}</strong> services visible on Homepage
                </span>
              </div>
            </div>

            <table className="w-full text-left font-body text-sm">
              <thead className="bg-cream-50 border-b border-cream-200 text-charcoal-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">Home Page</th>
                  <th className="px-6 py-4">Service Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {services.map((service) => (
                  <tr key={service._id} className={`hover:bg-cream-50/50 transition-colors ${service.showOnHomepage ? 'bg-amber-50/20' : ''}`}>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleHomepage(service._id, service.showOnHomepage)}
                        disabled={savingId === service._id}
                        className={`p-2 rounded-md transition-all ${
                          service.showOnHomepage 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-cream-100 text-charcoal-300 hover:text-charcoal-500'
                        }`}
                        title={service.showOnHomepage ? "Remove from Homepage" : "Show on Homepage"}
                      >
                        {savingId === service._id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Star size={18} fill={service.showOnHomepage ? "currentColor" : "none"} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-charcoal-900">{service.title}</div>
                      <div className="text-[10px] text-charcoal-400 font-mono">{service.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-cream-100 text-charcoal-600 text-[10px] font-bold uppercase tracking-wider">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        service.publishStatus === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {service.publishStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/services/${service.slug}`} 
                          target="_blank"
                          className="p-2 text-charcoal-400 hover:text-brown-700 transition-colors"
                          title="View on site"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          href={`/admin/services/edit/${service._id}`}
                          className="p-2 text-charcoal-400 hover:text-blue-600 transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteService(service._id)}
                          className="p-2 text-charcoal-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {services.length === 0 && (
              <div className="text-center py-20 text-charcoal-400">
                No services found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
