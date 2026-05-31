import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const services = await Service.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json({ success: true, services })
  } catch (err: any) {
    console.error('Admin API Error (GET /api/admin/services):', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await req.json()
    
    // Basic slug uniqueness check
    const existing = await Service.findOne({ slug: body.slug })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 })
    }

    const service = await Service.create(body)
    revalidatePath('/', 'layout')
    revalidatePath('/services')
    revalidatePath('/admin/services')
    revalidatePath('/admin/pricing')
    return NextResponse.json({ success: true, service }, { status: 201 })
  } catch (err: any) {
    console.error('Admin API Error (POST /api/admin/services):', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
