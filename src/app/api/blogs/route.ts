import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/lib/models/BlogPost'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    
    let query = { publishStatus: 'published' } as any
    if (featured === 'true') query.featured = true
    
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit ? parseInt(limit) : 50)
      
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
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
