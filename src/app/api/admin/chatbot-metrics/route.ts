import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { getChatbotMetrics } from '@/lib/chatbot/metrics'

export async function GET() {
  try {
    await dbConnect()
    const metrics = await getChatbotMetrics()
    return NextResponse.json({ success: true, metrics })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch chatbot metrics.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
