import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/mongodb'
import MediaAsset from '@/lib/models/MediaAsset'
import { syncWebsiteMediaAssets } from '@/lib/media'

async function ensureAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

function buildQuery(params: URLSearchParams) {
  const query: Record<string, unknown> = {}
  const search = params.get('search')?.trim()
  const category = params.get('category')?.trim()
  const sourceType = params.get('sourceType')?.trim()
  const status = params.get('status')?.trim()
  const placement = params.get('placement')?.trim()

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { altText: { $regex: search, $options: 'i' } },
      { caption: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
      { folder: { $regex: search, $options: 'i' } },
    ]
  }

  if (category && category !== 'all') {
    query.folder = category
  }

  if (sourceType && sourceType !== 'all') {
    query.sourceType = sourceType
  }

  if (status && status !== 'all') {
    query.status = status
  }

  if (placement && placement !== 'all') {
    const synonyms: Record<string, string[]> = {
      Homepage: ['Homepage', 'home', 'hero'],
      Projects: ['Projects', 'projects'],
      Services: ['Services', 'services'],
      Gallery: ['Gallery', 'gallery'],
      'About page': ['About page', 'about'],
    }
    const searchValues = synonyms[placement] || [placement]
    query.placements = { $in: searchValues }
  }

  return query
}

export async function GET(request: NextRequest) {
  const unauthorized = await ensureAdmin(request)
  if (unauthorized) return unauthorized

  try {
    await dbConnect()
    await syncWebsiteMediaAssets()

    const query = buildQuery(request.nextUrl.searchParams)
    const assets = await MediaAsset.find(query).sort({ updatedAt: -1, title: 1 }).lean()

    const summary = assets.reduce(
      (acc, asset) => {
        const sourceType = String(asset.sourceType ?? 'public')
        const folder = String(asset.folder ?? 'root')
        acc.total += 1
        acc.bySource[sourceType] = (acc.bySource[sourceType] ?? 0) + 1
        acc.byFolder[folder] = (acc.byFolder[folder] ?? 0) + 1
        return acc
      },
      {
        total: 0,
        bySource: {} as Record<string, number>,
        byFolder: {} as Record<string, number>,
      },
    )

    return NextResponse.json({ success: true, assets, summary })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load media assets.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureAdmin(request)
  if (unauthorized) return unauthorized

  try {
    await dbConnect()
    const body = await request.json()

    const asset = body._id
      ? await MediaAsset.findByIdAndUpdate(body._id, body, { new: true, runValidators: true })
      : await MediaAsset.findOneAndUpdate(
          { sourceKey: body.sourceKey },
          body,
          { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
        )

    return NextResponse.json({ success: true, asset })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save media asset.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
