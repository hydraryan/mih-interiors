import Lead from '@/lib/models/Lead'
import ChatbotEvent from '@/lib/models/ChatbotEvent'

export type DropOffMetric = {
  stepId: string
  count: number
}

export type RecentActivity = {
  conversationId: string
  eventType: string
  stepId: string | null
  createdAt: string
}

export type ChatbotMetrics = {
  totalLeads: number
  chatbotStarts: number
  submittedConversations: number
  conversionRatePct: number
  faqQuestions: number
  faqAnswered: number
  faqResponseRatePct: number
  personalizationAccepted: number
  personalizationDeclined: number
  consentOptInRatePct: number
  topDropOffSteps: DropOffMetric[]
  recentActivity: RecentActivity[]
  generatedAt: string
}

const roundTwo = (value: number) => Math.round(value * 100) / 100

export async function getChatbotMetrics(): Promise<ChatbotMetrics> {
  const [
    totalLeads,
    startedConversations,
    submittedConversations,
    faqQuestions,
    faqAnswered,
    acceptedConversations,
    declinedConversations,
    topDropOffStepsRaw,
    recentActivityRaw,
  ] = await Promise.all([
    Lead.countDocuments({ source: 'chatbot' }),
    ChatbotEvent.distinct('conversationId', { eventType: 'chat_open' }),
    ChatbotEvent.distinct('conversationId', { eventType: 'lead_submitted' }),
    ChatbotEvent.countDocuments({ eventType: 'faq_question' }),
    ChatbotEvent.countDocuments({ eventType: 'faq_answered' }),
    ChatbotEvent.distinct('conversationId', { eventType: 'consent_accepted' }),
    ChatbotEvent.distinct('conversationId', { eventType: 'consent_declined' }),
    ChatbotEvent.aggregate([
      { $match: { eventType: { $in: ['answer_submitted', 'lead_submitted'] } } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: '$conversationId',
          hadLeadSubmission: {
            $max: {
              $cond: [{ $eq: ['$eventType', 'lead_submitted'] }, 1, 0],
            },
          },
          lastStep: { $last: '$stepId' },
        },
      },
      { $match: { hadLeadSubmission: 0, lastStep: { $ne: null } } },
      {
        $group: {
          _id: '$lastStep',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    ChatbotEvent.find({}, { conversationId: 1, eventType: 1, stepId: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
  ])

  const startsCount = startedConversations.length
  const submittedCount = submittedConversations.length
  const acceptedCount = acceptedConversations.length
  const declinedCount = declinedConversations.length
  const consentTotal = acceptedCount + declinedCount
  const faqResponseRatePct = faqQuestions ? roundTwo((faqAnswered / faqQuestions) * 100) : 0

  return {
    totalLeads,
    chatbotStarts: startsCount,
    submittedConversations: submittedCount,
    conversionRatePct: startsCount ? roundTwo((submittedCount / startsCount) * 100) : 0,
    faqQuestions,
    faqAnswered,
    faqResponseRatePct,
    personalizationAccepted: acceptedCount,
    personalizationDeclined: declinedCount,
    consentOptInRatePct: consentTotal ? roundTwo((acceptedCount / consentTotal) * 100) : 0,
    topDropOffSteps: topDropOffStepsRaw.map((step) => ({
      stepId: String(step._id),
      count: Number(step.count),
    })),
    recentActivity: recentActivityRaw.map((event) => ({
      conversationId: String(event.conversationId ?? ''),
      eventType: String(event.eventType ?? ''),
      stepId: event.stepId ? String(event.stepId) : null,
      createdAt: new Date(event.createdAt as string | Date).toISOString(),
    })),
    generatedAt: new Date().toISOString(),
  }
}
