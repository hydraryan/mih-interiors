import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params
    const { status } = await req.json()

    if (!['draft', 'published'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
    }

    const service = await Service.findByIdAndUpdate(id, { publishStatus: status }, { new: true })
    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, service })
  } catch (err: any) {
    console.error('Admin API Error (PATCH /api/admin/services/[id]/status):', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
