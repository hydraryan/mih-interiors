'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Loader2, ShieldCheck } from 'lucide-react'
import { urls } from '@/lib/urls'

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password must match.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Unable to change password.')

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage(data.message || 'Password changed successfully. Logging you out for security...')

      if (data.shouldLogOut) {
        setTimeout(() => {
          signOut({ callbackUrl: urls.admin('/login') })
        }, 2000)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to change password right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-white/70 bg-white p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#fbf4eb] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-brown-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Account Security
        </div>
        <h2 className="mt-4 font-display text-3xl text-charcoal-900">Change admin password</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal-600">
          Update your dashboard password anytime. You must enter your current password to confirm this action.
        </p>
      </div>

      {message && <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

      <form onSubmit={onSubmit} className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-sm">
        <div className="border-b border-cream-200 bg-cream-50/60 px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-charcoal-500">Update credentials</p>
        </div>

        <div className="space-y-5 p-6">
          <label className="block">
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-charcoal-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brown-900 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            Save new password
          </button>
        </div>
      </form>
    </div>
  )
}
