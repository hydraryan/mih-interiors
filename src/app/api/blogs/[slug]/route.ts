import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/lib/models/BlogPost'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const resolvedParams = await params
    const post = await BlogPost.findOne({ slug: resolvedParams.slug })
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const resolvedParams = await params
    const body = await request.json()
    
    // If this post is being set to featured, unfeature all others
    if (body.featured === true) {
      await BlogPost.updateMany(
        { slug: { $ne: resolvedParams.slug } }, 
        { featured: false }
      )
    }
    
    const post = await BlogPost.findOneAndUpdate(
      { slug: resolvedParams.slug },
      body,
      { new: true }
    )
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const resolvedParams = await params
    const post = await BlogPost.findOneAndDelete({ slug: resolvedParams.slug })
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Blog post deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
