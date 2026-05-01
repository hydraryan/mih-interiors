'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedCallbackUrl = searchParams.get('callbackUrl')
  const callbackUrl =
    requestedCallbackUrl &&
    requestedCallbackUrl.startsWith('/admin') &&
    !requestedCallbackUrl.startsWith('/admin/api/')
      ? requestedCallbackUrl
      : '/admin'

  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        adminId,
        password,
        callbackUrl,
      })

      if (result?.error) {
        setError('Invalid admin ID or password.')
        return
      }

      router.replace(result?.url || callbackUrl)
      router.refresh()
    } catch {
      setError('Unable to sign in right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#ede6dc] text-charcoal-900">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_560px]">
        <section className="relative hidden min-h-screen overflow-hidden bg-charcoal-900 lg:block">
          <Image
            src="/mih_about_hero_interior.png"
            alt="MIH Interiors studio project"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,14,11,0.88),rgba(18,14,11,0.54)_45%,rgba(18,14,11,0.2))]" />
          <div className="absolute inset-0 flex flex-col justify-between px-12 py-10 xl:px-16">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/18 bg-white/12 backdrop-blur-md">
                <Image src="/logo.png" alt="MIH" width={28} height={28} className="h-7 w-7 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">MIH Interiors</p>
                <p className="mt-1 text-sm text-white/55">Admin workspace</p>
              </div>
            </div>

            <div className="max-w-2xl pb-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-[#d9b887]" />
                Protected access
              </div>
              <h1 className="font-display text-5xl leading-[1.02] text-white xl:text-7xl">
                Studio control, refined for focus.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72">
                A private entry point for content, media, inquiries, and project updates across the MIH website.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-3 border-y border-white/12 text-white">
              {[
                ['24/7', 'Access'],
                ['1', 'Admin'],
                ['MIH', 'Studio'],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-white/12 py-5 last:border-r-0">
                  <p className="font-display text-3xl text-[#e8cfa9]">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/52">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[430px]">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                <Image src="/logo.png" alt="MIH" width={28} height={28} className="h-7 w-7 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brown-800">MIH Interiors</p>
                <p className="mt-1 text-sm text-charcoal-800/60">Admin workspace</p>
              </div>
            </div>

            <div className="rounded-lg border border-white bg-[#fffdf9] p-6 shadow-[0_28px_70px_rgba(48,32,19,0.18)] sm:p-8">
              <div className="mb-8">
                <p className="inline-flex items-center gap-2 rounded-md border border-[#d9c6aa] bg-[#f7efe4] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brown-800">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Protected Portal
                </p>
                <h2 className="mt-5 font-display text-4xl leading-tight text-charcoal-900">Admin login</h2>
                <p className="mt-3 text-sm leading-6 text-charcoal-800/64">
                  Enter your credentials to continue to the MIH dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">
                    Admin ID
                  </span>
                  <input
                    value={adminId}
                    onChange={(event) => setAdminId(event.target.value)}
                    required
                    autoComplete="username"
                    placeholder="admin_mih"
                    className="admin-login-input h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-800/58">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Enter password"
                      className="admin-login-input h-12 w-full rounded-md border border-[#e3d8ca] bg-[#fbf7f1] px-4 pr-12 text-sm text-charcoal-900 outline-none transition placeholder:text-charcoal-800/34 focus:border-brown-700 focus:bg-white focus:ring-4 focus:ring-[#c9a56d]/18"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-charcoal-800/54 transition hover:bg-[#efe4d6] hover:text-charcoal-900"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#2b1a10] px-5 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(43,26,16,0.22)] transition hover:bg-[#3d2415] focus:outline-none focus:ring-4 focus:ring-[#c9a56d]/24 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Enter dashboard'}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              </form>

              <div className="mt-7 flex flex-col gap-3 border-t border-[#eadfd1] pt-5 text-xs text-charcoal-800/58 sm:flex-row sm:items-center sm:justify-between">
                <span>Need access? Contact the site owner.</span>
                <Link href="/" className="font-semibold text-brown-800 underline decoration-[#b89767] decoration-2 underline-offset-4 transition hover:text-brown-900">
                  Back to website
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
