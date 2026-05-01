'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { signOut } from 'next-auth/react'
import { urls } from '@/lib/urls'
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Newspaper,
  Images,
  LogOut,
  Menu,
  X,
  Sparkles,
  PanelsTopLeft,
  ShieldCheck,
} from 'lucide-react'

const navItems = [
  { href: urls.admin('/'), label: 'Dashboard', description: 'Analytics and lead signals', icon: LayoutDashboard },
  { href: urls.admin('/leads'), label: 'Leads', description: 'Chatbot captured inquiries', icon: ShieldCheck },
  { href: urls.admin('/services'), label: 'Services', description: 'Service pages and content', icon: Building2 },
  { href: urls.admin('/projects'), label: 'Projects', description: 'Portfolio and featured work', icon: FolderKanban },
  { href: urls.admin('/blogs'), label: 'Blogs', description: 'Editorial and SEO posts', icon: Newspaper },
  { href: urls.admin('/media'), label: 'Media', description: 'Public asset library', icon: Images },
]

function getSectionTitle(pathname: string) {
  if (pathname === '/admin') return 'Dashboard'
  if (pathname.startsWith('/admin/leads')) return 'Lead Management'
  if (pathname.startsWith('/admin/services')) return 'Services'
  if (pathname.startsWith('/admin/projects')) return 'Projects'
  if (pathname.startsWith('/admin/blogs')) return 'Blogs'
  if (pathname.startsWith('/admin/media')) return 'Media Library'
  return 'Admin Portal'
}

function getSectionSubtitle(pathname: string) {
  if (pathname === '/admin') return 'Monitor chatbot performance, leads, and exports.'
  if (pathname.startsWith('/admin/leads')) return 'Review and manage chatbot inquiries and quote requests.'
  if (pathname.startsWith('/admin/services')) return 'Manage service content and landing pages.'
  if (pathname.startsWith('/admin/projects')) return 'Update the featured portfolio and project cards.'
  if (pathname.startsWith('/admin/blogs')) return 'Publish and refine blog content.'
  if (pathname.startsWith('/admin/media')) return 'Browse studio assets stored in public/.'
  return 'Protected workspace for the MIH interiors team.'
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const activeTitle = useMemo(() => getSectionTitle(pathname), [pathname])
  const activeSubtitle = useMemo(() => getSectionSubtitle(pathname), [pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#f6efe6] text-charcoal-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,164,126,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(54,41,33,0.08),transparent_24%)]" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 flex-col border-r border-white/60 bg-white/82 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-3 border-b border-cream-200 px-8 py-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-charcoal-900 text-white shadow-lg shadow-charcoal-900/15">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-xl text-charcoal-900">MIH Admin</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal-500">Protected workspace</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6 rounded-3xl border border-brown-100 bg-[#fbf4eb] p-5">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-brown-700">
              <Sparkles className="h-3.5 w-3.5" />
              Single-admin portal
            </div>
            <p className="font-display text-2xl leading-tight text-charcoal-900">{activeTitle}</p>
            <p className="mt-2 text-sm leading-6 text-charcoal-600">{activeSubtitle}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-start gap-4 rounded-[1.2rem] border px-4 py-4 transition-all duration-300 ${
                    isActive
                      ? 'border-brown-200 bg-white shadow-lg shadow-brown-900/5'
                      : 'border-transparent hover:border-cream-200 hover:bg-white/70'
                  }`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl transition-colors ${isActive ? 'bg-charcoal-900 text-white' : 'bg-charcoal-900/5 text-charcoal-500 group-hover:bg-brown-50 group-hover:text-brown-700'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold ${isActive ? 'text-charcoal-900' : 'text-charcoal-700'}`}>{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-charcoal-500">{item.description}</p>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-cream-200 p-6">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-charcoal-900/10 bg-charcoal-900 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.26em] text-white transition-colors hover:bg-brown-900"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-80">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-[#f6efe6]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-charcoal-900/10 bg-white px-3 py-3 text-charcoal-900 shadow-sm lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open admin menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brown-700">Protected portal</p>
                <h1 className="truncate font-display text-2xl text-charcoal-900 sm:text-3xl">{activeTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden rounded-full border border-charcoal-900/10 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-700 transition-colors hover:border-brown-200 hover:text-brown-700 sm:inline-flex"
              >
                Open site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white shadow-lg shadow-charcoal-900/10 transition-colors hover:bg-brown-900"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="relative px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/45 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm border-r border-white/10 bg-[#f6efe6] p-5 shadow-2xl shadow-charcoal-900/20">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-charcoal-900 text-white">
                  <PanelsTopLeft className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-xl text-charcoal-900">MIH Admin</p>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal-500">Mobile menu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full border border-charcoal-900/10 bg-white p-2 text-charcoal-700"
                aria-label="Close admin menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5 rounded-3xl border border-brown-100 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-brown-700">{activeTitle}</p>
              <p className="mt-2 text-sm leading-6 text-charcoal-600">{activeSubtitle}</p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition-colors ${
                      isActive ? 'border-brown-200 bg-white' : 'border-transparent bg-white/70 hover:border-cream-200'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-brown-700' : 'text-charcoal-500'}`} />
                    <div>
                      <p className="font-semibold text-charcoal-900">{item.label}</p>
                      <p className="text-xs text-charcoal-500">{item.description}</p>
                    </div>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-charcoal-900/10 bg-white px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-700"
              >
                Open site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="rounded-2xl bg-charcoal-900 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white"
              >
                Logout
              </button>
            </div>
          </div>
          <button className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} aria-label="Close overlay" />
        </div>
      )}
    </div>
  )
}
