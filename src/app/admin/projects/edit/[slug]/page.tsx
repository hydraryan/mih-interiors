'use client'

import { useState, useEffect, use, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

export default function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Residential',
    description: '',
    mainImage: '',
    images: [] as string[],
    imagePublicIds: [] as string[],
    mainImagePublicId: '',
    featured: false,
    order: 0
  })

  const [newImageUrl, setNewImageUrl] = useState('')

  const getImagePublicId = (images: string[], imagePublicIds: string[], imageUrl: string) => {
    const index = images.indexOf(imageUrl)
    return index >= 0 ? imagePublicIds[index] || '' : ''
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${resolvedParams.slug}`)
        if (res.ok) {
          const data = await res.json()
          setFormData({
            ...data,
            images: Array.isArray(data.images) ? data.images : [],
            imagePublicIds: Array.isArray(data.imagePublicIds) ? data.imagePublicIds : [],
            mainImagePublicId: data.mainImagePublicId || '',
          })
        } else {
          router.push('/admin/projects')
        }
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [resolvedParams.slug, router])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addImage = () => {
    if (newImageUrl && formData.images.length < 5) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl],
        imagePublicIds: [...prev.imagePublicIds, ''],
        mainImage: prev.mainImage || newImageUrl
      }))
      setNewImageUrl('')
    } else if (formData.images.length >= 5) {
      alert('Maximum 5 photos allowed per project.')
    }
  }

  const uploadImage = async () => {
    if (!selectedFile) {
      alert('Choose a photo first.')
      return
    }

    if (formData.images.length >= 5) {
      alert('Maximum 5 photos allowed per project.')
      return
    }

    setUploading(true)

    try {
      const uploadData = new FormData()
      uploadData.append('file', selectedFile)
      uploadData.append('folder', formData.type === 'Commercial' ? 'commercial-sites-photos' : 'residential-sites-photos')

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: uploadData,
      })

      const body = await response.json()
      if (!response.ok || !body.success || !body.upload) {
        throw new Error(body.error || 'Failed to upload photo')
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, body.upload.secure_url],
        imagePublicIds: [...prev.imagePublicIds, body.upload.public_id],
        mainImage: prev.mainImage || body.upload.secure_url,
        mainImagePublicId: prev.mainImagePublicId || body.upload.public_id,
      }))
      setSelectedFile(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index)
      const newPublicIds = prev.imagePublicIds.filter((_, i) => i !== index)
      const removedImage = prev.images[index]
      const nextMainImage = prev.mainImage === removedImage ? (newImages[0] || '') : prev.mainImage
      return {
        ...prev,
        images: newImages,
        imagePublicIds: newPublicIds,
        mainImage: nextMainImage,
        mainImagePublicId: nextMainImage ? getImagePublicId(newImages, newPublicIds, nextMainImage) : ''
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/projects/${resolvedParams.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push('/admin/projects')
      } else {
        const data = await res.json()
        alert(`Error: ${data.error}`)
      }
    } catch {
      alert('Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-cream-100 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-800"></div>
      </div>
    )
  }

  return (
    <div className="bg-cream-100 min-h-screen p-8 text-charcoal-800">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-6 mb-12">
          <Link href="/admin/projects" className="p-2 hover:bg-cream-200 rounded-full transition-colors text-charcoal-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-display text-4xl text-brown-800">Edit Project</h1>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-cream-200 shadow-sm p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Project Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-3 font-body focus:ring-1 focus:ring-brown-800 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Location</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-3 font-body focus:ring-1 focus:ring-brown-800 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Project Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-3 font-body focus:ring-1 focus:ring-brown-800 outline-none transition-all"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-brown-800 rounded focus:ring-brown-800"
                />
                <label htmlFor="featured" className="font-body text-sm font-semibold text-charcoal-700">Feature this project on home page</label>
              </div>
            </div>

            {/* Photos Section */}
            <div>
              <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Project Photos (Max 5)</label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-sm font-body focus:ring-1 focus:ring-brown-800 outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={addImage}
                    className="bg-charcoal-800 text-white px-4 py-2 rounded-md hover:bg-charcoal-900 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="flex-1 bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-sm font-body focus:ring-1 focus:ring-brown-800 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-charcoal-800 file:px-4 file:py-2 file:text-white hover:file:bg-charcoal-900"
                  />
                  <button
                    type="button"
                    onClick={uploadImage}
                    disabled={uploading}
                    className="bg-brown-800 text-white px-4 py-2 rounded-md hover:bg-brown-900 transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group bg-cream-100 border border-cream-200">
                      <img src={getDirectImageUrl(url)} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                      {formData.mainImage === url && (
                        <div className="absolute bottom-0 left-0 right-0 bg-brown-800 text-white text-[8px] uppercase tracking-widest text-center py-1">Main</div>
                      )}
                      {formData.mainImage !== url && (
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, mainImage: url, mainImagePublicId: p.imagePublicIds[idx] || '' }))}
                          className="absolute inset-0 bg-black/40 text-white text-[8px] uppercase tracking-widest flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Set Main
                        </button>
                      )}
                    </div>
                  ))}
                  {Array.from({ length: 5 - formData.images.length }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-cream-200 flex items-center justify-center text-cream-300">
                      <ImageIcon size={20} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Project Description</label>
            <textarea 
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-3 font-body focus:ring-1 focus:ring-brown-800 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-4 border-t border-cream-100 pt-8">
            <Link 
              href="/admin/projects"
              className="px-8 py-3 rounded-md font-body text-sm font-bold text-charcoal-400 hover:text-charcoal-600 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={saving}
              className="bg-brown-800 text-white px-10 py-3 rounded-md font-body text-sm font-bold flex items-center gap-2 hover:bg-brown-900 transition-colors disabled:opacity-50 shadow-lg shadow-brown-800/20"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
