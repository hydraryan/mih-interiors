import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Lead from '@/lib/models/Lead'
import { sendNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, city, projectType, areaSqft } = body

    if (!name || !phone || !city) {
      return NextResponse.json({ success: false, error: 'Name, phone, and city are required' }, { status: 400 })
    }

    await dbConnect()

    const newLead = await Lead.create({
      name,
      phone,
      city,
      projectType,
      areaSqft,
      source: '3d-rendering',
      status: 'new'
    })

    // Send email notification (async)
    await sendNotification('3d_rendering', {
      name,
      phone,
      city,
      projectType: projectType || 'Not specified',
      areaSqft: areaSqft ? `${areaSqft} sq. ft.` : 'Not specified',
    })

    return NextResponse.json({ success: true, lead: newLead })
  } catch (error: any) {
    console.error('Error submitting 3D lead:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
