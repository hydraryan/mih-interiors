'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Edit2, Loader2, UserPlus, GripVertical } from 'lucide-react'

type TeamMember = {
  _id: string
  name: string
  designation: string
  image: string
  order: number
  isActive: boolean
}

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    image: '',
    order: 0,
    isActive: true
  })

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team')
      const data = await res.json()
      if (data.success) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingMember ? `/api/admin/team/${editingMember._id}` : '/api/admin/team'
      const method = editingMember ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        await fetchMembers()
        closeModal()
      }
    } catch (error) {
      alert('Failed to save team member')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMembers(members.filter(m => m._id !== id))
      }
    } catch (error) {
      alert('Failed to delete member')
    }
  }

  const openModal = (member: TeamMember | null = null) => {
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        designation: member.designation,
        image: member.image,
        order: member.order,
        isActive: member.isActive
      })
    } else {
      setEditingMember(null)
      setFormData({
        name: '',
        designation: '',
        image: '',
        order: members.length + 1,
        isActive: true
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingMember(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-charcoal-900">Studio Collective</h2>
          <p className="text-charcoal-500 text-sm mt-1">Manage the profiles displayed on the About Us page.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-2xl bg-charcoal-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-charcoal-900/20 transition-all hover:bg-brown-900 hover:-translate-y-0.5 active:translate-y-0"
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brown-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member._id} className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-charcoal-900/5 shadow-sm hover:shadow-xl hover:shadow-charcoal-900/5 transition-all duration-500">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => openModal(member)}
                    className="p-3 rounded-2xl bg-white/90 backdrop-blur text-charcoal-900 hover:bg-white transition-colors shadow-lg"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(member._id)}
                    className="p-3 rounded-2xl bg-red-500/90 backdrop-blur text-white hover:bg-red-500 transition-colors shadow-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brown-600">Order #{member.order}</span>
                  {!member.isActive && <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">Inactive</span>}
                </div>
                <h3 className="font-display text-2xl text-charcoal-900">{member.name}</h3>
                <p className="text-charcoal-500 text-sm font-light mt-1">{member.designation}</p>
              </div>
            </div>
          ))}
          
          {members.length === 0 && (
            <button 
              onClick={() => openModal()}
              className="group col-span-full h-64 border-2 border-dashed border-charcoal-900/10 rounded-[3rem] flex flex-col items-center justify-center gap-4 hover:border-brown-300 hover:bg-brown-50/30 transition-all"
            >
              <div className="h-14 w-14 rounded-full bg-charcoal-900/5 flex items-center justify-center text-charcoal-400 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-charcoal-400 group-hover:text-brown-600">Start building your team</p>
            </button>
          )}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-xl rounded-[3rem] bg-white p-10 shadow-2xl overflow-hidden">
            <h3 className="font-display text-3xl text-charcoal-900 mb-8">
              {editingMember ? 'Edit Profile' : 'New Member'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl border border-charcoal-900/10 bg-charcoal-900/5 px-5 py-4 text-sm focus:border-brown-300 focus:ring-0 transition-colors"
                    placeholder="e.g. Ar. Mohit Mahajan"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 ml-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-2xl border border-charcoal-900/10 bg-charcoal-900/5 px-5 py-4 text-sm focus:border-brown-300 focus:ring-0 transition-colors"
                    placeholder="e.g. Principal Architect"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 ml-1">Profile Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full rounded-2xl border border-charcoal-900/10 bg-charcoal-900/5 px-5 py-4 text-sm focus:border-brown-300 focus:ring-0 transition-colors"
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="text-[10px] text-charcoal-400 mt-1 italic">Use Unsplash or upload to media library and copy path.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 ml-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full rounded-2xl border border-charcoal-900/10 bg-charcoal-900/5 px-5 py-4 text-sm focus:border-brown-300 focus:ring-0 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-5 w-5 rounded border-charcoal-900/10 text-brown-600 focus:ring-brown-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-charcoal-600 font-medium">Active Status</label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-charcoal-900 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-charcoal-900/20 transition-all hover:bg-brown-900 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl border border-charcoal-900/10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-900 hover:bg-charcoal-900/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
