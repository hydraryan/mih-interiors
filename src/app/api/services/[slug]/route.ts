import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    
    const { slug } = await params
    const service = await Service.findOne({ 
      slug, 
      publishStatus: 'published' 
    })
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, service })
  } catch (err: any) {
    console.error('API Error (GET /api/services/[slug]):', err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service detail' },
      { status: 500 }
    )
  }
}
