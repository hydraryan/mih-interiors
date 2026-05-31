import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/lib/models/BlogPost'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    
    const query: any = {};
    if (process.env.NODE_ENV === 'production' && !process.env.SHOW_DRAFTS) {
      // Be lenient: include items without a status or not explicitly draft
      query.$or = [
        { publishStatus: { $ne: 'draft' } },
        { status: { $ne: 'draft' } },
        { publishStatus: { $exists: false }, status: { $exists: false } }
      ];
    }
    if (featured === 'true') query.featured = true
    
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit ? parseInt(limit) : 50)
      
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs', details: process.env.NODE_ENV === 'production' ? undefined : 'See server logs for details' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    
    // If this post is marked as featured, unfeature all others
    if (body.featured === true) {
      await BlogPost.updateMany({ featured: true }, { featured: false })
    }
    
    const post = await BlogPost.create(body)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
