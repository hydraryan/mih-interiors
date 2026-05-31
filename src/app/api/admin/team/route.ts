import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import TeamMember from '@/lib/models/TeamMember'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const members = await TeamMember.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json({ success: true, members })
  } catch (err: any) {
    console.error('Admin API Error (GET /api/admin/team):', err)
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
    const member = await TeamMember.create(body)
    revalidatePath('/about')
    revalidatePath('/admin/team')
    return NextResponse.json({ success: true, member }, { status: 201 })
  } catch (err: any) {
    console.error('Admin API Error (POST /api/admin/team):', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
