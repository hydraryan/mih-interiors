import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ChatbotEvent from '@/lib/models/ChatbotEvent'

type ChatbotEventBody = {
  conversationId?: string
  eventType?: string
  stepId?: string
  source?: string
  personalizationConsent?: 'pending' | 'accepted' | 'declined'
  payload?: Record<string, unknown>
  pagePath?: string
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = (await req.json()) as ChatbotEventBody

    if (!body.conversationId || !body.eventType) {
      return NextResponse.json(
        { success: false, error: 'conversationId and eventType are required.' },
        { status: 400 },
      )
    }

    const userAgent = req.headers.get('user-agent') ?? undefined

    await ChatbotEvent.create({
      conversationId: body.conversationId,
      eventType: body.eventType,
      stepId: body.stepId,
      source: body.source ?? 'chatbot',
      personalizationConsent: body.personalizationConsent ?? 'pending',
      payload: body.payload ?? {},
      pagePath: body.pagePath,
      userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save chatbot event.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
