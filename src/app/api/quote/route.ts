import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Lead from '@/lib/models/Lead'
import ChatbotEvent from '@/lib/models/ChatbotEvent'
import { sendLeadNotification } from '@/lib/email'

type QuoteRequestBody = {
  answers?: Record<string, string>
  completed?: boolean
  conversationId?: string
  personalizationConsent?: 'pending' | 'accepted' | 'declined'
  consentAccepted?: boolean
  deviceProfile?: Record<string, unknown> | null
  pricingDecision?: Record<string, unknown> | null
  confidenceScore?: number
  fallbackReason?: string
  personalizationApplied?: boolean
  personalizationFactors?: string[]
  serviceSlug?: string | null
  sourcePage?: string
}

export async function POST(req: NextRequest) {
  try {
    const uri = process.env.MONGODB_URI || 'not-set'
    console.log('API Request Received. DB URI:', uri.replace(/:([^@]+)@/, ':****@'))
    
    await dbConnect()
    const body = (await req.json()) as QuoteRequestBody
    console.log('Chatbot Lead Data:', JSON.stringify(body, null, 2))
    
    const { answers, completed } = body
    const safeAnswers = answers ?? {}
    
    if (completed) {
      // Save lead
      const lead = await Lead.create({
        name: safeAnswers.contact_name,
        phone: safeAnswers.contact_phone,
        city: safeAnswers.city,
        projectType: safeAnswers.greeting,
        scope: safeAnswers.scope,
        bhkType: safeAnswers.residential_type || safeAnswers.commercial_type,
        areaSqft: parseFloat(safeAnswers.area_sqft || '0'),
        packageTier: safeAnswers.package_interest,
        budget: safeAnswers.budget_range,
        fullAnswers: safeAnswers,
        source: 'chatbot',
        conversationId: body.conversationId,
        personalizationConsent: body.personalizationConsent ?? 'pending',
        consentAccepted: body.consentAccepted ?? false,
        deviceProfile: body.deviceProfile ?? null,
        pricingDecision: body.pricingDecision ?? null,
        confidenceScore: body.confidenceScore ?? 1.0,
        fallbackReason: body.fallbackReason,
        personalizationApplied: body.personalizationApplied ?? false,
        personalizationFactors: body.personalizationFactors ?? [],
        serviceSlug: body.serviceSlug,
        sourcePage: body.sourcePage,
      })

      // Send email notification (async)
      await sendLeadNotification(lead)

      if (body.conversationId) {
        await ChatbotEvent.create({
          conversationId: body.conversationId,
          eventType: 'lead_submitted',
          stepId: 'end',
          personalizationConsent: body.personalizationConsent ?? 'pending',
          payload: {
            leadId: String(lead._id),
            projectType: safeAnswers.greeting,
            packageTier: safeAnswers.package_interest,
          },
          source: 'chatbot',
          pagePath: '/'
        })
      }
      
      // WhatsApp and Email notifications would be triggered here
      // Example mocked external call
      console.log(`Lead Created: ${lead._id} for ${safeAnswers.contact_name}`)
      
      return NextResponse.json({ success: true, leadId: lead._id })
    }
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
