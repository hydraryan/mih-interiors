'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Save, IndianRupee, ArrowRight, Bot } from 'lucide-react'
import { formatStartingPrice } from '@/lib/services/pricing'

type ServiceRow = {
  _id: string
  title: string
  slug: string
  category: string
  startingPrice?: number | null
  shortDescription?: string
  publishStatus?: string
}

const PAGE_CONTEXTS = 'Services page + service detail page'

export default function AdminPricingPage() {
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [draftPrices, setDraftPrices] = useState<Record<string, string>>({})
  
  const [threeDPrice, setThreeDPrice] = useState<string>('')
  const [savingThreeD, setSavingThreeD] = useState(false)

  // Chatbot pricing state
  const CHATBOT_PRICE_KEYS = [
    { key: 'chatbot_price_1bhk_essential', label: '1 BHK Essential', unit: 'Lakhs' },
    { key: 'chatbot_price_1bhk_premium', label: '1 BHK Premium', unit: 'Lakhs' },
    { key: 'chatbot_price_1bhk_luxury', label: '1 BHK Luxury', unit: 'Lakhs' },
    { key: 'chatbot_price_2bhk_essential', label: '2 BHK Essential', unit: 'Lakhs' },
    { key: 'chatbot_price_2bhk_premium', label: '2 BHK Premium', unit: 'Lakhs' },
    { key: 'chatbot_price_2bhk_luxury', label: '2 BHK Luxury', unit: 'Lakhs' },
    { key: 'chatbot_price_3bhk_essential', label: '3 BHK Essential', unit: 'Lakhs' },
    { key: 'chatbot_price_3bhk_premium', label: '3 BHK Premium', unit: 'Lakhs' },
    { key: 'chatbot_price_3bhk_luxury', label: '3 BHK Luxury', unit: 'Lakhs' },
    { key: 'chatbot_price_4bhk_essential', label: '4 BHK Essential', unit: 'Lakhs' },
    { key: 'chatbot_price_4bhk_premium', label: '4 BHK Premium', unit: 'Lakhs' },
    { key: 'chatbot_price_4bhk_luxury', label: '4 BHK Luxury', unit: 'Lakhs' },
    { key: 'chatbot_price_kothi_essential', label: 'Kothi Essential', unit: 'Lakhs' },
    { key: 'chatbot_price_kothi_premium', label: 'Kothi Premium', unit: 'Lakhs' },
    { key: 'chatbot_price_kothi_luxury', label: 'Kothi Luxury', unit: 'Lakhs' },
    { key: 'chatbot_price_commercial_essential_sqft', label: 'Commercial Essential', unit: '₹/sqft' },
    { key: 'chatbot_price_commercial_premium_sqft', label: 'Commercial Premium', unit: '₹/sqft' },
    { key: 'chatbot_price_commercial_luxury_sqft', label: 'Commercial Luxury', unit: '₹/sqft' },
    { key: 'chatbot_price_construction_standard_sqft', label: 'Construction Standard', unit: '₹/sqft' },
    { key: 'chatbot_price_construction_premium_sqft', label: 'Construction Premium', unit: '₹/sqft' },
    { key: 'chatbot_price_construction_luxury_sqft', label: 'Construction Luxury', unit: '₹/sqft' },
    { key: 'chatbot_price_construction_only_min_sqft', label: 'Construction Only Min', unit: '₹/sqft' },
    { key: 'chatbot_price_construction_only_max_sqft', label: 'Construction Only Max', unit: '₹/sqft' },
  ]
  const [chatbotDraft, setChatbotDraft] = useState<Record<string, string>>({})
  const [savingChatbot, setSavingChatbot] = useState(false)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch('/api/admin/services')
        const data = await res.json()
        if (data.success) {
          setServices(data.services)
          setDraftPrices(
            Object.fromEntries(
              data.services.map((service: ServiceRow) => [service._id, service.startingPrice?.toString() ?? ''])
            )
          )
        }
      } catch (error) {
        console.error('Error fetching pricing data:', error)
      }

      try {
        const resSettings = await fetch('/api/admin/settings?key=three_d_rendering_price_sqft')
        const dataSettings = await resSettings.json()
        if (dataSettings.success && dataSettings.setting) {
          setThreeDPrice(dataSettings.setting.value.toString())
        }
      } catch (error) {
        console.error('Error fetching 3D price setting:', error)
      }

      // Load chatbot prices
      try {
        const resChatbot = await fetch('/api/admin/settings')
        const dataChatbot = await resChatbot.json()
        if (dataChatbot.success && dataChatbot.settings) {
          const draft: Record<string, string> = {}
          for (const s of dataChatbot.settings) {
            if (s.key.startsWith('chatbot_price_')) {
              draft[s.key] = s.value?.toString() ?? ''
            }
          }
          setChatbotDraft(draft)
        }
      } catch (error) {
        console.error('Error fetching chatbot prices:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  const savePrice = async (service: ServiceRow) => {
    setSavingId(service._id)
    setMessage(null)

    try {
      const payload = {
        startingPrice: draftPrices[service._id] === '' ? undefined : Number(draftPrices[service._id]),
      }

      const res = await fetch(`/api/admin/services/${service._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to update price')
      }

      setServices((current) =>
        current.map((row) => row._id === service._id ? { ...row, startingPrice: payload.startingPrice as number | undefined } : row)
      )
      setMessage(`${service.title} updated successfully.`)
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to update price')
    } finally {
      setSavingId(null)
    }
  }

  const saveThreeDPrice = async () => {
    setSavingThreeD(true)
    setMessage(null)
    try {
      const payload = {
        key: 'three_d_rendering_price_sqft',
        value: threeDPrice === '' ? null : Number(threeDPrice)
      }
      const res = await fetch(`/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to update 3D pricing')
      }
      setMessage('3D Rendering price updated successfully.')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to update 3D price')
    } finally {
      setSavingThreeD(false)
    }
  }

  const saveChatbotPrices = async () => {
    setSavingChatbot(true)
    setMessage(null)
    try {
      for (const [key, val] of Object.entries(chatbotDraft)) {
        if (val === '') continue
        await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: Number(val) }),
        })
      }
      setMessage('All chatbot prices saved successfully.')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to save chatbot prices')
    } finally {
      setSavingChatbot(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-4xl border border-white/70 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fbf4eb] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-brown-700">
            <IndianRupee className="h-3.5 w-3.5" />
            Pricing controls
          </div>
          <h2 className="font-display text-3xl text-charcoal-900">Editable service starting prices</h2>
          <p className="max-w-2xl text-sm leading-6 text-charcoal-600">
            Edit the public starting price for each service in one place. These values appear on the services page and on each service detail page.
          </p>
        </div>

        <div className="rounded-4xl border border-cream-200 bg-[#fbf4eb] px-4 py-3 text-sm text-charcoal-700">
          <div className="font-semibold text-charcoal-900">{services.length} services</div>
          <div className="text-xs uppercase tracking-[0.24em] text-charcoal-500">{PAGE_CONTEXTS}</div>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-brown-200 bg-brown-50 px-4 py-3 text-sm text-brown-800">
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-brown-700" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-sm">
            <div className="border-b border-cream-200 bg-cream-50/60 px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-charcoal-500">
                Specialized Services
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-4 lg:grid-cols-[1.4fr_1.3fr_0.9fr_auto] lg:items-center">
                <div>
                  <div className="font-semibold text-charcoal-900">3D Visualization</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-charcoal-400">/3d-rendering</div>
                </div>
                <div className="space-y-2 text-sm text-charcoal-600">
                  <div>3D Visualization Landing Page</div>
                  <div className="text-xs text-charcoal-400">What it is: Per sq. ft. starting price</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">
                    Price per sq. ft. (INR)
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-cream-200 bg-[#fbf4eb] px-3 py-2.5">
                    <IndianRupee className="h-4 w-4 text-brown-700" />
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={threeDPrice}
                      onChange={(event) => setThreeDPrice(event.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-charcoal-900 outline-none placeholder:text-charcoal-400"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <button
                    type="button"
                    onClick={saveThreeDPrice}
                    disabled={savingThreeD}
                    className="inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brown-900 disabled:opacity-60"
                  >
                    {savingThreeD ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chatbot Pricing Card — Flowchart Style */}
          <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-sm">
            <div className="border-b border-cream-200 bg-cream-50/60 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-4 w-4 text-brown-700" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-charcoal-500">
                    Chatbot Pricing Tree
                  </p>
                  <p className="text-[10px] text-charcoal-400 mt-0.5">Visual flow of how the chatbot calculates quotes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={saveChatbotPrices}
                disabled={savingChatbot}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brown-900 disabled:opacity-60"
              >
                {savingChatbot ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save All
              </button>
            </div>
            <div className="p-6 space-y-8">

              {/* ── ROOT NODE ── */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-charcoal-900 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-lg">
                  <Bot className="h-4 w-4" />
                  Chatbot Quote Engine
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-charcoal-200" />
              </div>

              {/* ── THREE BRANCHES ── */}
              <div className="grid lg:grid-cols-3 gap-6">

                {/* ═══ BRANCH 1: Residential ═══ */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Residential Interiors
                    </div>
                  </div>
                  <div className="flex justify-center"><div className="w-px h-4 bg-emerald-200" /></div>
                  <p className="text-center text-[10px] text-charcoal-400 uppercase tracking-widest">Fixed rates in Lakhs (₹L)</p>

                  {/* BHK groups */}
                  {(['1BHK', '2BHK', '3BHK', '4BHK', 'Kothi'] as const).map((bhk) => (
                    <div key={bhk} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold text-charcoal-800">{bhk}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['essential', 'premium', 'luxury'] as const).map((tier) => {
                          const key = `chatbot_price_${bhk.toLowerCase()}_${tier}`
                          return (
                            <div key={key} className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-charcoal-400 block text-center">{tier}</label>
                              <div className="flex items-center gap-1 rounded-xl border border-cream-200 bg-white px-2 py-1.5">
                                <span className="text-[9px] font-bold text-charcoal-300">₹L</span>
                                <input
                                  type="number" step="any" min="0"
                                  value={chatbotDraft[key] ?? ''}
                                  onChange={(e) => setChatbotDraft((d) => ({ ...d, [key]: e.target.value }))}
                                  className="w-full bg-transparent text-sm font-semibold text-charcoal-900 outline-none text-center placeholder:text-charcoal-300"
                                  placeholder="—"
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ═══ BRANCH 2: Commercial ═══ */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-blue-200">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Commercial Interiors
                    </div>
                  </div>
                  <div className="flex justify-center"><div className="w-px h-4 bg-blue-200" /></div>
                  <p className="text-center text-[10px] text-charcoal-400 uppercase tracking-widest">Rate per sq. ft. (₹)</p>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-xs font-bold text-charcoal-800">Per Sq. Ft. Rates</span>
                    </div>
                    {[
                      { key: 'chatbot_price_commercial_essential_sqft', label: 'Essential' },
                      { key: 'chatbot_price_commercial_premium_sqft', label: 'Premium' },
                      { key: 'chatbot_price_commercial_luxury_sqft', label: 'Luxury' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-charcoal-500 w-16 shrink-0">{item.label}</span>
                        <div className="w-6 h-px bg-blue-200" />
                        <div className="flex-1 flex items-center gap-1 rounded-xl border border-cream-200 bg-white px-2 py-1.5">
                          <span className="text-[9px] font-bold text-charcoal-300">₹</span>
                          <input
                            type="number" step="any" min="0"
                            value={chatbotDraft[item.key] ?? ''}
                            onChange={(e) => setChatbotDraft((d) => ({ ...d, [item.key]: e.target.value }))}
                            className="w-full bg-transparent text-sm font-semibold text-charcoal-900 outline-none placeholder:text-charcoal-300"
                            placeholder="—"
                          />
                          <span className="text-[9px] text-charcoal-400 shrink-0">/sqft</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Spacer + connector to Construction */}
                  <div className="flex items-center justify-center pt-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Construction + Interiors
                    </div>
                  </div>
                  <div className="flex justify-center"><div className="w-px h-4 bg-amber-200" /></div>
                  <p className="text-center text-[10px] text-charcoal-400 uppercase tracking-widest">Rate per sq. ft. (₹)</p>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold text-charcoal-800">Full Build + Interior</span>
                    </div>
                    {[
                      { key: 'chatbot_price_construction_standard_sqft', label: 'Standard' },
                      { key: 'chatbot_price_construction_premium_sqft', label: 'Premium' },
                      { key: 'chatbot_price_construction_luxury_sqft', label: 'Luxury' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-charcoal-500 w-16 shrink-0">{item.label}</span>
                        <div className="w-6 h-px bg-amber-200" />
                        <div className="flex-1 flex items-center gap-1 rounded-xl border border-cream-200 bg-white px-2 py-1.5">
                          <span className="text-[9px] font-bold text-charcoal-300">₹</span>
                          <input
                            type="number" step="any" min="0"
                            value={chatbotDraft[item.key] ?? ''}
                            onChange={(e) => setChatbotDraft((d) => ({ ...d, [item.key]: e.target.value }))}
                            className="w-full bg-transparent text-sm font-semibold text-charcoal-900 outline-none placeholder:text-charcoal-300"
                            placeholder="—"
                          />
                          <span className="text-[9px] text-charcoal-400 shrink-0">/sqft</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ═══ BRANCH 3: Construction Only ═══ */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-800 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Construction Only
                    </div>
                  </div>
                  <div className="flex justify-center"><div className="w-px h-4 bg-rose-200" /></div>
                  <p className="text-center text-[10px] text-charcoal-400 uppercase tracking-widest">No interiors — civil scope only</p>

                  <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span className="text-xs font-bold text-charcoal-800">Sq. Ft. Range</span>
                    </div>
                    {[
                      { key: 'chatbot_price_construction_only_min_sqft', label: 'Min Rate' },
                      { key: 'chatbot_price_construction_only_max_sqft', label: 'Max Rate' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-charcoal-500 w-16 shrink-0">{item.label}</span>
                        <div className="w-6 h-px bg-rose-200" />
                        <div className="flex-1 flex items-center gap-1 rounded-xl border border-cream-200 bg-white px-2 py-1.5">
                          <span className="text-[9px] font-bold text-charcoal-300">₹</span>
                          <input
                            type="number" step="any" min="0"
                            value={chatbotDraft[item.key] ?? ''}
                            onChange={(e) => setChatbotDraft((d) => ({ ...d, [item.key]: e.target.value }))}
                            className="w-full bg-transparent text-sm font-semibold text-charcoal-900 outline-none placeholder:text-charcoal-300"
                            placeholder="—"
                          />
                          <span className="text-[9px] text-charcoal-400 shrink-0">/sqft</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="rounded-2xl border border-charcoal-100 bg-charcoal-50/50 p-4 space-y-2 mt-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-500">How it works</p>
                    <div className="space-y-1.5 text-[11px] text-charcoal-500 leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span><b className="text-charcoal-700">Residential:</b> Fixed lakh amount based on BHK + tier</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        <span><b className="text-charcoal-700">Commercial:</b> Area × rate/sqft by tier</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span><b className="text-charcoal-700">Build+Interior:</b> Area × rate/sqft by tier</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span><b className="text-charcoal-700">Build Only:</b> Area × min–max range</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-sm">
          <div className="border-b border-cream-200 bg-cream-50/60 px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-charcoal-500">
              Service pricing table
            </p>
          </div>

          <div className="divide-y divide-cream-100">
            {services.map((service) => (
              <div key={service._id} className="grid gap-4 px-6 py-5 lg:grid-cols-[1.4fr_1.3fr_0.9fr_auto] lg:items-center">
                <div>
                  <div className="font-semibold text-charcoal-900">{service.title}</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-charcoal-400">/{service.slug}</div>
                </div>

                <div className="space-y-2 text-sm text-charcoal-600">
                  <div>{PAGE_CONTEXTS}</div>
                  <div className="text-xs text-charcoal-400">What it is: the public starting price CTA</div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-500">
                    Starting price (INR)
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-cream-200 bg-[#fbf4eb] px-3 py-2.5">
                    <IndianRupee className="h-4 w-4 text-brown-700" />
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={draftPrices[service._id] ?? ''}
                      onChange={(event) => setDraftPrices((current) => ({ ...current, [service._id]: event.target.value }))}
                      className="w-full bg-transparent text-sm font-medium text-charcoal-900 outline-none placeholder:text-charcoal-400"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="text-xs text-charcoal-400">
                    Preview: {formatStartingPrice(service.startingPrice) || 'Not set'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Link
                    href={`/admin/services/edit/${service._id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-charcoal-900/10 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-700 transition-colors hover:border-brown-200 hover:text-brown-700"
                  >
                    Full edit
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => savePrice(service)}
                    disabled={savingId === service._id}
                    className="inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brown-900 disabled:opacity-60"
                  >
                    {savingId === service._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="px-6 py-20 text-center text-sm text-charcoal-500">
              No services found.
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  )
}