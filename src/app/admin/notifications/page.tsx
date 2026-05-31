'use client'

import { useEffect, useState } from 'react'
import { Bell, Loader2, Plus, Save, Trash2, Mail } from 'lucide-react'

const MAX_EMAILS = 5

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function AdminNotificationsPage() {
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings?key=notification_emails')
        const data = await res.json()
        if (data.success && data.setting && Array.isArray(data.setting.value)) {
          setEmails(data.setting.value)
        }
      } catch (err) {
        console.error('Failed to load notification emails:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const addEmail = () => {
    setError(null)
    setMessage(null)
    const trimmed = newEmail.trim().toLowerCase()
    if (!trimmed) return
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }
    if (emails.includes(trimmed)) {
      setError('This email is already in the list.')
      return
    }
    if (emails.length >= MAX_EMAILS) {
      setError(`Maximum ${MAX_EMAILS} emails allowed.`)
      return
    }
    setEmails([...emails, trimmed])
    setNewEmail('')
  }

  const removeEmail = (index: number) => {
    setError(null)
    setMessage(null)
    setEmails(emails.filter((_, i) => i !== index))
  }

  const saveEmails = async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'notification_emails', value: emails }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to save')
      setMessage('Notification emails saved successfully.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save notification emails')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-4xl border border-white/70 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fbf4eb] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-brown-700">
            <Bell className="h-3.5 w-3.5" />
            Email Notifications
          </div>
          <h2 className="font-display text-3xl text-charcoal-900">Notification recipients</h2>
          <p className="max-w-2xl text-sm leading-6 text-charcoal-600">
            Manage email addresses that receive instant notifications when someone submits a contact form, chatbot quote, or 3D rendering inquiry. Up to {MAX_EMAILS} emails allowed.
          </p>
        </div>
        <div className="rounded-4xl border border-cream-200 bg-[#fbf4eb] px-4 py-3 text-sm text-charcoal-700">
          <div className="font-semibold text-charcoal-900">{emails.length} / {MAX_EMAILS}</div>
          <div className="text-xs uppercase tracking-[0.24em] text-charcoal-500">Active recipients</div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-brown-700" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current emails */}
          <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-sm">
            <div className="border-b border-cream-200 bg-cream-50/60 px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-charcoal-500">
                Active notification emails
              </p>
            </div>
            <div className="divide-y divide-cream-100">
              {emails.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-charcoal-500">
                  No notification emails configured. Add one below.
                </div>
              ) : (
                emails.map((email, index) => (
                  <div key={email} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fbf4eb]">
                        <Mail className="h-4 w-4 text-brown-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal-900">{email}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">Recipient #{index + 1}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEmail(index)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 transition-colors hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add new email */}
          <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-sm">
            <div className="border-b border-cream-200 bg-cream-50/60 px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-charcoal-500">
                Add new recipient
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-cream-200 bg-[#fbf4eb] px-3 py-2.5">
                  <Mail className="h-4 w-4 text-brown-700 shrink-0" />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                    className="w-full bg-transparent text-sm font-medium text-charcoal-900 outline-none placeholder:text-charcoal-400"
                    placeholder="Enter email address..."
                    disabled={emails.length >= MAX_EMAILS}
                  />
                </div>
                <button
                  type="button"
                  onClick={addEmail}
                  disabled={emails.length >= MAX_EMAILS}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal-900/10 bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-700 transition-colors hover:border-brown-200 hover:text-brown-700 disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
              {emails.length >= MAX_EMAILS && (
                <p className="mt-2 text-xs text-charcoal-400">Maximum {MAX_EMAILS} recipients reached. Remove one to add another.</p>
              )}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveEmails}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brown-900 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save notification settings
            </button>
          </div>

          {/* Info card */}
          <div className="rounded-4xl border border-cream-200 bg-[#fbf4eb] p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brown-700 mb-3">How it works</p>
            <div className="space-y-2 text-sm leading-6 text-charcoal-600">
              <p>When a visitor submits any of the following forms, all emails listed above will receive an instant notification:</p>
              <ul className="list-inside space-y-1 ml-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span><strong>Contact form</strong> — Name, email, phone, city, message</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span><strong>AI Chatbot quote</strong> — Full project details, budget range, package tier</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span><strong>3D Visualization form</strong> — Name, phone, city, project type, area</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
