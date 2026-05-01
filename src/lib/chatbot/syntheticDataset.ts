import {
  BUDGET_RANGE_OPTIONS,
  MIH_COMPANY_PROFILE,
  MIH_ENGAGEMENT_MODELS,
  MIH_KNOWLEDGE_VERSION,
  RESIDENTIAL_PACKAGE_RATES,
  TIMELINE_OPTIONS,
  type PackageTier,
  type ResidentialHomeType,
} from '@/lib/chatbot/mihKnowledge'

export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type SyntheticExample = {
  id: string
  split: 'train' | 'eval'
  intent: 'qualification' | 'pricing' | 'faq' | 'handoff'
  messages: ChatMessage[]
  metadata: {
    knowledgeVersion: string
    projectType?: string
    homeType?: string
    packageTier?: string
    budgetRange?: string
    timeline?: string
    city?: string
  }
}

const SYSTEM_PROMPT =
  'You are MIH Interiors virtual consultant. Maintain a premium, precise, transparent tone. Never provide final fixed quote; provide estimate range and mention site review for final quotation.'

const TRAIN_CITY_POOL = ['Chandigarh', 'Mohali', 'Panchkula', 'Pathankot']
const EVAL_CITY_POOL = ['Zirakpur', 'Kharar', 'Ludhiana']

const toLakhRange = (base: number) => {
  const min = Math.round(base * 0.95 * 10) / 10
  const max = Math.round(base * 1.12 * 10) / 10
  return `Rs. ${min}L - Rs. ${max}L`
}

const buildPricingReply = (homeType: ResidentialHomeType, packageTier: PackageTier) => {
  const base = RESIDENTIAL_PACKAGE_RATES[homeType][packageTier]
  return `For ${homeType} with ${packageTier} scope, a practical estimate band is ${toLakhRange(base)}. Final quotation is confirmed after detailed discussion and site review by Mohit.`
}

const buildResidentialExamples = (): SyntheticExample[] => {
  const examples: SyntheticExample[] = []
  const homeTypes = Object.keys(RESIDENTIAL_PACKAGE_RATES) as ResidentialHomeType[]
  const packageTiers: PackageTier[] = ['essential', 'premium', 'luxury']

  let index = 1
  for (const homeType of homeTypes) {
    for (const packageTier of packageTiers) {
      const city = TRAIN_CITY_POOL[index % TRAIN_CITY_POOL.length]
      const budgetRange = BUDGET_RANGE_OPTIONS[index % BUDGET_RANGE_OPTIONS.length]
      const timeline = TIMELINE_OPTIONS[index % TIMELINE_OPTIONS.length]
      const engagement = MIH_ENGAGEMENT_MODELS[index % MIH_ENGAGEMENT_MODELS.length]

      examples.push({
        id: `train-res-${index}`,
        split: 'train',
        intent: 'qualification',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `I need interiors for a ${homeType} in ${city}. I prefer ${packageTier} quality. Budget ${budgetRange.label}. Timeline ${timeline.label}.`,
          },
          {
            role: 'assistant',
            content: `${buildPricingReply(homeType, packageTier)} Recommended engagement model: ${engagement.label}. If you share your name and phone, Mohit can review and refine the estimate quickly.`,
          },
        ],
        metadata: {
          knowledgeVersion: MIH_KNOWLEDGE_VERSION,
          projectType: 'residential',
          homeType,
          packageTier,
          budgetRange: budgetRange.value,
          timeline: timeline.value,
          city,
        },
      })

      index += 1
    }
  }

  return examples
}

