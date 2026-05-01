import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ChatbotEvent from '@/lib/models/ChatbotEvent'
import { buildFaqResponse } from '@/lib/chatbot/faqRetriever'

type RespondRequestBody = {
  conversationId?: string
  message?: string
  currentStepId?: string
  personalizationConsent?: 'pending' | 'accepted' | 'declined'
  pagePath?: string
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = (await req.json()) as RespondRequestBody
    const conversationId = body.conversationId?.trim()
    const message = body.message?.trim()

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'conversationId is required.' }, { status: 400 })
    }

    if (!message) {
      return NextResponse.json({ success: false, error: 'message is required.' }, { status: 400 })
    }

    const questionPreview = message.slice(0, 120)

    await ChatbotEvent.create({
      conversationId,
      eventType: 'faq_question',
      stepId: body.currentStepId,
      source: 'chatbot',
      personalizationConsent: body.personalizationConsent ?? 'pending',
      payload: {
        questionPreview,
        questionLength: message.length,
      },
      pagePath: body.pagePath ?? req.nextUrl.pathname,
      userAgent: req.headers.get('user-agent') ?? undefined,
    })

    const faq = buildFaqResponse(message)

    await ChatbotEvent.create({
      conversationId,
      eventType: 'faq_answered',
      stepId: body.currentStepId,
      source: 'chatbot',
      personalizationConsent: body.personalizationConsent ?? 'pending',
      payload: {
        mode: faq.mode,
        confidence: faq.confidence,
        citations: faq.citations,
      },
      pagePath: body.pagePath ?? req.nextUrl.pathname,
      userAgent: req.headers.get('user-agent') ?? undefined,
    })

    return NextResponse.json({
      success: true,
      answer: faq.answer,
      confidence: faq.confidence,
      citations: faq.citations,
      mode: faq.mode,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process chatbot response.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
