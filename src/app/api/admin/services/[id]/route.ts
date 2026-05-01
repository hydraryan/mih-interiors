import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params
    const body = await req.json()

    const service = await Service.findByIdAndUpdate(id, body, { new: true })
    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, service })
  } catch (err: any) {
    console.error('Admin API Error (PUT /api/admin/services/[id]):', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params
    await Service.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Service deleted' })
  } catch (err: any) {
    console.error('Admin API Error (DELETE /api/admin/services/[id]):', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
