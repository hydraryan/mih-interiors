'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { ArrowLeft, KeyRound, Loader2, ShieldCheck } from 'lucide-react'
import { urls } from '@/lib/urls'

export default function AdminForgotPasswordForm() {
  const [adminId, setAdminId] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState<string | null>(null)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [status, setStatus] = useState<'request' | 'verify' | 'reset' | 'done'>('request')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const id = setInterval(() => {
      setCooldownSeconds((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [cooldownSeconds])

  const requestOtp = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Unable to request OTP.')

      setCooldownSeconds(Number(data.cooldownSeconds || 60))
      setStatus('verify')
      setMessage('If account exists, OTP has been sent to configured notification emails.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to request OTP right now.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, otp }),
      })
      const data = await res.json()
      if (!data.success || !data.resetToken) throw new Error(data.error || 'Invalid OTP.')

      setResetToken(data.resetToken)
      setStatus('reset')
      setMessage('OTP verified. You can now set a new password.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to verify OTP.')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setLoading(false)
      setError('New password and confirm password must match.')
      return
    }

    try {
      const res = await fetch('/api/auth/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId,
          resetToken,
          newPassword,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Unable to reset password.')

      setStatus('done')
      setMessage(data.message || 'Password reset successful. Logging you in...')

      if (data.shouldLogOut) {
        setTimeout(() => {
          signOut({ callbackUrl: urls.admin('/login') })
        }, 2000)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#ede6dc] text-charcoal-900">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full rounded-lg border border-white bg-[#fffdf9] p-6 shadow-[0_28px_70px_rgba(48,32,19,0.18)] sm:p-8">
          <div className="mb-8">
            <p className="inline-flex items-center gap-2 rounded-md border border-[#d9c6aa] bg-[#f7efe4] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brown-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Security
            </p>
            <h1 className="mt-5 font-display text-4xl leading-tight text-charcoal-900">Reset password</h1>
            <p className="mt-3 text-sm leading-6 text-charcoal-800/64">
              Request OTP, verify it, then set a new admin password.
            </p>
          </div>

          {message && <div className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
          {error && <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">Admin ID</span>
              <input
                value={adminId}
                onChange={(event) => setAdminId(event.target.value)}
                disabled={status !== 'request'}
                placeholder="admin_mih"
                className="h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18 disabled:opacity-70"
              />
            </label>

            {status === 'request' && (
              <button
                type="button"
                disabled={loading || !adminId.trim()}
                onClick={requestOtp}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#2b1a10] px-5 text-sm font-semibold text-white transition hover:bg-[#3d2415] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Request OTP
              </button>
            )}

            {status === 'verify' && (
              <>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">OTP</span>
                  <input
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18"
                  />
                </label>

                <button
                  type="button"
                  disabled={loading || otp.length !== 6}
                  onClick={verifyOtp}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#2b1a10] px-5 text-sm font-semibold text-white transition hover:bg-[#3d2415] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Verify OTP
                </button>

                <button
                  type="button"
                  disabled={loading || cooldownSeconds > 0}
                  onClick={requestOtp}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md border border-[#d9c6aa] bg-[#f7efe4] px-5 text-sm font-semibold text-brown-800 transition hover:bg-[#f1e4d2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cooldownSeconds > 0 ? `Resend OTP in ${cooldownSeconds}s` : 'Resend OTP'}
                </button>
              </>
            )}

            {status === 'reset' && (
              <>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">New Password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Create new password"
                    className="h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">Confirm New Password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    className="h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18"
                  />
                </label>

                <button
                  type="button"
                  disabled={loading || !newPassword || !confirmPassword || !resetToken}
                  onClick={resetPassword}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#2b1a10] px-5 text-sm font-semibold text-white transition hover:bg-[#3d2415] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  Reset Password
                </button>
              </>
            )}

            {status === 'done' && (
              <Link
                href={urls.admin('/login')}
                className="inline-flex h-11 w-full items-center justify-center rounded-md border border-[#d9c6aa] bg-[#f7efe4] px-5 text-sm font-semibold text-brown-800 transition hover:bg-[#f1e4d2]"
              >
                Back to Admin Login
              </Link>
            )}
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-[#eadfd1] pt-5 text-xs text-charcoal-800/58">
            <span>Need help? Contact the site owner.</span>
            <Link href={urls.admin('/login')} className="inline-flex items-center gap-1 font-semibold text-brown-800 underline decoration-[#b89767] decoration-2 underline-offset-4 transition hover:text-brown-900">
              <ArrowLeft className="h-3.5 w-3.5" />
              Admin login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
