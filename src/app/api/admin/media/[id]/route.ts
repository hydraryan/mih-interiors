import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import MediaAsset from '@/lib/models/MediaAsset'

async function ensureAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await ensureAdmin(request)
  if (unauthorized) return unauthorized

  try {
    await dbConnect()
    const { id } = await params
    const body = await request.json()
    const asset = await MediaAsset.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true })

    if (!asset) {
      return NextResponse.json({ success: false, error: 'Media asset not found' }, { status: 404 })
    }

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, asset })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update media asset.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await ensureAdmin(request)
  if (unauthorized) return unauthorized

  try {
    await dbConnect()
    const { id } = await params
    const asset = await MediaAsset.findByIdAndDelete(id)

    if (!asset) {
      return NextResponse.json({ success: false, error: 'Media asset not found' }, { status: 404 })
    }

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete media asset.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
