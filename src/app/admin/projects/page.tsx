'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Edit2, ExternalLink, Image as ImageIcon, Pencil, Save, X, Star } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [featuredChanges, setFeaturedChanges] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects(projects.filter(p => p.slug !== slug))
      }
    } catch (error) {
      alert('Failed to delete project')
    }
  }

  const enterEditMode = () => {
    // Initialize featuredChanges with current featured values
    const initial: Record<string, boolean> = {}
    projects.forEach(p => {
      initial[p.slug] = p.featured || false
    })
    setFeaturedChanges(initial)
    setEditMode(true)
  }

  const cancelEditMode = () => {
    setFeaturedChanges({})
    setEditMode(false)
  }

  const toggleFeatured = (slug: string) => {
    setFeaturedChanges(prev => ({
      ...prev,
      [slug]: !prev[slug],
    }))
  }

  const saveFeaturedChanges = async () => {
    setSaving(true)
    try {
      const updatePromises = Object.entries(featuredChanges).map(([slug, featured]) => {
        // Only update if the value actually changed
        const original = projects.find(p => p.slug === slug)
        if (original && (original.featured || false) !== featured) {
          return fetch(`/api/projects/${slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featured }),
          })
        }
        return Promise.resolve(null)
      })

      await Promise.all(updatePromises)

      // Update local state
      setProjects(prev =>
        prev.map(p => ({
          ...p,
          featured: featuredChanges[p.slug] ?? p.featured,
        }))
      )

      setEditMode(false)
      setFeaturedChanges({})
    } catch (error) {
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const featuredCount = editMode
    ? Object.values(featuredChanges).filter(Boolean).length
    : projects.filter(p => p.featured).length

  return (
    <div className="bg-cream-100 min-h-screen p-8 text-charcoal-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-display text-4xl text-brown-800">Project Management</h1>
            <p className="font-body text-charcoal-500 mt-2 text-sm italic underline">admin.localhost:3000/projects</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/admin/projects/new" 
              className="bg-brown-800 text-white px-6 py-2.5 rounded-md font-body text-sm flex items-center gap-2 hover:bg-brown-900 transition-colors"
            >
              <Plus size={18} />
              Add Project
            </Link>
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-800"></div>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-cream-200 overflow-hidden shadow-sm">
            {/* ── Table Toolbar ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 bg-cream-50/50">
              <div className="flex items-center gap-3">
                <Star size={16} className="text-amber-500" />
                <span className="font-body text-sm text-charcoal-600">
                  <strong className="text-charcoal-900">{featuredCount}</strong> of {projects.length} projects featured on Home Page
                </span>
              </div>
              <div className="flex items-center gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={cancelEditMode}
                      className="px-4 py-2 rounded-md font-body text-sm text-charcoal-500 hover:text-charcoal-800 border border-cream-200 hover:border-charcoal-300 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={saveFeaturedChanges}
                      disabled={saving}
                      className="px-5 py-2 rounded-md font-body text-sm bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={enterEditMode}
                    className="px-5 py-2 rounded-md font-body text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Pencil size={16} />
                    Edit Featured
                  </button>
                )}
              </div>
            </div>

            <table className="w-full text-left font-body text-sm">
              <thead className="bg-cream-50 border-b border-cream-200 text-charcoal-400 uppercase tracking-widest text-[10px]">
                <tr>
                  {editMode && <th className="px-6 py-4 text-center">Featured</th>}
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Images</th>
                  {!editMode && <th className="px-6 py-4 text-center">Home Page</th>}
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {projects.map((project) => (
                  <tr key={project._id} className={`hover:bg-cream-50/50 transition-colors ${editMode && featuredChanges[project.slug] ? 'bg-amber-50/40' : ''}`}>
                    {/* Checkbox column in edit mode */}
                    {editMode && (
                      <td className="px-6 py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={featuredChanges[project.slug] || false}
                            onChange={() => toggleFeatured(project.slug)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-cream-300 rounded peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                            {featuredChanges[project.slug] && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </td>
                    )}

                    <td className="px-6 py-4">
                      <div className="w-16 h-12 relative rounded overflow-hidden bg-cream-100 border border-cream-200">
                        <img 
                          src={getDirectImageUrl(project.mainImage)} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-charcoal-900">{project.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        project.type === 'Residential' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {project.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">{project.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-charcoal-400">
                        <ImageIcon size={14} />
                        <span>{project.images?.length || 0}</span>
                      </div>
                    </td>
                    {/* Featured status badge (read-only mode) */}
                    {!editMode && (
                      <td className="px-6 py-4 text-center">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                            <Star size={10} fill="currentColor" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-charcoal-300 text-xs">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/projects`} 
                          target="_blank"
                          className="p-2 text-charcoal-400 hover:text-blush-500 transition-colors"
                          title="View on site"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          href={`/admin/projects/edit/${project.slug}`}
                          className="p-2 text-charcoal-400 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteProject(project.slug)}
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
            {projects.length === 0 && (
              <div className="text-center py-20 text-charcoal-400">
                No projects found. Add your first project to showcase your work!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
