import {
  BUDGET_RANGE_BASELINES,
  FINAL_QUOTE_DISCLAIMER,
  RESIDENTIAL_PACKAGE_RATES,
  type PackageTier,
  type ResidentialHomeType,
} from '@/lib/chatbot/mihKnowledge'
import type { ChatbotPrices } from '@/lib/chatbot/chatbotPrices'

export type PersonalizationConsent = 'pending' | 'accepted' | 'declined'
export type DeviceTier = 'entry' | 'mid' | 'premium'
export type ScreenClass = 'small' | 'medium' | 'large'
export type OsFamily = 'ios' | 'android' | 'other'
export type NetworkType = 'wifi' | 'cellular' | 'unknown'
export type AgeBand = '18-24' | '25-34' | '35-44' | '45+'

export type DeviceSignals = {
  osFamily: OsFamily
  deviceTier: DeviceTier
  screenClass: ScreenClass
  networkType: NetworkType
  inferredAgeBand: AgeBand
  ageInferenceConfidence: number
  userAgent: string
}

export type PricingDecision = {
  baseMinLakh: number
  baseMaxLakh: number
  personalizedMinLakh: number
  personalizedMaxLakh: number
  deviceUpliftPct: number
  ageUpliftPct: number
  totalUpliftPct: number
  fairnessCapped: boolean
  appliedSignals: string[]
  consentUsed: PersonalizationConsent
  ageInferenceConfidence: number
}

type BaseRange = {
  minLakh: number
  maxLakh: number
  context: string
}

const roundOne = (v: number) => Math.round(v * 10) / 10

const formatLakh = (value: number) => {
  const rounded = roundOne(value)
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1)
}

export const formatLakhRange = (minLakh: number, maxLakh: number) =>
  `Rs. ${formatLakh(minLakh)}L - Rs. ${formatLakh(maxLakh)}L`

const inferDeviceTier = (ua: string, osFamily: OsFamily): DeviceTier => {
  const premiumPatterns = [
    'iphone 15',
    'iphone 16',
    'iphone14,',
    'iphone15,',
    'iphone16,',
    'pixel 8',
    'pixel 9',
    'galaxy s23',
    'galaxy s24',
    'galaxy z fold',
    'oneplus 12',
    'oneplus 13',
    'xiaomi 14',
  ]
  const midPatterns = ['iphone 11', 'iphone 12', 'iphone 13', 'galaxy a', 'redmi note', 'oneplus nord', 'pixel 6', 'pixel 7']

  if (premiumPatterns.some((p) => ua.includes(p))) return 'premium'
  if (midPatterns.some((p) => ua.includes(p))) return 'mid'

  if (osFamily === 'ios') return 'mid'
  if (osFamily === 'android') return 'entry'
  return 'entry'
}

const inferScreenClass = (width: number, height: number): ScreenClass => {
  const longest = Math.max(width, height)
  if (longest >= 960) return 'large'
  if (longest >= 780) return 'medium'
  return 'small'
}

const inferAgeBandFromSignals = (signals: Omit<DeviceSignals, 'inferredAgeBand' | 'ageInferenceConfidence'>): {
  ageBand: AgeBand
  confidence: number
} => {
  let score = 0

  if (signals.osFamily === 'ios') score += 1
  if (signals.deviceTier === 'premium') score += 2
  if (signals.deviceTier === 'mid') score += 1
  if (signals.screenClass === 'large') score += 1
  if (signals.screenClass === 'medium') score += 0.5
  if (signals.networkType === 'wifi') score += 0.5

  if (score >= 5.5) {
    return { ageBand: '45+', confidence: 0.62 }
  }
  if (score >= 4) {
    return { ageBand: '35-44', confidence: 0.67 }
  }
  if (score >= 2.5) {
    return { ageBand: '25-34', confidence: 0.56 }
  }

  return { ageBand: '18-24', confidence: 0.43 }
}