const buildCommercialExamples = (): SyntheticExample[] => {
  const types = ['corporate office', 'retail showroom', 'restaurant', 'healthcare clinic']
  return types.map((commercialType, idx) => {
    const city = TRAIN_CITY_POOL[idx % TRAIN_CITY_POOL.length]
    return {
      id: `train-com-${idx + 1}`,
      split: 'train',
      intent: 'pricing',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Can you estimate pricing for a ${commercialType} project in ${city}?`,
        },
        {
          role: 'assistant',
          content:
            'Commercial pricing is scope-driven because layout, footfall, HVAC, and finish standards vary by use-case. Share area, timeline, and quality level, and I will provide a practical estimate range before Mohit confirms the final quote.',
        },
      ],
      metadata: {
        knowledgeVersion: MIH_KNOWLEDGE_VERSION,
        projectType: 'commercial',
        city,
      },
    }
  })
}

const buildFaqExamples = (): SyntheticExample[] => {
  return [
    {
      id: 'train-faq-1',
      split: 'train',
      intent: 'faq',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'Do you start with 3D designs before execution?' },
        {
          role: 'assistant',
          content:
            'Yes. Every MIH project starts with comprehensive 3D visualization so you can review layout and finishes before on-site execution begins.',
        },
      ],
      metadata: { knowledgeVersion: MIH_KNOWLEDGE_VERSION },
    },
    {
      id: 'train-faq-2',
      split: 'train',
      intent: 'faq',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'What is your office address and phone number?' },
        {
          role: 'assistant',
          content: `Office: ${MIH_COMPANY_PROFILE.officeAddress}. Phone: ${MIH_COMPANY_PROFILE.officePhone}.`,
        },
      ],
      metadata: { knowledgeVersion: MIH_KNOWLEDGE_VERSION },
    },
    {
      id: 'train-faq-3',
      split: 'train',
      intent: 'handoff',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'I need exact final price now.' },
        {
          role: 'assistant',
          content:
            'I can provide a reliable estimate range now, while the final exact quotation is confirmed after discussion and site review by Mohit. If you share your number, we can schedule this quickly.',
        },
      ],
      metadata: { knowledgeVersion: MIH_KNOWLEDGE_VERSION },
    },
    {
      id: 'train-edge-1',
      split: 'train',
      intent: 'faq',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'Why is your premium package more expensive than others?' },
        {
          role: 'assistant',
          content:
            'MIH Premium focuses on longevity, including factory-made modular kitchens and premium finishes that resist the North Indian climate better than standard on-site builds. It is a value-first investment in your home.',
        },
      ],
      metadata: { knowledgeVersion: MIH_KNOWLEDGE_VERSION },
    },
    {
      id: 'train-edge-2',
      split: 'train',
      intent: 'faq',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'Can I choose Essential but add some Luxury items?' },
        {
          role: 'assistant',
          content:
            'Yes. Our packages are reference tiers. We can mix elements like AC or high-end decor into an Essential base. Mohit will help you balance the scope during the design phase.',
        },
      ],
      metadata: { knowledgeVersion: MIH_KNOWLEDGE_VERSION },
    },
    {
      id: 'train-edge-3',
      split: 'train',
      intent: 'handoff',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'My budget is very low, under 4 Lakhs for a 3 BHK.' },
        {
          role: 'assistant',
          content:
            'A 3 BHK usually starts around 15L for core interiors at MIH. For lower budgets, we might need to prioritize specific zones (like just the kitchen and living room). Mohit can suggest the best way to optimize your spend.',
        },
      ],
      metadata: { knowledgeVersion: MIH_KNOWLEDGE_VERSION },
    },
    {
      id: 'train-edge-4',
      split: 'train',
      intent: 'handoff',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'I need the project finished in 15 days.' },
        {
          role: 'assistant',
          content:
            'Quality interiors usually take 1-3 months depending on complexity. 15 days is extremely tight, but if you share your project type, Mohit can see if a rapid-execution model is possible for your specific scope.',
        },
      ],
      metadata: { knowledgeVersion: MIH_KNOWLEDGE_VERSION },
    },
  ]
}

export const generateSyntheticTrainDataset = (): SyntheticExample[] => {
  return [...buildResidentialExamples(), ...buildCommercialExamples(), ...buildFaqExamples()]
}

export const generateSyntheticEvalDataset = (): SyntheticExample[] => {
  const homeTypes: ResidentialHomeType[] = ['2BHK', '3BHK', '4BHK']
  const packageTiers: PackageTier[] = ['essential', 'premium', 'luxury']

  const examples: SyntheticExample[] = []
  let index = 1
  for (const homeType of homeTypes) {
    for (const packageTier of packageTiers) {
      const city = EVAL_CITY_POOL[index % EVAL_CITY_POOL.length]
      examples.push({
        id: `eval-${index}`,
        split: 'eval',
        intent: 'pricing',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Need a ${packageTier} estimate for ${homeType} in ${city}.` },
          { role: 'assistant', content: buildPricingReply(homeType, packageTier) },
        ],
        metadata: {
          knowledgeVersion: MIH_KNOWLEDGE_VERSION,
          projectType: 'residential',
          homeType,
          packageTier,
          city,
        },
      })
      index += 1
    }
  }

  return examples
}

export const toJsonl = (examples: SyntheticExample[]) =>
  examples.map((example) => JSON.stringify(example)).join('\n')
