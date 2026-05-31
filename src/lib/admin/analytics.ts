import { SignJWT, importPKCS8 } from 'jose'
import dbConnect from '@/lib/mongodb'
import Lead from '@/lib/models/Lead'
import ChatbotEvent from '@/lib/models/ChatbotEvent'
import BlogPost from '@/lib/models/BlogPost'
import Project from '@/lib/models/Project'
import Service from '@/lib/models/Service'
import MediaAsset from '@/lib/models/MediaAsset'
import { getChatbotMetrics } from '@/lib/chatbot/metrics'

export type InsightStatus = 'ready' | 'not_configured' | 'error'

export type InsightRow = {
  label: string
  value: number
  extra?: string
}

export type AnalyticsListItem = {
  label: string
  value: string
  detail?: string
}

export type AdminAnalytics = {
  generatedAt: string
  overview: {
    totalLeads: number
    chatbotStarts: number
    conversionRatePct: number
    publishedBlogs: number
    publishedProjects: number
    publishedServices: number
    mediaAssets: number
  }
  chatbot: Awaited<ReturnType<typeof getChatbotMetrics>>
  traffic: {
    status: InsightStatus
    note: string
    sessions: number | null
    users: number | null
    pageViews: number | null
    topPages: AnalyticsListItem[]
    deviceMix: AnalyticsListItem[]
    geoBreakdown: AnalyticsListItem[]
  }
  searchConsole: {
    status: InsightStatus
    note: string
    clicks: number | null
    impressions: number | null
    ctrPct: number | null
    averagePosition: number | null
    topQueries: AnalyticsListItem[]
    topPages: AnalyticsListItem[]
  }
  content: {
    blogCount: number
    projectCount: number
    serviceCount: number
    mediaCount: number
    recentLeads: AnalyticsListItem[]
    recentEvents: AnalyticsListItem[]
  }
}

const roundTwo = (value: number) => Math.round(value * 100) / 100

const normalizePrivateKey = (value: string) => value.replace(/\\n/g, '\n')

async function getGoogleAccessToken(serviceAccountEmail: string, privateKey: string, scopes: string[]) {
  const key = normalizePrivateKey(privateKey)
  const signer = await importPKCS8(key, 'RS256')

  const assertion = await new SignJWT({ scope: scopes.join(' ') })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer(serviceAccountEmail)
    .setSubject(serviceAccountEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setExpirationTime('1h')
    .sign(signer)

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to exchange Google access token (${response.status})`)
  }

  const body = (await response.json()) as { access_token?: string }
  if (!body.access_token) {
    throw new Error('Google access token missing in response.')
  }

  return body.access_token
}

async function runGa4Report(propertyId: string, accessToken: string, body: Record<string, unknown>) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`GA4 report failed (${response.status})`)
  }

  return response.json() as Promise<{
    rows?: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }>
    rowCount?: number
    totals?: Array<{ metricValues?: Array<{ value?: string }> }>
  }>
}

async function runGscReport(siteUrl: string, accessToken: string, body: Record<string, unknown>) {
  const response = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Search Console report failed (${response.status})`)
  }

  return response.json() as Promise<{
    rows?: Array<{ keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }>
  }>
}

function mapRows(rows: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }>, labelIndex = 0, valueIndex = 0, extraIndex?: number): AnalyticsListItem[] {
  return rows.map((row) => ({
    label: row.dimensionValues?.[labelIndex]?.value || 'Unknown',
    value: Number(row.metricValues?.[valueIndex]?.value || 0).toFixed(0),
    detail: extraIndex == null ? undefined : row.dimensionValues?.[extraIndex]?.value,
  }))
}

async function getTrafficInsights() {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim()
  const serviceAccountEmail = process.env.GA4_SERVICE_ACCOUNT_EMAIL?.trim()
  const privateKey = process.env.GA4_PRIVATE_KEY?.trim()

  if (!propertyId || !serviceAccountEmail || !privateKey) {
    return {
      status: 'not_configured' as const,
      note: 'GA4 credentials are not configured yet. Showing Mongo-backed metrics only.',
      sessions: null,
      users: null,
      pageViews: null,
      topPages: [] as AnalyticsListItem[],
      deviceMix: [] as AnalyticsListItem[],
      geoBreakdown: [] as AnalyticsListItem[],
    }
  }

  try {
    const accessToken = await getGoogleAccessToken(serviceAccountEmail, privateKey, ['https://www.googleapis.com/auth/analytics.readonly'])

    const overviewReport = await runGa4Report(propertyId, accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' }],
      limit: 1,
    })

    const topPagesReport = await runGa4Report(propertyId, accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePathPlusQueryString' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 6,
    })

    const deviceReport = await runGa4Report(propertyId, accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 6,
    })

    const geoReport = await runGa4Report(propertyId, accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'city' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 6,
    })

    const totals = overviewReport.totals?.[0]?.metricValues ?? []

    return {
      status: 'ready' as const,
      note: 'GA4 data loaded for the last 28 days.',
      sessions: Number(totals[0]?.value || 0),
      users: Number(totals[1]?.value || 0),
      pageViews: Number(totals[2]?.value || 0),
      topPages: (topPagesReport.rows || []).map((row) => ({
        label: row.dimensionValues?.[0]?.value || 'Unknown',
        value: Number(row.metricValues?.[1]?.value || row.metricValues?.[0]?.value || 0).toFixed(0),
        detail: `${Number(row.metricValues?.[0]?.value || 0).toFixed(0)} page views`,
      })),
      deviceMix: (deviceReport.rows || []).map((row) => ({
        label: row.dimensionValues?.[0]?.value || 'Unknown',
        value: Number(row.metricValues?.[0]?.value || 0).toFixed(0),
        detail: `${Number(row.metricValues?.[1]?.value || 0).toFixed(0)} users`,
      })),
      geoBreakdown: (geoReport.rows || []).map((row) => ({
        label: row.dimensionValues?.[0]?.value || 'Unknown',
        value: Number(row.metricValues?.[0]?.value || 0).toFixed(0),
        detail: `${Number(row.metricValues?.[1]?.value || 0).toFixed(0)} users`,
      })),
    }
  } catch (error) {
    return {
      status: 'error' as const,
      note: error instanceof Error ? error.message : 'Unable to load GA4 data.',
      sessions: null,
      users: null,
      pageViews: null,
      topPages: [] as AnalyticsListItem[],
      deviceMix: [] as AnalyticsListItem[],
      geoBreakdown: [] as AnalyticsListItem[],
    }
  }
}

