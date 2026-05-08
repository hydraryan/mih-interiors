import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import TeamMember from '@/lib/models/TeamMember'

export async function GET() {
  try {
    await dbConnect()

    // Clear existing
    await TeamMember.deleteMany({})

    const initialMembers = [
      {
        name: 'Ar. Mohit Mahajan',
        designation: 'Founder & Principal Architect',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800',
        order: 1,
      },
      {
        name: 'Riya Sharma',
        designation: 'Senior Interior Designer',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
        order: 2,
      },
      {
        name: 'Vikram Singh',
        designation: 'Project Manager',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800',
        order: 3,
      }
    ]

    await TeamMember.insertMany(initialMembers)

    return NextResponse.json({ 
      success: true, 
      message: 'Team members seeded successfully',
      members: initialMembers 
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