export const buildDeviceSignalsFromBrowser = (): DeviceSignals | null => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return null
  }

  const ua = navigator.userAgent.toLowerCase()
  const osFamily: OsFamily = ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')
    ? 'ios'
    : ua.includes('android')
      ? 'android'
      : 'other'

  const deviceTier = inferDeviceTier(ua, osFamily)
  const screenClass = inferScreenClass(window.screen.width, window.screen.height)

  const networkInfo = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
  const networkType: NetworkType = networkInfo?.effectiveType?.includes('wifi')
    ? 'wifi'
    : networkInfo?.effectiveType
      ? 'cellular'
      : 'unknown'

  const inferred = inferAgeBandFromSignals({
    osFamily,
    deviceTier,
    screenClass,
    networkType,
    userAgent: ua,
  })

  return {
    osFamily,
    deviceTier,
    screenClass,
    networkType,
    inferredAgeBand: inferred.ageBand,
    ageInferenceConfidence: inferred.confidence,
    userAgent: ua,
  }
}

export const getBaseRangeFromAnswers = (answers: Record<string, string>, prices?: ChatbotPrices): BaseRange | null => {
  const projectType = answers.greeting
  const scope = answers.scope
  const resType = answers.residential_type as ResidentialHomeType | undefined
  const packageTier = answers.package_interest as PackageTier | undefined
  const areaSqft = parseFloat(answers.area_sqft || '0')

  // Case 1: Standard BHK Interior Design (Fixed rates from table)
  if (projectType === 'residential' && scope === 'interiors' && resType && resType !== 'Kothi' && packageTier) {
    const rate = prices ? prices.residential[resType]?.[packageTier] : RESIDENTIAL_PACKAGE_RATES[resType]?.[packageTier]
    if (rate != null) {
      return {
        minLakh: roundOne(rate * 0.95),
        maxLakh: roundOne(rate * 1.12),
        context: `${resType} ${packageTier} Interiors`,
      }
    }
  }

  // Case 2: Area-based Calculation (Kothi, Commercial, Full Construction)
  if (areaSqft > 0) {
    if (scope === 'interiors' && projectType === 'commercial') {
      const baseRate = prices
        ? (packageTier === 'luxury' ? prices.commercial.luxury : packageTier === 'premium' ? prices.commercial.premium : prices.commercial.essential)
        : (packageTier === 'luxury' ? 1800 : packageTier === 'premium' ? 1500 : 1200)
      return {
        minLakh: roundOne((areaSqft * baseRate) / 100000),
        maxLakh: roundOne((areaSqft * baseRate * 1.2) / 100000),
        context: `Commercial Interiors (${areaSqft} sqft)`,
      }
    }

    if (scope === 'full' || resType === 'Kothi' || projectType === 'commercial') {
      let baseRate = prices?.construction.standard ?? 2000
      if (packageTier === 'premium') baseRate = prices?.construction.premium ?? 2400
      if (packageTier === 'luxury') baseRate = prices?.construction.luxury ?? 3000

      return {
        minLakh: roundOne((areaSqft * baseRate) / 100000),
        maxLakh: roundOne((areaSqft * baseRate * 1.15) / 100000),
        context: `${projectType === 'commercial' ? 'Commercial' : resType === 'Kothi' ? 'Kothi' : 'Full Construction'} (${areaSqft} sqft, ${packageTier || 'standard'})`,
      }
    }
  }

  // Case 3: Fallback to budget range selection
  const budgetRange = answers.budget_range as keyof typeof BUDGET_RANGE_BASELINES | undefined
  if (budgetRange && BUDGET_RANGE_BASELINES[budgetRange]) {
    const base = BUDGET_RANGE_BASELINES[budgetRange]
    return {
      minLakh: base.minLakh,
      maxLakh: base.maxLakh,
      context: 'Budget target baseline',
    }
  }

  return null
}

