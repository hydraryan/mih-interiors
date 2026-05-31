import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/mongodb'
import TeamMember from '@/lib/models/TeamMember'

type TeamMemberRouteContext = {
  params: Promise<{ id: string }>
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected server error'
}

export async function PUT(req: NextRequest, { params }: TeamMemberRouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params
    const body = await req.json()
    const member = await TeamMember.findByIdAndUpdate(id, body, { new: true })
    
    if (!member) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 })
    }

    revalidatePath('/about')
    revalidatePath('/admin/team')
    return NextResponse.json({ success: true, member })
  } catch (err: unknown) {
    console.error('Admin API Error (PUT /api/admin/team/[id]):', err)
    return NextResponse.json({ success: false, error: getErrorMessage(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: TeamMemberRouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params
    const member = await TeamMember.findByIdAndDelete(id)
    
    if (!member) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 })
    }

    revalidatePath('/about')
    revalidatePath('/admin/team')
    return NextResponse.json({ success: true, message: 'Deleted successfully' })
  } catch (err: unknown) {
    console.error('Admin API Error (DELETE /api/admin/team/[id]):', err)
    return NextResponse.json({ success: false, error: getErrorMessage(err) }, { status: 500 })
  }
}
