'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  Brain,
  Building2,
  FolderKanban,
  Image as ImageIcon,
  LineChart,
  Newspaper,
  Palette,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react'
import type { AdminAnalytics, AnalyticsListItem } from '@/lib/admin/analytics'
import ChatbotHealthVisualizer from '@/components/admin/ChatbotHealthVisualizer'

const EMPTY_ANALYTICS: AdminAnalytics = {
  generatedAt: new Date(0).toISOString(),
  overview: {
    totalLeads: 0,
    chatbotStarts: 0,
    conversionRatePct: 0,
    publishedBlogs: 0,
    publishedProjects: 0,
    publishedServices: 0,
    mediaAssets: 0,
  },
  chatbot: {
    totalLeads: 0,
    chatbotStarts: 0,
    submittedConversations: 0,
    conversionRatePct: 0,
    faqQuestions: 0,
    faqAnswered: 0,
    faqResponseRatePct: 0,
    personalizationAccepted: 0,
    personalizationDeclined: 0,
    consentOptInRatePct: 0,
    topDropOffSteps: [],
    recentActivity: [],
    generatedAt: new Date(0).toISOString(),
  },
  traffic: {
    status: 'not_configured',
    note: 'GA4 is not configured yet.',
    sessions: null,
    users: null,
    pageViews: null,
    topPages: [],
    deviceMix: [],
    geoBreakdown: [],
  },
  searchConsole: {
    status: 'not_configured',
    note: 'Search Console is not configured yet.',
    clicks: null,
    impressions: null,
    ctrPct: null,
    averagePosition: null,
    topQueries: [],
    topPages: [],
  },
  content: {
    blogCount: 0,
    projectCount: 0,
    serviceCount: 0,
    mediaCount: 0,
    recentLeads: [],
    recentEvents: [],
  },
}

type AnalyticsResponse = {
  success?: boolean
  error?: string
  analytics?: AdminAnalytics
}

function statCards(analytics: AdminAnalytics) {
  return [
    { label: 'Total Leads', value: analytics.overview.totalLeads.toString(), icon: Users },
    { label: 'Chatbot Starts', value: analytics.overview.chatbotStarts.toString(), icon: Brain },
    { label: 'Conversion Rate', value: `${analytics.overview.conversionRatePct}%`, icon: LineChart },
    { label: 'Published Blogs', value: analytics.overview.publishedBlogs.toString(), icon: Newspaper },
    { label: 'Published Projects', value: analytics.overview.publishedProjects.toString(), icon: FolderKanban },
    { label: 'Media Assets', value: analytics.overview.mediaAssets.toString(), icon: ImageIcon },
  ]
}

