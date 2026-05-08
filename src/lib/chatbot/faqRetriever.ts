import {
  CONSTRUCTION_RATE_CARD,
  FINAL_QUOTE_DISCLAIMER,
  MIH_COMPANY_PROFILE,
  MIH_ENGAGEMENT_MODELS,
  MIH_SERVICE_DOMAINS,
  RESIDENTIAL_PACKAGE_INCLUSIONS,
  RESIDENTIAL_PACKAGE_RATES,
  type PackageTier,
  type ResidentialHomeType,
} from '@/lib/chatbot/mihKnowledge'
import type { ChatbotPrices } from '@/lib/chatbot/chatbotPrices'

type KnowledgeDoc = {
  id: string
  title: string
  content: string
  tags: string[]
}

export type FaqResponse = {
  answer: string
  confidence: number
  citations: string[]
  mode: 'direct' | 'retrieval' | 'fallback'
}

const STOP_WORDS = new Set([
  'the',
  'is',
  'a',
  'an',
  'and',
  'or',
  'to',
  'of',
  'in',
  'for',
  'on',
  'with',
  'about',
  'can',
  'you',
  'your',
  'i',
  'my',
  'we',
  'our',
  'me',
  'do',
  'does',
  'what',
  'which',
  'how',
  'are',
  'at',
  'from',
  'by',
])

const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'company-profile',
    title: 'Company Profile',
    content: `${MIH_COMPANY_PROFILE.businessName} was established ${MIH_COMPANY_PROFILE.established}, operates in ${MIH_COMPANY_PROFILE.operatingRegions.join(', ')}, and follows this philosophy: ${MIH_COMPANY_PROFILE.philosophy}`,
    tags: ['about', 'company', 'profile', 'rating', 'experience', 'years'],
  },
  {
    id: 'office-contact',
    title: 'Office and Contact',
    content: `Office: ${MIH_COMPANY_PROFILE.officeAddress}. Phone: ${MIH_COMPANY_PROFILE.officePhone}.`,
    tags: ['address', 'office', 'contact', 'phone', 'location', 'chandigarh'],
  },
  {
    id: 'residential-services',
    title: 'Residential Services',
    content: MIH_SERVICE_DOMAINS.residential.join(' '),
    tags: ['residential', 'home', 'bhk', 'kothi', 'villa', 'interiors'],
  },
  {
    id: 'commercial-services',
    title: 'Commercial Services',
    content: MIH_SERVICE_DOMAINS.commercial.join(' '),
    tags: ['commercial', 'office', 'retail', 'hospitality', 'healthcare', 'industrial'],
  },
  {
    id: 'delivery-process',
    title: 'Design and Execution Process',
    content: MIH_SERVICE_DOMAINS.process.join(' '),
    tags: ['process', '3d', 'render', 'execution', 'supervision'],
  },
  {
    id: 'engagement-models',
    title: 'Engagement Models',
    content: `MIH offers ${MIH_ENGAGEMENT_MODELS.map((m) => m.label).join(', ')}.`,
    tags: ['engagement', 'model', 'materials', 'percentage', 'execution'],
  },
  {
    id: 'construction-rate-card',
    title: 'Construction Rate Card',
    content: `Construction only without interiors: Rs. ${CONSTRUCTION_RATE_CARD.constructionOnly.minPerSqFt} - Rs. ${CONSTRUCTION_RATE_CARD.constructionOnly.maxPerSqFt} per sq. ft. Construction plus full interiors starts from Rs. ${CONSTRUCTION_RATE_CARD.constructionWithInteriors.minPerSqFt} per sq. ft.`,
    tags: ['construction', 'rate', 'sqft', 'cost', 'price'],
  },
]

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const normalizeText = (value: string) => value.toLowerCase().replace(/[^a-z0-9+\s]/g, ' ').replace(/\s+/g, ' ').trim()

const tokenize = (value: string) =>
  normalizeText(value)
    .split(' ')
    .filter((token) => token && !STOP_WORDS.has(token))

const detectHomeType = (query: string): ResidentialHomeType | null => {
  const normalized = normalizeText(query)
  if (normalized.includes('1 bhk') || normalized.includes('1bhk')) return '1BHK'
  if (normalized.includes('2 bhk') || normalized.includes('2bhk')) return '2BHK'
  if (normalized.includes('3 bhk') || normalized.includes('3bhk')) return '3BHK'
  if (normalized.includes('4 bhk') || normalized.includes('4bhk')) return '4BHK'
  if (normalized.includes('kothi') || normalized.includes('villa')) return 'Kothi'
  return null
}

const detectPackageTier = (query: string): PackageTier | null => {
  const normalized = normalizeText(query)
  if (normalized.includes('essential')) return 'essential'
  if (normalized.includes('premium')) return 'premium'
  if (normalized.includes('luxury')) return 'luxury'
  return null
}

const includesAny = (query: string, keywords: string[]) => keywords.some((keyword) => query.includes(keyword))

const buildPackagePriceAnswer = (homeType: ResidentialHomeType, tier: PackageTier, prices?: ChatbotPrices): FaqResponse => {
  const base = prices ? prices.residential[homeType][tier] : RESIDENTIAL_PACKAGE_RATES[homeType][tier]
  const minRange = Math.round(base * 0.95 * 10) / 10
  const maxRange = Math.round(base * 1.12 * 10) / 10

  return {
    answer: `For ${homeType} with the ${tier} package, MIH's reference budget is around Rs. ${base}L. A practical estimate band is approximately Rs. ${minRange}L - Rs. ${maxRange}L depending on layout complexity and finish selection. ${FINAL_QUOTE_DISCLAIMER}`,
    confidence: 0.93,
    citations: ['residential-package-rate-card'],
    mode: 'direct',
  }
}

