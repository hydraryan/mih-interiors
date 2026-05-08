import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Setting from '@/lib/models/Setting'

/**
 * All chatbot pricing keys with their default (current hardcoded) values.
 * Running GET on this endpoint will upsert any missing keys into the database.
 */
const CHATBOT_PRICE_DEFAULTS: Record<string, number> = {
  // Residential Package Rates (in Lakhs)
  'chatbot_price_1bhk_essential': 5.5,
  'chatbot_price_1bhk_premium': 7,
  'chatbot_price_1bhk_luxury': 8.5,
  'chatbot_price_2bhk_essential': 9,
  'chatbot_price_2bhk_premium': 12,
  'chatbot_price_2bhk_luxury': 16,
  'chatbot_price_3bhk_essential': 15,
  'chatbot_price_3bhk_premium': 18,
  'chatbot_price_3bhk_luxury': 22,
  'chatbot_price_4bhk_essential': 22,
  'chatbot_price_4bhk_premium': 27,
  'chatbot_price_4bhk_luxury': 35,
  'chatbot_price_kothi_essential': 22,
  'chatbot_price_kothi_premium': 27,
  'chatbot_price_kothi_luxury': 35,

  // Commercial interior rates (per sq ft)
  'chatbot_price_commercial_essential_sqft': 1200,
  'chatbot_price_commercial_premium_sqft': 1500,
  'chatbot_price_commercial_luxury_sqft': 1800,

  // Construction rates (per sq ft)
  'chatbot_price_construction_standard_sqft': 2000,
  'chatbot_price_construction_premium_sqft': 2400,
  'chatbot_price_construction_luxury_sqft': 3000,

  // Construction only rates (per sq ft)
  'chatbot_price_construction_only_min_sqft': 1250,
  'chatbot_price_construction_only_max_sqft': 1500,
}

export async function GET() {
  try {
    await dbConnect()

    let seeded = 0
    for (const [key, value] of Object.entries(CHATBOT_PRICE_DEFAULTS)) {
      const existing = await Setting.findOne({ key })
      if (!existing) {
        await Setting.create({ key, value })
        seeded++
      }
    }

    // Seed notification emails if not already set
    const existingEmails = await Setting.findOne({ key: 'notification_emails' })
    if (!existingEmails) {
      await Setting.create({ key: 'notification_emails', value: ['r.aryanraj96@gmail.com'] })
      seeded++
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${seeded} new settings. Chatbot prices + notification emails.`,
      totalKeys: Object.keys(CHATBOT_PRICE_DEFAULTS).length + 1,
    })
  } catch (error: any) {
    console.error('Seed chatbot prices error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
