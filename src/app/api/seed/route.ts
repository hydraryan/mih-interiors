import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/lib/models/Blog'

const SEED_BLOGS = [
  {
    title: 'Complete Guide to Home Interior Design in Chandigarh 2025',
    slug: 'complete-guide-home-interior-design-chandigarh-2025',
    excerpt: 'Everything you need to know about designing your dream home in Chandigarh. From budgeting to execution.',
    content: '<p>Chandigarh represents a unique blend of modern architecture and natural beauty...</p><h2>Understanding Space in Chandigarh Homes</h2><p>With regulations guiding aesthetics, maximizing interior space functionality is key.</p>',
    targetCity: 'chandigarh',
    category: 'city-guide',
    focusKeyword: 'interior design chandigarh',
    status: 'published',
  },
  {
    title: '3 BHK Interior Design Ideas & Cost in Chandigarh',
    slug: '3-bhk-interior-design-ideas-cost-chandigarh',
    excerpt: 'Explore stunning ideas for your 3 BHK apartment along with accurate cost estimates for essential, premium, and luxury finishes.',
    content: '<p>A 3 BHK offers ample room for creativity...</p><h2>Cost Breakdown</h2><p>Expect anywhere from ₹15L for essential to ₹22L+ for luxury.</p>',
    targetCity: 'chandigarh',
    category: 'residential',
    focusKeyword: '3 bhk interior design chandigarh',
    status: 'published',
  }
]

export async function GET() {
  try {
    await dbConnect()

    // Clear existing for demo purposes or check if empty
    const count = await Blog.countDocuments()
    if (count === 0) {
      await Blog.insertMany(SEED_BLOGS.map(b => ({ ...b, publishedAt: new Date() })))
      return NextResponse.json({ success: true, message: 'Seeded 2 initial blogs' })
    }
    
    return NextResponse.json({ success: true, message: 'Blogs already seeded' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
