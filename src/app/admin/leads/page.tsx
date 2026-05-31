'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  Search, 
  Calendar, 
  Phone, 
  Mail,
  MapPin, 
  Briefcase, 
  Layout, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
  MoreVertical,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'

interface Lead {
  _id: string
  name: string
  phone: string
  email?: string
  city: string
  projectType: string
  scope: string
  bhkType?: string
  areaSqft?: number
  packageTier: string
  budget?: string
  additionalNotes?: string
  status: 'new' | 'contacted' | 'in_progress' | 'converted' | 'lost'
  createdAt: string
  source: string
}

const statusStyles = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
  converted: 'bg-green-50 text-green-700 border-green-200',
  lost: 'bg-red-50 text-red-700 border-red-200',
}

const statusIcons = {
  new: Clock3,
  contacted: Phone,
  in_progress: Clock,
  converted: CheckCircle2,
  lost: XCircle,
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads')
      const data = await res.json()
      if (Array.isArray(data)) {
        setLeads(data)
      }
    } catch (err) {
      console.error('Failed to fetch leads', err)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        const updated = await res.json()
        setLeads(prev => prev.map(l => l._id === id ? updated : l))
        setSelectedLead(updated)
      }
    } catch (err) {
      console.error('Failed to update lead status', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return
    }
    
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setLeads(prev => prev.filter(l => l._id !== id))
        setSelectedLead(null)
      }
    } catch (err) {
      console.error('Failed to delete lead', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    lead.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Leads', value: leads.length, icon: Users, color: 'bg-charcoal-900' },
          { label: 'New Leads', value: leads.filter(l => l.status === 'new').length, icon: Sparkles, color: 'bg-blue-600' },
          { label: 'In Progress', value: leads.filter(l => l.status === 'in_progress').length, icon: Clock, color: 'bg-purple-600' },
          { label: 'Conversion Rate', value: leads.length ? `${Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100)}%` : '0%', icon: CheckCircle2, color: 'bg-green-600' },
        ].map((stat, i) => (
          <div key={i} className="rounded-3xl border border-white/60 bg-white/40 p-6 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color} text-white shadow-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-500">{stat.label}</p>
                <p className="font-display text-2xl text-charcoal-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Leads List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/80 p-4 backdrop-blur-md shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
              <input 
                type="text"
                placeholder="Search leads by name, phone, email or city..."
                className="h-11 w-full rounded-2xl border-none bg-[#f6efe6]/60 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-charcoal-900/10 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-charcoal-900/10 bg-white text-charcoal-700 transition hover:bg-charcoal-900 hover:text-white">
              <Filter className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-24 w-full animate-pulse rounded-[1.5rem] bg-white/50" />
              ))
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => {
                const StatusIcon = statusIcons[lead.status]
                return (
                  <button
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className={`group relative flex w-full items-center gap-6 rounded-[1.5rem] border p-5 text-left transition-all duration-300 ${
                      selectedLead?._id === lead._id 
                        ? 'border-brown-200 bg-white shadow-xl shadow-brown-900/5 ring-1 ring-brown-200' 
                        : 'border-white/60 bg-white/50 hover:border-cream-200 hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f6efe6] text-charcoal-900 group-hover:bg-charcoal-900 group-hover:text-white transition-colors duration-300">
                      <Users className="h-6 w-6" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="truncate font-display text-xl text-charcoal-900">{lead.name}</h3>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[lead.status]}`}>
                          <StatusIcon className="h-3 w-3" />
                          {lead.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-charcoal-500">
                        <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {lead.phone}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {lead.city}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {format(new Date(lead.createdAt), 'MMM d, h:mm a')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brown-700 bg-brown-50 px-2 py-1 rounded-md">
                        {lead.projectType}
                      </span>
                      <ChevronRight className={`h-5 w-5 text-charcoal-300 transition-transform ${selectedLead?._id === lead._id ? 'translate-x-1 text-charcoal-900' : 'group-hover:translate-x-1 group-hover:text-charcoal-600'}`} />
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-charcoal-900/10 py-20 text-charcoal-500">
                <Users className="mb-4 h-12 w-12 opacity-20" />
                <p className="font-display text-xl">No leads found</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Details Sidebar/Modal */}
        <div className="w-full lg:w-96">
          <div className="sticky top-28 rounded-[2rem] border border-white/60 bg-white/60 p-8 backdrop-blur-xl shadow-xl shadow-charcoal-900/5 overflow-hidden">
            {selectedLead ? (
              <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-charcoal-900 text-white shadow-xl shadow-charcoal-900/20">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <h2 className="font-display text-3xl text-charcoal-900">{selectedLead.name}</h2>
                  <p className="mt-2 text-charcoal-500 uppercase text-[10px] font-bold tracking-widest">Captured via {selectedLead.source.replace('_', ' ')}</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <DetailItem icon={Phone} label="Contact" value={selectedLead.phone} />
                  {selectedLead.email && <DetailItem icon={Mail} label="Email" value={selectedLead.email} />}
                  <DetailItem icon={MapPin} label="Location" value={selectedLead.city} />
                  <DetailItem icon={Briefcase} label="Project Type" value={selectedLead.projectType} />
                  <DetailItem icon={Layout} label="Scope" value={selectedLead.scope} />
                  {selectedLead.bhkType && <DetailItem icon={MessageSquare} label="Scale" value={selectedLead.bhkType} />}
                  {selectedLead.budget && <DetailItem icon={Sparkles} label="Budget Range" value={selectedLead.budget} />}
                </div>

                {selectedLead.additionalNotes && (
                  <div className="p-6 rounded-[2rem] bg-[#fbf4eb] border border-brown-100 space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-brown-600" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brown-700">Vision & Notes</span>
                    </div>
                    <p className="text-sm text-charcoal-700 leading-relaxed font-light italic">
                      "{selectedLead.additionalNotes}"
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t border-cream-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">Current Status</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {(['new', 'contacted', 'in_progress', 'converted', 'lost'] as const).map((s) => (
                        <button
                          key={s}
                          disabled={isUpdating}
                          onClick={() => updateLeadStatus(selectedLead._id, s)}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                            selectedLead.status === s
                              ? statusStyles[s] + ' ring-1 ring-current'
                              : 'border-charcoal-900/5 bg-white text-charcoal-500 hover:border-charcoal-900/10 hover:bg-white'
                          } disabled:opacity-50`}
                        >
                          {isUpdating && selectedLead.status !== s ? (
                            <Clock className="h-3 w-3 animate-spin" />
                          ) : (
                            (() => {
                              const Icon = statusIcons[s]
                              return <Icon className="h-3 w-3" />
                            })()
                          )}
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a 
                    href={`tel:${selectedLead.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-charcoal-900 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-brown-900"
                  >
                    <Phone className="h-4 w-4" />
                    Call Lead
                  </a>
                  <button 
                    onClick={() => deleteLead(selectedLead._id)}
                    disabled={isDeleting}
                    title="Delete lead"
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                  >
                    {isDeleting ? <Clock className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                  </button>
                  <button className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-charcoal-900/10 bg-white text-charcoal-700 transition hover:bg-charcoal-900 hover:text-white">
                    <ExternalLink className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center text-center text-charcoal-400">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f6efe6] text-charcoal-300">
                  <Users className="h-10 w-10" />
                </div>
                <p className="font-display text-xl">No Lead Selected</p>
                <p className="mt-2 text-sm max-w-[200px]">Select a lead from the list to view full quote details and signals.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f6efe6] text-charcoal-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">{label}</p>
        <p className="text-sm font-semibold text-charcoal-900">{value}</p>
      </div>
    </div>
  )
}
