'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Image as ImageIcon, X, Layout, Search, Globe } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

import RichTextEditor from '@/components/admin/RichTextEditor'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    mainImage: '',
    category: 'Design Trends',
    author: {
      name: 'MIH Team',
      role: 'Interior Experts'
    },
    seo: {
      title: '',
      description: '',
      keywords: [] as string[],
      canonicalUrl: '',
      ogImage: ''
    },
    readingTime: '5 min read',
    publishStatus: 'draft',
    featured: false
  })

  const [keywordInput, setKeywordInput] = useState('')

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('seo.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, [field]: value }
      }))
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }
        // Auto-generate slug from title if slug is empty
        if (name === 'title' && !prev.slug) {
          newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }
        return newData
      })
    }
  }

  const addKeyword = () => {
    if (keywordInput && !formData.seo.keywords.includes(keywordInput)) {
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, keywords: [...prev.seo.keywords, keywordInput] }
      }))
      setKeywordInput('')
    }
  }

  const removeKeyword = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, keywords: prev.seo.keywords.filter(k => k !== tag) }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push('/admin/blogs')
      } else {
        const data = await res.json()
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert('Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-cream-100 min-h-screen p-8 text-charcoal-800">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-6 mb-12">
          <Link href="/admin/blogs" className="p-2 hover:bg-cream-200 rounded-full transition-colors text-charcoal-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-display text-4xl text-brown-800">Draft New Insight</h1>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-sm border border-cream-200 shadow-sm p-8">
              <div className="mb-6">
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Article Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. 10 Mistakes to Avoid in Luxury Renovations"
                  className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-3 font-display text-xl focus:ring-1 focus:ring-brown-800 outline-none transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">URL Slug</label>
                <input 
                  type="text" 
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="mistakes-to-avoid-luxury-renovations"
                  className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-2 font-mono text-sm focus:ring-1 focus:ring-brown-800 outline-none transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Excerpt (Summary for SEO & Grid)</label>
                <textarea 
                  name="excerpt"
                  required
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-3 font-body text-sm focus:ring-1 focus:ring-brown-800 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Content (Word Editor)</label>
                <RichTextEditor 
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Start writing your masterpiece..."
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-white rounded-sm border border-cream-200 shadow-sm p-8">
              <div className="flex items-center gap-2 mb-6 text-brown-800">
                <Globe size={20} />
                <h2 className="font-display text-xl">SEO Optimization Engine</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Meta Title</label>
                  <input 
                    type="text" 
                    name="seo.title"
                    value={formData.seo.title}
                    onChange={handleInputChange}
                    className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-sm font-body outline-none"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Canonical URL</label>
                  <input 
                    type="url" 
                    name="seo.canonicalUrl"
                    value={formData.seo.canonicalUrl}
                    onChange={handleInputChange}
                    placeholder="https://mihinteriors.in/blogs/slug"
                    className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-sm font-body outline-none"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Meta Description (Max 160 chars)</label>
                <textarea 
                  name="seo.description"
                  rows={2}
                  value={formData.seo.description}
                  onChange={handleInputChange}
                  className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-sm font-body outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Focus Keywords (Press Add)</label>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    className="flex-1 bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-sm outline-none"
                  />
                  <button type="button" onClick={addKeyword} className="bg-charcoal-800 text-white px-4 py-2 rounded-md text-xs font-bold">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seo.keywords.map(k => (
                    <span key={k} className="flex items-center gap-1 px-3 py-1 bg-cream-100 text-charcoal-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {k} <X size={10} className="cursor-pointer" onClick={() => removeKeyword(k)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-sm border border-cream-200 shadow-sm p-6">
              <h3 className="font-display text-lg text-brown-800 mb-6">Publishing</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-sm font-body outline-none"
                  >
                    <option>Design Trends</option>
                    <option>Home Improvement</option>
                    <option>Commercial Strategy</option>
                    <option>Architecture</option>
                    <option>MIH Stories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-2">Status</label>
                  <select 
                    name="publishStatus"
                    value={formData.publishStatus}
                    onChange={handleInputChange}
                    className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-sm font-body outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
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
                  <label htmlFor="featured" className="font-body text-sm font-semibold text-charcoal-700">Feature this post</label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brown-800 text-white py-4 rounded-md font-body text-sm font-bold flex items-center justify-center gap-2 hover:bg-brown-900 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>

            <div className="bg-white rounded-sm border border-cream-200 shadow-sm p-6">
              <h3 className="font-display text-lg text-brown-800 mb-6">Main Image</h3>
              <div className="space-y-4">
                <input 
                  type="url" 
                  name="mainImage"
                  required
                  value={formData.mainImage}
                  onChange={handleInputChange}
                  placeholder="Paste image URL..."
                  className="w-full bg-cream-50 border border-cream-200 rounded-md px-4 py-2 text-xs font-body outline-none"
                />
                {formData.mainImage && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-cream-100 bg-cream-50">
                    <img src={getDirectImageUrl(formData.mainImage)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {!formData.mainImage && (
                  <div className="aspect-video rounded-lg border-2 border-dashed border-cream-100 flex items-center justify-center text-cream-300">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