function formatItem(item: AnalyticsListItem) {
  return item.detail ? `${item.label} · ${item.detail}` : item.label
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics>(EMPTY_ANALYTICS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let active = true

    const fetchAnalytics = async () => {
      try {
        // Add cache buster to force mobile browsers to bypass stale edge/browser caches
        const response = await fetch(`/api/admin/analytics?t=${Date.now()}`, { cache: 'no-store' })
        
        // Handle cases where the server returns an HTML error page (e.g. 404, 500)
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned an invalid response. Please refresh the page.')
        }

        const body = (await response.json()) as AnalyticsResponse

        if (!response.ok || !body.success || !body.analytics) {
          throw new Error(body.error ?? 'Unable to load admin analytics')
        }

        if (!active) return
        setAnalytics(body.analytics)
        setError(null)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Unable to load admin analytics')
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchAnalytics()
    const interval = setInterval(() => {
      void fetchAnalytics()
    }, 30000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const metrics = useMemo(() => statCards(analytics), [analytics])

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-8 shadow-[0_32px_80px_rgba(54,41,33,0.06)] backdrop-blur-2xl lg:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brown-50/40 via-transparent to-brown-100/20" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-brown-700">
              <Sparkles className="h-3.5 w-3.5" />
              Protected workspace
            </div>
            <h1 className="font-display text-4xl text-brown-800 sm:text-5xl">Admin analytics overview</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-charcoal-600 sm:text-base">
              A merged view of chatbot, lead, content, traffic, and search signals. GA4 and Search Console panels gracefully fall back when credentials are not configured.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link href="/admin/services" className="rounded-[1.25rem] border border-white/60 bg-white/50 backdrop-blur-md px-5 py-2.5 text-brown-800 transition-all shadow-sm hover:shadow-md hover:bg-white/90">Services</Link>
            <Link href="/admin/projects" className="rounded-[1.25rem] border border-white/60 bg-white/50 backdrop-blur-md px-5 py-2.5 text-brown-800 transition-all shadow-sm hover:shadow-md hover:bg-white/90">Projects</Link>
            <Link href="/admin/blogs" className="rounded-[1.25rem] border border-white/60 bg-white/50 backdrop-blur-md px-5 py-2.5 text-brown-800 transition-all shadow-sm hover:shadow-md hover:bg-white/90">Blogs</Link>
            <Link href="/admin/media" className="rounded-[1.25rem] border border-white/60 bg-white/50 backdrop-blur-md px-5 py-2.5 text-brown-800 transition-all shadow-sm hover:shadow-md hover:bg-white/90">Media</Link>
          </div>
        </div>
      </header>

      {loading && <p className="text-sm text-charcoal-700/70">Loading analytics...</p>}
      {error && <p className="text-sm text-red-600">Analytics error: {error}</p>}

      <ChatbotHealthVisualizer />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg hover:bg-white/80">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-brown-100/40 to-transparent blur-2xl group-hover:bg-brown-200/50 transition-colors" />
              <div className="relative mb-4 flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal-500/80">{metric.label}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50">
                  <Icon className="h-4 w-4 text-brown-700" />
                </div>
              </div>
              <p className="relative font-display text-4xl text-brown-800">{metric.value}</p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2.5rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50">
              <Brain className="h-4 w-4 text-brown-700" />
            </div>
            <h2 className="font-display text-2xl text-brown-800">Chatbot funnel</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/50 p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">FAQ response rate</p>
              <p className="mt-2 font-display text-3xl text-charcoal-900">{analytics.chatbot.faqResponseRatePct}%</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/50 p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">Consent opt-in</p>
              <p className="mt-2 font-display text-3xl text-charcoal-900">{analytics.chatbot.consentOptInRatePct}%</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {analytics.chatbot.topDropOffSteps.length === 0 ? (
              <p className="text-sm text-charcoal-500">No drop-off data yet.</p>
            ) : (
              analytics.chatbot.topDropOffSteps.map((step) => (
                <div key={step.stepId} className="flex items-center justify-between rounded-2xl border border-cream-100 px-4 py-3 text-sm">
                  <span className="uppercase tracking-wide text-charcoal-700">{step.stepId.replaceAll('_', ' ')}</span>
                  <span className="font-semibold text-brown-800">{step.count}</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-cream-100 bg-[#fcf8f0] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">Recent chatbot activity</p>
            <ul className="mt-3 space-y-2 text-sm text-charcoal-700">
              {analytics.chatbot.recentActivity.length === 0 ? (
                <li>No recent events.</li>
              ) : (
                analytics.chatbot.recentActivity.map((event) => (
                  <li key={`${event.conversationId}-${event.eventType}-${event.createdAt}`} className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold uppercase text-brown-700">{event.eventType}</span>
                    <span className="text-charcoal-400">•</span>
                    <span>{event.stepId ?? 'n/a'}</span>
                    <span className="text-charcoal-400">•</span>
                    <span className="text-charcoal-500">{new Date(event.createdAt).toLocaleString()}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50">
              <BarChart3 className="h-4 w-4 text-brown-700" />
            </div>
            <h2 className="font-display text-2xl text-brown-800">Traffic and SEO</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Sessions', value: analytics.traffic.sessions ?? 0 },
              { label: 'Users', value: analytics.traffic.users ?? 0 },
              { label: 'Page views', value: analytics.traffic.pageViews ?? 0 },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-white/80 bg-white/50 p-5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">{item.label}</p>
                <p className="mt-2 font-display text-3xl text-charcoal-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-cream-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">GA4</p>
                <p className="mt-1 text-sm text-charcoal-600">{analytics.traffic.note}</p>
              </div>
              <span className="rounded-full bg-charcoal-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                {analytics.traffic.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {analytics.traffic.topPages.length === 0 ? (
                <p className="text-sm text-charcoal-500">No GA4 page data yet.</p>
              ) : (
                analytics.traffic.topPages.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-cream-100 px-4 py-3 text-sm">
                    <span className="truncate text-charcoal-700">{item.label}</span>
                    <span className="font-semibold text-brown-800">{formatItem(item)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-cream-100 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">Device mix</p>
              <div className="mt-3 space-y-2">
                {analytics.traffic.deviceMix.length === 0 ? (
                  <p className="text-sm text-charcoal-500">Not configured.</p>
                ) : (
                  analytics.traffic.deviceMix.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-charcoal-700">{item.label}</span>
                      <span className="font-semibold text-brown-800">{formatItem(item)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-cream-100 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">Geo breakdown</p>
              <div className="mt-3 space-y-2">
                {analytics.traffic.geoBreakdown.length === 0 ? (
                  <p className="text-sm text-charcoal-500">Not configured.</p>
                ) : (
                  analytics.traffic.geoBreakdown.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-charcoal-700">{item.label}</span>
                      <span className="font-semibold text-brown-800">{formatItem(item)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-cream-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">Search Console</p>
                <p className="mt-1 text-sm text-charcoal-600">{analytics.searchConsole.note}</p>
              </div>
              <span className="rounded-full bg-charcoal-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                {analytics.searchConsole.status}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Clicks', value: analytics.searchConsole.clicks ?? 0 },
                { label: 'Impressions', value: analytics.searchConsole.impressions ?? 0 },
                { label: 'CTR', value: analytics.searchConsole.ctrPct == null ? 0 : `${analytics.searchConsole.ctrPct}%` },
                { label: 'Position', value: analytics.searchConsole.averagePosition ?? 0 },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-cream-100 bg-[#fcf8f0] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">{item.label}</p>
                  <p className="mt-1 font-display text-2xl text-charcoal-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2.5rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50">
              <Palette className="h-4 w-4 text-brown-700" />
            </div>
            <h2 className="font-display text-2xl text-brown-800">Content inventory</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Blogs', value: analytics.content.blogCount },
              { label: 'Projects', value: analytics.content.projectCount },
              { label: 'Services', value: analytics.content.serviceCount },
              { label: 'Media', value: analytics.content.mediaCount },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-white/80 bg-white/50 backdrop-blur-sm p-5 text-center shadow-sm hover:bg-white/70 transition-all">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">{item.label}</p>
                <p className="mt-2 font-display text-3xl text-charcoal-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">Recent leads</p>
              <div className="mt-3 space-y-2">
                {analytics.content.recentLeads.length === 0 ? (
                  <p className="text-sm text-charcoal-500">No leads yet.</p>
                ) : (
                  analytics.content.recentLeads.map((item, idx) => (
                    <div key={`${item.label}-${item.detail}-${idx}`} className="rounded-2xl border border-cream-100 px-4 py-3 text-sm">
                      <p className="font-semibold text-charcoal-800">{item.label}</p>
                      <p className="text-charcoal-500">{item.value} · {item.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">Recent events</p>
              <div className="mt-3 space-y-2">
                {analytics.content.recentEvents.length === 0 ? (
                  <p className="text-sm text-charcoal-500">No events yet.</p>
                ) : (
                  analytics.content.recentEvents.map((item, idx) => (
                    <div key={`${item.label}-${item.detail}-${idx}`} className="rounded-2xl border border-cream-100 px-4 py-3 text-sm">
                      <p className="font-semibold text-charcoal-800">{item.label}</p>
                      <p className="text-charcoal-500">{item.value} · {item.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50">
              <LineChart className="h-4 w-4 text-brown-700" />
            </div>
            <h2 className="font-display text-2xl text-brown-800">Quick actions</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/admin/media" className="group rounded-[2rem] border border-white/60 bg-white/50 p-6 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50 group-hover:bg-charcoal-900 group-hover:text-white transition-colors duration-300">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brown-600">Media Library</p>
                  <h3 className="mt-1 font-display text-2xl text-charcoal-900 group-hover:text-brown-800 transition-colors">Review assets</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-charcoal-600">Search, edit, upload, and archive public or remote media records.</p>
            </Link>
            <Link href="/admin/pricing" className="group rounded-[2rem] border border-white/60 bg-white/50 p-6 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50 group-hover:bg-charcoal-900 group-hover:text-white transition-colors duration-300">
                  <LineChart className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brown-600">Pricing</p>
                  <h3 className="mt-1 font-display text-2xl text-charcoal-900 group-hover:text-brown-800 transition-colors">Manage Pricing</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-charcoal-600">Update starting prices and chatbot cost estimations.</p>
            </Link>
            <Link href="/admin/projects" className="group rounded-[2rem] border border-white/60 bg-white/50 p-6 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50 group-hover:bg-charcoal-900 group-hover:text-white transition-colors duration-300">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brown-600">Portfolio</p>
                  <h3 className="mt-1 font-display text-2xl text-charcoal-900 group-hover:text-brown-800 transition-colors">Manage projects</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-charcoal-600">Keep featured work and project details current.</p>
            </Link>
            <Link href="/admin/blogs" className="group rounded-[2rem] border border-white/60 bg-white/50 p-6 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50 group-hover:bg-charcoal-900 group-hover:text-white transition-colors duration-300">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brown-600">Editorial</p>
                  <h3 className="mt-1 font-display text-2xl text-charcoal-900 group-hover:text-brown-800 transition-colors">Edit blogs</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-charcoal-600">Draft, publish, and feature the latest SEO content.</p>
            </Link>
            <Link href="/admin/services" className="group rounded-[2rem] border border-white/60 bg-white/50 p-6 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:shadow-md sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50 group-hover:bg-charcoal-900 group-hover:text-white transition-colors duration-300">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brown-600">Services</p>
                  <h3 className="mt-1 font-display text-2xl text-charcoal-900 group-hover:text-brown-800 transition-colors">Adjust service pages</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-charcoal-600">Review the content powering the public service sections.</p>
            </Link>
          </div>

          <div className="mt-6 rounded-3xl border border-cream-100 bg-[#fcf8f0] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">Build status</p>
            <p className="mt-2 text-sm leading-7 text-charcoal-700">
              The admin console now has a protected login, a responsive shell, a media registry with uploads, and a merged analytics API. GA4/Search Console panels will light up automatically once the service-account env vars are configured.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brown-700">Last refresh</p>
            <h3 className="mt-2 font-display text-3xl text-charcoal-900">
              {mounted ? new Date(analytics.generatedAt).toLocaleString() : 'Loading...'}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-charcoal-600">The dashboard refreshes every 30 seconds while open.</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brown-900"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh now
          </button>
        </div>
      </section>
    </div>
  )
}
