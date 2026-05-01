import { NextRequest, NextResponse } from 'next/server'
import Lead from '@/lib/models/Lead'
import dbConnect from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status, adminNotes } = await req.json()
    const { id } = await params

    await dbConnect()
    const lead = await Lead.findByIdAndUpdate(
      id,
      { 
        status, 
        adminNotes,
        updatedAt: new Date() 
      },
      { new: true }
    )

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