export const calculatePersonalizedPricing = (
  base: BaseRange,
  consent: PersonalizationConsent,
  signals: DeviceSignals | null,
): PricingDecision => {
  if (consent !== 'accepted' || !signals) {
    return {
      baseMinLakh: base.minLakh,
      baseMaxLakh: base.maxLakh,
      personalizedMinLakh: base.minLakh,
      personalizedMaxLakh: base.maxLakh,
      deviceUpliftPct: 0,
      ageUpliftPct: 0,
      totalUpliftPct: 0,
      fairnessCapped: false,
      appliedSignals: ['base-pricing-only'],
      consentUsed: consent,
      ageInferenceConfidence: signals?.ageInferenceConfidence ?? 0,
    }
  }

  const tierUpliftMap: Record<DeviceTier, number> = { entry: 0, mid: 0.05, premium: 0.08 }
  const screenUpliftMap: Record<ScreenClass, number> = { small: 0, medium: 0.01, large: 0.02 }
  const networkUpliftMap: Record<NetworkType, number> = { wifi: 0.01, cellular: 0, unknown: 0 }
  const ageUpliftMap: Record<AgeBand, number> = { '18-24': 0, '25-34': 0, '35-44': 0.06, '45+': 0.08 }

  const appliedSignals: string[] = []
  let fairnessCapped = false

  let deviceUplift = tierUpliftMap[signals.deviceTier] + screenUpliftMap[signals.screenClass] + networkUpliftMap[signals.networkType]
  if (deviceUplift > 0.1) {
    deviceUplift = 0.1
    fairnessCapped = true
  }
  if (deviceUplift > 0) {
    appliedSignals.push(`device:${signals.deviceTier}`)
    appliedSignals.push(`screen:${signals.screenClass}`)
    appliedSignals.push(`network:${signals.networkType}`)
  }

  let ageUplift = 0
  if (signals.ageInferenceConfidence >= 0.65) {
    ageUplift = ageUpliftMap[signals.inferredAgeBand]
    if (ageUplift > 0) {
      appliedSignals.push(`age:${signals.inferredAgeBand}`)
    }
  } else {
    appliedSignals.push('age-skipped-low-confidence')
  }

  if (ageUplift > 0.1) {
    ageUplift = 0.1
    fairnessCapped = true
  }

  let totalUplift = deviceUplift + ageUplift
  if (totalUplift > 0.10) {
    totalUplift = 0.10
    fairnessCapped = true
  }

  const factor = 1 + totalUplift

  return {
    baseMinLakh: base.minLakh,
    baseMaxLakh: base.maxLakh,
    personalizedMinLakh: roundOne(base.minLakh * factor),
    personalizedMaxLakh: roundOne(base.maxLakh * factor),
    deviceUpliftPct: roundOne(deviceUplift * 100) / 100,
    ageUpliftPct: roundOne(ageUplift * 100) / 100,
    totalUpliftPct: roundOne(totalUplift * 100) / 100,
    fairnessCapped,
    appliedSignals: appliedSignals.length ? appliedSignals : ['base-pricing-only'],
    consentUsed: consent,
    ageInferenceConfidence: signals.ageInferenceConfidence,
  }
}

export const buildEstimateMessage = (
  answers: Record<string, string>,
  consent: PersonalizationConsent,
  signals: DeviceSignals | null,
  contactName?: string,
  prices?: ChatbotPrices,
): { message: string; pricingDecision: PricingDecision | null } => {
  const baseRange = getBaseRangeFromAnswers(answers, prices)
  const namePrefix = contactName?.trim() ? `${contactName.trim()}, ` : ''

  if (!baseRange) {
    return {
      message: `${namePrefix}thanks for sharing the details. Mohit will call you shortly with a custom estimate aligned to your scope.`,
      pricingDecision: null,
    }
  }

  const decision = calculatePersonalizedPricing(baseRange, consent, signals)
  const rangeText = formatLakhRange(decision.personalizedMinLakh, decision.personalizedMaxLakh)
  const personalizationText =
    consent === 'accepted'
      ? 'Optional personalization has been applied based on your consent and session context.'
      : 'Standard estimate mode was used because personalization consent was not accepted.'

  return {
    message: `${namePrefix}your estimated budget range is ${rangeText}. ${personalizationText} ${FINAL_QUOTE_DISCLAIMER}`,
    pricingDecision: decision,
  }
}
