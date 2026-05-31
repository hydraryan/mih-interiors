import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Lead from '@/lib/models/Lead'
import { sendNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = await req.json()
    
    const { name, email, phone, city, message, projectType } = body
    
    // Basic validation
    if (!name || !phone || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields (name, phone, message)' 
      }, { status: 400 })
    }
    
    // Create lead from contact form
    const lead = await Lead.create({
      name,
      email,
      phone,
      city: city || 'Not specified',
      additionalNotes: message,
      projectType: projectType || 'Unspecified',
      source: 'contact_form',
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    // Send email notification (async)
    await sendNotification('contact_form', {
      name,
      email,
      phone,
      city: city || 'Not specified',
      message,
      projectType: projectType || 'General Inquiry',
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      leadId: lead._id 
    })
  } catch (err: any) {
    console.error('Contact Form Error:', err)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process message' 
    }, { status: 500 })
  }
}