const buildTierInclusionAnswer = (tier: PackageTier): FaqResponse => {
  const inclusions = RESIDENTIAL_PACKAGE_INCLUSIONS[tier]
  const preview = inclusions.slice(0, 8).join(', ')
  const extraCount = Math.max(0, inclusions.length - 8)
  const suffix = extraCount > 0 ? `, plus ${extraCount} more premium add-ons.` : '.'

  return {
    answer: `The ${tier} package typically includes ${preview}${suffix} If you share your home type, I can map this package to an estimate range immediately.`,
    confidence: 0.9,
    citations: ['residential-inclusions-matrix'],
    mode: 'direct',
  }
}

const buildConstructionAnswer = (prices?: ChatbotPrices): FaqResponse => {
  const minSqFt = prices?.constructionOnly.min ?? CONSTRUCTION_RATE_CARD.constructionOnly.minPerSqFt
  const maxSqFt = prices?.constructionOnly.max ?? CONSTRUCTION_RATE_CARD.constructionOnly.maxPerSqFt
  const withInteriors = prices?.construction.standard ?? CONSTRUCTION_RATE_CARD.constructionWithInteriors.minPerSqFt
  return {
    answer: `MIH's current reference rates are Rs. ${minSqFt} - Rs. ${maxSqFt} per sq. ft for construction-only scope, and Rs. ${withInteriors}+ per sq. ft for construction plus interiors. Final costing is refined after design and scope confirmation.`,
    confidence: 0.9,
    citations: ['construction-rate-card'],
    mode: 'direct',
  }
}

const buildContactAnswer = (): FaqResponse => {
  return {
    answer: `You can connect with MIH Interiors at ${MIH_COMPANY_PROFILE.officePhone}. Office address: ${MIH_COMPANY_PROFILE.officeAddress}.`,
    confidence: 0.95,
    citations: ['office-contact'],
    mode: 'direct',
  }
}

const buildCommercialPricingAnswer = (): FaqResponse => {
  return {
    answer:
      'Commercial pricing is scope-driven because layout, footfall, HVAC, safety, and finish requirements vary widely by project type. Share your city, commercial category, and target timeline, and I can prepare a practical estimate band before Mohit finalizes the quote.',
    confidence: 0.82,
    citations: ['commercial-services', 'delivery-process'],
    mode: 'direct',
  }
}

const scoreDoc = (doc: KnowledgeDoc, queryTokens: string[], normalizedQuery: string) => {
  if (!queryTokens.length) return 0

  const docTokens = tokenize(`${doc.title} ${doc.content} ${doc.tags.join(' ')}`)
  const tokenSet = new Set(docTokens)
  let overlap = 0
  for (const token of queryTokens) {
    if (tokenSet.has(token)) overlap += 1
  }

  let phraseBoost = 0
  for (const tag of doc.tags) {
    if (normalizedQuery.includes(tag)) phraseBoost += 1
  }

  return overlap * 1.2 + phraseBoost * 0.8
}

const retrieveDocuments = (query: string, maxDocs: number) => {
  const normalizedQuery = normalizeText(query)
  const queryTokens = tokenize(query)

  return KNOWLEDGE_DOCS
    .map((doc) => ({
      doc,
      score: scoreDoc(doc, queryTokens, normalizedQuery),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxDocs)
}

const buildRetrievalAnswer = (query: string): FaqResponse => {
  const matches = retrieveDocuments(query, 3)
  if (!matches.length) {
    return {
      answer:
        'I can help with MIH services, package selection, construction rates, and engagement models. Share your project type and city, and I will guide you step by step.',
      confidence: 0.38,
      citations: [],
      mode: 'fallback',
    }
  }

  const highlights = matches.map((item) => item.doc.content).join(' ')
  const compact = highlights.slice(0, 420)
  const finalSentence =
    compact.length < highlights.length
      ? `${compact.trim()}...`
      : compact

  const confidence = clamp(0.5 + matches[0].score / 12, 0.52, 0.88)

  return {
    answer: `${finalSentence} If you want, I can now convert this into a tailored estimate range for your project scope.`,
    confidence: Math.round(confidence * 100) / 100,
    citations: matches.map((item) => item.doc.id),
    mode: 'retrieval',
  }
}

export const buildFaqResponse = (query: string, prices?: ChatbotPrices): FaqResponse => {
  const normalized = normalizeText(query)

  if (!normalized) {
    return {
      answer: 'Please type your question and I will guide you with MIH-specific details.',
      confidence: 0.2,
      citations: [],
      mode: 'fallback',
    }
  }

  if (includesAny(normalized, ['phone', 'call', 'contact', 'address', 'office'])) {
    return buildContactAnswer()
  }

  if (includesAny(normalized, ['construction', 'sq ft', 'square feet', 'per sqft', 'per sq'])) {
    return buildConstructionAnswer(prices)
  }

  const homeType = detectHomeType(normalized)
  const tier = detectPackageTier(normalized)
  if (homeType && tier) {
    return buildPackagePriceAnswer(homeType, tier, prices)
  }

  if (tier && includesAny(normalized, ['include', 'inclusion', 'covers', 'what comes', 'contains'])) {
    return buildTierInclusionAnswer(tier)
  }

  if (includesAny(normalized, ['commercial']) && includesAny(normalized, ['price', 'pricing', 'cost', 'budget', 'quote'])) {
    return buildCommercialPricingAnswer()
  }

  return buildRetrievalAnswer(normalized)
}
