import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { buildAdminAnalytics } from '@/lib/admin/analytics'

async function ensureAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function GET(request: NextRequest) {
  const unauthorized = await ensureAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const analytics = await buildAdminAnalytics()
    return NextResponse.json({ success: true, analytics })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load admin analytics.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
