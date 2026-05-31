/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Service from '@/lib/models/Service'
import { getActiveMediaMap } from '@/lib/media'

export async function GET() {
  try {
    await dbConnect()
    
    // Public API usually only shows published services
    const query: any = {};
    if (process.env.NODE_ENV === 'production' && !process.env.SHOW_DRAFTS) {
      query.publishStatus = 'published';
    }

    const [services, media] = await Promise.all([
      Service.find(query)
      .sort({ order: 1, createdAt: -1 })
      .select('title slug category shortDescription startingPrice hero order')
      .lean(),
      getActiveMediaMap(),
    ])

    const visibleServices = services.map((service) => ({
      ...service,
      hero: {
        ...service.hero,
        image: media.resolve(service.hero?.image),
      },
    }))
    
    return NextResponse.json({ success: true, services: visibleServices })
  } catch (err: any) {
    console.error('API Error (GET /api/services):', err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
