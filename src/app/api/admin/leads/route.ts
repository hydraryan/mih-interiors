import { NextResponse } from 'next/server'
import Lead from '@/lib/models/Lead'
import dbConnect from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const leads = await Lead.find({}).sort({ createdAt: -1 })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