async function getSearchConsoleInsights() {
  const siteUrl = process.env.GSC_SITE_URL?.trim()
  const serviceAccountEmail = process.env.GSC_SERVICE_ACCOUNT_EMAIL?.trim() || process.env.GA4_SERVICE_ACCOUNT_EMAIL?.trim()
  const privateKey = process.env.GSC_PRIVATE_KEY?.trim() || process.env.GA4_PRIVATE_KEY?.trim()

  if (!siteUrl || !serviceAccountEmail || !privateKey) {
    return {
      status: 'not_configured' as const,
      note: 'Search Console credentials are not configured yet. Showing Mongo-backed metrics only.',
      clicks: null,
      impressions: null,
      ctrPct: null,
      averagePosition: null,
      topQueries: [] as AnalyticsListItem[],
      topPages: [] as AnalyticsListItem[],
    }
  }

  try {
    const accessToken = await getGoogleAccessToken(serviceAccountEmail, privateKey, ['https://www.googleapis.com/auth/webmasters.readonly'])

    const overview = await runGscReport(siteUrl, accessToken, {
      startDate: '28daysAgo',
      endDate: 'today',
      rowLimit: 1,
    })

    const queries = await runGscReport(siteUrl, accessToken, {
      startDate: '28daysAgo',
      endDate: 'today',
      dimensions: ['query'],
      rowLimit: 6,
    })

    const pages = await runGscReport(siteUrl, accessToken, {
      startDate: '28daysAgo',
      endDate: 'today',
      dimensions: ['page'],
      rowLimit: 6,
    })

    const totals = overview.rows?.[0]

    return {
      status: 'ready' as const,
      note: 'Search Console data loaded for the last 28 days.',
      clicks: totals?.clicks ?? 0,
      impressions: totals?.impressions ?? 0,
      ctrPct: roundTwo((totals?.ctr ?? 0) * 100),
      averagePosition: roundTwo(totals?.position ?? 0),
      topQueries: (queries.rows || []).map((row) => ({
        label: row.keys?.[0] || 'Unknown',
        value: String(row.clicks ?? 0),
        detail: `${String(row.impressions ?? 0)} impressions`,
      })),
      topPages: (pages.rows || []).map((row) => ({
        label: row.keys?.[0] || 'Unknown',
        value: String(row.clicks ?? 0),
        detail: `${String(row.impressions ?? 0)} impressions`,
      })),
    }
  } catch (error) {
    return {
      status: 'error' as const,
      note: error instanceof Error ? error.message : 'Unable to load Search Console data.',
      clicks: null,
      impressions: null,
      ctrPct: null,
      averagePosition: null,
      topQueries: [] as AnalyticsListItem[],
      topPages: [] as AnalyticsListItem[],
    }
  }
}

export async function buildAdminAnalytics() {
  await dbConnect()
  const [chatbot, traffic, searchConsole, totalLeads, blogCount, projectCount, serviceCount, mediaCount, recentLeads, recentEvents] = await Promise.all([
    getChatbotMetrics(),
    getTrafficInsights(),
    getSearchConsoleInsights(),
    Lead.countDocuments({ source: 'chatbot' }),
    BlogPost.countDocuments({ publishStatus: 'published' }),
    Project.countDocuments(),
    Service.countDocuments(),
    MediaAsset.countDocuments(),
    Lead.find({}, { name: 1, city: 1, projectType: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(6).lean(),
    ChatbotEvent.find({}, { conversationId: 1, eventType: 1, stepId: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(6).lean(),
  ])

  return {
    generatedAt: new Date().toISOString(),
    overview: {
      totalLeads,
      chatbotStarts: chatbot.chatbotStarts,
      conversionRatePct: chatbot.conversionRatePct,
      publishedBlogs: blogCount,
      publishedProjects: projectCount,
      publishedServices: serviceCount,
      mediaAssets: mediaCount,
    },
    chatbot,
    traffic,
    searchConsole,
    content: {
      blogCount,
      projectCount,
      serviceCount,
      mediaCount,
      recentLeads: recentLeads.map((lead) => ({
        label: String(lead.name ?? 'Lead'),
        value: String(lead.projectType ?? 'inquiry'),
        detail: String(lead.city ?? 'Unknown city'),
      })),
      recentEvents: recentEvents.map((event) => ({
        label: String(event.eventType ?? 'event'),
        value: String(event.stepId ?? 'n/a'),
        detail: new Date(event.createdAt as string | Date).toLocaleString(),
      })),
    },
  }
}
