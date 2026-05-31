import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Setting from '@/lib/models/Setting'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    await dbConnect()

    if (key) {
      const setting = await Setting.findOne({ key })
      return NextResponse.json({ success: true, setting })
    }

    const settings = await Setting.find({})
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: 'Key and value are required' }, { status: 400 })
    }

    await dbConnect()

    const setting = await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { new: true, upsert: true }
    )

    return NextResponse.json({ success: true, setting })
  } catch (error: any) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
