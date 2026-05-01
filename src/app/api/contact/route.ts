import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Lead from '@/lib/models/Lead'

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
    
    // In a real app, you'd send an email here too
    // await sendLeadNotification(lead)
    
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
