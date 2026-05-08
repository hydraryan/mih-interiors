import dbConnect from '@/lib/mongodb'
import Setting from '@/lib/models/Setting'

export type ChatbotPrices = {
  residential: {
    '1BHK': { essential: number; premium: number; luxury: number }
    '2BHK': { essential: number; premium: number; luxury: number }
    '3BHK': { essential: number; premium: number; luxury: number }
    '4BHK': { essential: number; premium: number; luxury: number }
    Kothi: { essential: number; premium: number; luxury: number }
  }
  commercial: { essential: number; premium: number; luxury: number }
  construction: { standard: number; premium: number; luxury: number }
  constructionOnly: { min: number; max: number }
}

const DEFAULTS: ChatbotPrices = {
  residential: {
    '1BHK': { essential: 5.5, premium: 7, luxury: 8.5 },
    '2BHK': { essential: 9, premium: 12, luxury: 16 },
    '3BHK': { essential: 15, premium: 18, luxury: 22 },
    '4BHK': { essential: 22, premium: 27, luxury: 35 },
    Kothi: { essential: 22, premium: 27, luxury: 35 },
  },
  commercial: { essential: 1200, premium: 1500, luxury: 1800 },
  construction: { standard: 2000, premium: 2400, luxury: 3000 },
  constructionOnly: { min: 1250, max: 1500 },
}

/**
 * Load all chatbot prices from the database.
 * Falls back to hardcoded defaults for any missing keys.
 */
export async function getChatbotPrices(): Promise<ChatbotPrices> {
  try {
    await dbConnect()
    const settings = await Setting.find({ key: { $regex: /^chatbot_price_/ } }).lean()
    const map: Record<string, number> = {}
    for (const s of settings as any[]) {
      map[s.key] = Number(s.value)
    }

    const g = (key: string, fallback: number) => map[key] ?? fallback

    return {
      residential: {
        '1BHK': {
          essential: g('chatbot_price_1bhk_essential', DEFAULTS.residential['1BHK'].essential),
          premium: g('chatbot_price_1bhk_premium', DEFAULTS.residential['1BHK'].premium),
          luxury: g('chatbot_price_1bhk_luxury', DEFAULTS.residential['1BHK'].luxury),
        },
        '2BHK': {
          essential: g('chatbot_price_2bhk_essential', DEFAULTS.residential['2BHK'].essential),
          premium: g('chatbot_price_2bhk_premium', DEFAULTS.residential['2BHK'].premium),
          luxury: g('chatbot_price_2bhk_luxury', DEFAULTS.residential['2BHK'].luxury),
        },
        '3BHK': {
          essential: g('chatbot_price_3bhk_essential', DEFAULTS.residential['3BHK'].essential),
          premium: g('chatbot_price_3bhk_premium', DEFAULTS.residential['3BHK'].premium),
          luxury: g('chatbot_price_3bhk_luxury', DEFAULTS.residential['3BHK'].luxury),
        },
        '4BHK': {
          essential: g('chatbot_price_4bhk_essential', DEFAULTS.residential['4BHK'].essential),
          premium: g('chatbot_price_4bhk_premium', DEFAULTS.residential['4BHK'].premium),
          luxury: g('chatbot_price_4bhk_luxury', DEFAULTS.residential['4BHK'].luxury),
        },
        Kothi: {
          essential: g('chatbot_price_kothi_essential', DEFAULTS.residential.Kothi.essential),
          premium: g('chatbot_price_kothi_premium', DEFAULTS.residential.Kothi.premium),
          luxury: g('chatbot_price_kothi_luxury', DEFAULTS.residential.Kothi.luxury),
        },
      },
      commercial: {
        essential: g('chatbot_price_commercial_essential_sqft', DEFAULTS.commercial.essential),
        premium: g('chatbot_price_commercial_premium_sqft', DEFAULTS.commercial.premium),
        luxury: g('chatbot_price_commercial_luxury_sqft', DEFAULTS.commercial.luxury),
      },
      construction: {
        standard: g('chatbot_price_construction_standard_sqft', DEFAULTS.construction.standard),
        premium: g('chatbot_price_construction_premium_sqft', DEFAULTS.construction.premium),
        luxury: g('chatbot_price_construction_luxury_sqft', DEFAULTS.construction.luxury),
      },
      constructionOnly: {
        min: g('chatbot_price_construction_only_min_sqft', DEFAULTS.constructionOnly.min),
        max: g('chatbot_price_construction_only_max_sqft', DEFAULTS.constructionOnly.max),
      },
    }
  } catch (error) {
    console.error('Failed to load chatbot prices from DB, using defaults:', error)
    return DEFAULTS
  }
}
