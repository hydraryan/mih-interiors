'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Building2, Check, Home, Loader2, MessageCircle, Sparkles, X } from 'lucide-react'
import { MIH_KNOWLEDGE_VERSION } from '@/lib/chatbot/mihKnowledge'
import {
  buildEstimateMessage,
  formatLakhRange,
  type DeviceSignals,
  type PersonalizationConsent,
  type PricingDecision,
} from '@/lib/chatbot/pricingPersonalization'

type WizardStepId = 'project' | 'scale' | 'scope' | 'finish' | 'contact'

type WizardOption = {
  value: string
  label: string
  detail?: string
  icon?: React.ComponentType<{ className?: string }>
}

type PrefillState = {
  isOpen: boolean
  stepIndex: number
  answers: Record<string, string>
}

const STEP_IDS: WizardStepId[] = ['project', 'scale', 'scope', 'finish', 'contact']

function getOptionCardClass(selected: boolean, align: 'left' | 'center' = 'left') {
  const base = 'w-full rounded-md border px-4 py-3 transition duration-200'
  const alignment = align === 'center' ? 'text-center' : 'text-left'
  const state = selected
    ? 'border-charcoal-900 bg-white shadow-[0_10px_24px_rgba(20,16,13,0.10)]'
    : 'border-charcoal-900/12 bg-white/70 hover:border-charcoal-900/28 hover:bg-white'

  return `${base} ${alignment} ${state}`
}

const PROJECT_OPTIONS: WizardOption[] = [
  {
    value: 'residential',
    label: 'My Home',
    detail: 'Residential branch',
    icon: Home,
  },
  {
    value: 'commercial',
    label: 'My Business',
    detail: 'Commercial branch',
    icon: Building2,
  },
]

const RESIDENTIAL_SCALE_OPTIONS: WizardOption[] = [
  { value: '1BHK', label: '1 BHK Apartment', detail: '(Approx. 700 sq.ft)' },
  { value: '2BHK', label: '2 BHK Apartment', detail: '(Approx. 1,100 sq.ft)' },
  { value: '3BHK', label: '3 BHK Apartment', detail: '(Approx. 1,500 sq.ft)' },
  { value: 'Kothi', label: '4 BHK / Kothi / Villa', detail: '(Approx. 3,000 sq.ft)' },
]

const COMMERCIAL_SCALE_OPTIONS: WizardOption[] = [
  { value: 'office', label: 'Office / Studio', detail: '(Approx. 1,200 sq.ft)' },
  { value: 'retail', label: 'Retail / Showroom', detail: '(Approx. 1,800 sq.ft)' },
  { value: 'restaurant', label: 'Restaurant / Cafe', detail: '(Approx. 2,200 sq.ft)' },
  { value: 'healthcare', label: 'Clinic / Healthcare', detail: '(Approx. 2,500 sq.ft)' },
]

const SCOPE_OPTIONS: WizardOption[] = [
  {
    value: 'full',
    label: 'Full Architecture + Construction + Interiors',
    detail: '(Construction matrix)',
  },
  {
    value: 'interiors',
    label: 'Interior Design & Fit-Out Only',
    detail: '(Interior package matrix)',
  },
  {
    value: 'design_only',
    label: '3D Renders & Design Planning Only',
    detail: '(Renders route)',
  },
]

const FINISH_OPTIONS: WizardOption[] = [
  {
    value: 'essential',
    label: 'Smart design, premium regional materials, functional elegance.',
    detail: 'Essential',
  },
  {
    value: 'premium',
    label: 'Custom joinery, layered architectural lighting, bespoke furnishings',
    detail: 'Premium',
  },
  {
    value: 'luxury',
    label: 'Imported stone, complex ceiling architecture, one-of-a-kind curation.',
    detail: 'Luxury',
  },
]

const RESIDENTIAL_AREA_MAP: Record<string, number> = {
  '1BHK': 700,
  '2BHK': 1100,
  '3BHK': 1500,
  Kothi: 3000,
}

const COMMERCIAL_AREA_MAP: Record<string, number> = {
  office: 1200,
  retail: 1800,
  restaurant: 2200,
  healthcare: 2500,
}

const FINISH_TO_BUDGET_MAP: Record<string, string> = {
  essential: '10_25',
  premium: '25_50',
  luxury: '50_100',
}

function getPrefillState(args: {
  pathname: string
  serviceSlug: string | null
  hasQuoteHash: boolean
}): PrefillState {
  const pathServiceSlug = args.pathname.startsWith('/services/') ? args.pathname.split('/services/')[1] : null
  const slug = args.serviceSlug || pathServiceSlug

  if (!args.hasQuoteHash && !slug) {
    return { isOpen: false, stepIndex: 0, answers: {} }
  }

  if (slug === 'residential-interiors') {
    return {
      isOpen: true,
      stepIndex: 1,
      answers: {
        greeting: 'residential',
      },
    }
  }

  if (slug === 'commercial-interiors') {
    return {
      isOpen: true,
      stepIndex: 1,
      answers: {
        greeting: 'commercial',
      },
    }
  }

  if (slug === 'construction-architecture') {
    return {
      isOpen: true,
      stepIndex: 2,
      answers: {
        greeting: 'residential',
        scope: 'full',
      },
    }
  }

  return {
    isOpen: true,
    stepIndex: 0,
    answers: {},
  }
}

function TypingLoader() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cream-200 bg-white px-3 py-2 text-[11px] font-semibold text-charcoal-600">
      <span>AI is thinking</span>
      <span className="inline-flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal-500 [animation-delay:-0.22s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal-500 [animation-delay:-0.1s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal-500" />
      </span>
    </div>
  )
}

function ChatbotContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const serviceSlug = searchParams.get('service')

  const hasQuoteHash = typeof window !== 'undefined' && window.location.hash === '#quote'
  const initialPrefill = getPrefillState({ pathname, serviceSlug, hasQuoteHash })

  const [isOpen, setIsOpen] = useState(() => initialPrefill.isOpen)
  const [stepIndex, setStepIndex] = useState(() => initialPrefill.stepIndex)
  const [answers, setAnswers] = useState<Record<string, string>>(() => initialPrefill.answers)

  const [nameInput, setNameInput] = useState(() => initialPrefill.answers.contact_name || '')
  const [phoneInput, setPhoneInput] = useState(() => initialPrefill.answers.contact_phone || '')
  const [cityInput, setCityInput] = useState(() => initialPrefill.answers.city || '')

  const [personalizationConsent] = useState<PersonalizationConsent>('declined')
  const [deviceSignals] = useState<DeviceSignals | null>(null)
  const [conversationId] = useState(
    () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `conv-${Date.now()}`),
  )

  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [lastPricingDecision, setLastPricingDecision] = useState<PricingDecision | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentStepId = STEP_IDS[stepIndex]
  const totalSteps = STEP_IDS.length
  const progressPct = ((stepIndex + 1) / totalSteps) * 100

  const scaleOptions = answers.greeting === 'commercial' ? COMMERCIAL_SCALE_OPTIONS : RESIDENTIAL_SCALE_OPTIONS

  const selectedScaleValue = answers.greeting === 'commercial' ? answers.commercial_type : answers.residential_type

  const selectedOptionByStep = useMemo(() => {
    if (currentStepId === 'project') return answers.greeting || ''
    if (currentStepId === 'scale') return selectedScaleValue || ''
    if (currentStepId === 'scope') {
      const rawScope = answers.scope_variant || answers.scope || ''
      return rawScope
    }
    if (currentStepId === 'finish') return answers.package_interest || ''
    return ''
  }, [answers, currentStepId, selectedScaleValue])

  const stepMeta = useMemo(() => {
    if (currentStepId === 'project') {
      return {
        label: 'Project Type',
        title: 'What are we designing for you?',
      }
    }

    if (currentStepId === 'scale') {
      return {
        label: answers.greeting === 'commercial' ? 'Business Scale' : 'Home Scale',
        title: answers.greeting === 'commercial' ? 'How large is your business space?' : 'What is the scale of your home?',
      }
    }

    if (currentStepId === 'scope') {
      return {
        label: 'Scope of Work',
        title: 'What do you need from us?',
      }
    }

    if (currentStepId === 'finish') {
      return {
        label: 'Finish Level',
        title: 'What level of finish and detailing are you envisioning?',
      }
    }

    return {
      label: 'Contact Details',
      title: 'Where should we send your tailored estimate?',
    }
  }, [answers.greeting, currentStepId])

  const logChatEvent = useCallback(
    (
      eventType: string,
      details?: {
        stepId?: string
        payload?: Record<string, unknown>
      },
    ) => {
      if (typeof window === 'undefined') return

      void fetch('/api/chatbot/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          conversationId,
          eventType,
          stepId: details?.stepId ?? currentStepId,
          personalizationConsent,
          payload: details?.payload ?? {},
          pagePath: window.location.pathname,
        }),
      }).catch(() => {
        // Analytics failures should never block the UI.
      })
    },
    [conversationId, currentStepId, personalizationConsent],
  )

  const transitionToStep = useCallback(
    (nextStep: number) => {
      const bounded = Math.max(0, Math.min(totalSteps - 1, nextStep))
      if (bounded === stepIndex) return

      logChatEvent('step_advanced', {
        stepId: STEP_IDS[bounded],
        payload: {
          fromStep: STEP_IDS[stepIndex],
          toStep: STEP_IDS[bounded],
        },
      })

      if (prefersReducedMotion) {
        setStepIndex(bounded)
        setIsTyping(false)
        return
      }

      setIsTyping(true)
      const timer = window.setTimeout(() => {
        setStepIndex(bounded)
        setIsTyping(false)
      }, 360)
      return () => window.clearTimeout(timer)
    },
    [logChatEvent, prefersReducedMotion, stepIndex, totalSteps],
  )

  const closeChat = useCallback(
    (reason: 'header_close' | 'submit_close') => {
      setIsOpen(false)
      logChatEvent('chat_closed', {
        payload: {
          reason,
          currentStep: currentStepId,
        },
      })
    },
    [currentStepId, logChatEvent],
  )

  const openChat = useCallback(() => {
    setIsOpen(true)
    logChatEvent('chat_open', {
      payload: {
        knowledgeVersion: MIH_KNOWLEDGE_VERSION,
      },
    })
  }, [logChatEvent])

  const openFromHash = useCallback(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== '#quote') return

    history.replaceState(null, '', window.location.pathname + window.location.search)

    const prefill = getPrefillState({
      pathname,
      serviceSlug,
      hasQuoteHash: true,
    })

    setIsOpen(true)
    setStepIndex(prefill.stepIndex)
    setAnswers(prefill.answers)
  }, [pathname, serviceSlug])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== '#quote') return
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

  useEffect(() => {
    const handler = () => openFromHash()
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [openFromHash])

  const setProject = (projectType: 'residential' | 'commercial') => {
    setSubmitError(null)
    setAnswers((prev) => ({
      ...prev,
      greeting: projectType,
      residential_type: projectType === 'residential' ? prev.residential_type || '' : '',
      commercial_type: projectType === 'commercial' ? prev.commercial_type || '' : '',
    }))

    logChatEvent('answer_submitted', {
      stepId: 'project',
      payload: { answer: projectType },
    })

    transitionToStep(1)
  }

  const setScale = (value: string) => {
    setSubmitError(null)

    setAnswers((prev) => {
      const isCommercial = prev.greeting === 'commercial'
      const areaSqft = isCommercial ? COMMERCIAL_AREA_MAP[value] : RESIDENTIAL_AREA_MAP[value]

      return {
        ...prev,
        residential_type: isCommercial ? '' : value,
        commercial_type: isCommercial ? value : '',
        area_sqft: areaSqft ? String(areaSqft) : prev.area_sqft || '',
      }
    })

    logChatEvent('answer_submitted', {
      stepId: 'scale',
      payload: { answer: value },
    })

    transitionToStep(2)
  }

  const setScope = (scopeValue: string) => {
    setSubmitError(null)
    setAnswers((prev) => ({
      ...prev,
      scope_variant: scopeValue,
      scope: scopeValue === 'design_only' ? 'interiors' : scopeValue,
    }))

    logChatEvent('answer_submitted', {
      stepId: 'scope',
      payload: { answer: scopeValue },
    })

    window.setTimeout(() => {
      transitionToStep(3)
    }, prefersReducedMotion ? 0 : 180)
  }

  const setFinish = (finishValue: string) => {
    setSubmitError(null)
    setAnswers((prev) => ({
      ...prev,
      package_interest: finishValue,
      budget_range: FINISH_TO_BUDGET_MAP[finishValue] ?? prev.budget_range,
    }))

    logChatEvent('answer_submitted', {
      stepId: 'finish',
      payload: { answer: finishValue },
    })

    window.setTimeout(() => {
      transitionToStep(4)
    }, prefersReducedMotion ? 0 : 180)
  }

  const handleBack = () => {
    if (isTyping || isSubmitting || submitted) return
    transitionToStep(stepIndex - 1)
  }

  const validateContact = () => {
    const trimmedName = nameInput.trim()
    const normalizedPhone = phoneInput.replace(/\D/g, '')

    if (trimmedName.length < 2) {
      setSubmitError('Please enter your full name.')
      logChatEvent('validation_error', {
        stepId: 'contact',
        payload: { reason: 'invalid-name' },
      })
      return null
    }

    if (normalizedPhone.length !== 10) {
      setSubmitError('Please enter a valid 10-digit phone number.')
      logChatEvent('validation_error', {
        stepId: 'contact',
        payload: { reason: 'invalid-phone' },
      })
      return null
    }

    const sanitizedCity = cityInput.trim()
    return {
      contact_name: trimmedName,
      contact_phone: normalizedPhone,
      city: sanitizedCity,
    }
  }

  const submitLead = async () => {
    const contact = validateContact()
    if (!contact) return

    setIsSubmitting(true)
    setSubmitError(null)

    const nextAnswers: Record<string, string> = {
      ...answers,
      ...contact,
    }

    setAnswers(nextAnswers)

    logChatEvent('answer_submitted', {
      stepId: 'contact',
      payload: { answer: '[redacted-input]' },
    })

    const estimate = buildEstimateMessage(
      nextAnswers,
      personalizationConsent,
      deviceSignals,
      nextAnswers.contact_name,
    )

    setLastPricingDecision(estimate.pricingDecision)

    logChatEvent('estimate_generated', {
      stepId: 'contact',
      payload: {
        rangeText: estimate.pricingDecision
          ? formatLakhRange(estimate.pricingDecision.personalizedMinLakh, estimate.pricingDecision.personalizedMaxLakh)
          : null,
      },
    })

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: nextAnswers,
          completed: true,
          conversationId,
          personalizationConsent,
          consentAccepted: personalizationConsent === 'accepted',
          deviceProfile: deviceSignals,
          pricingDecision: estimate.pricingDecision,
          confidenceScore: 1.0,
          personalizationApplied: personalizationConsent === 'accepted' && (estimate.pricingDecision?.totalUpliftPct ?? 0) > 0,
          personalizationFactors: estimate.pricingDecision?.appliedSignals ?? [],
          serviceSlug,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      })

      const responseBody = (await response.json()) as { success?: boolean; leadId?: string; error?: string }
      if (!response.ok || !responseBody.success) {
        throw new Error(responseBody.error || 'Unable to submit quote request.')
      }

      logChatEvent('quote_request_ack', {
        stepId: 'contact',
        payload: {
          leadId: responseBody.leadId ?? null,
        },
      })

      setSubmitted(true)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to submit quote request.'
      setSubmitError(message)
      logChatEvent('quote_request_failed', {
        stepId: 'contact',
        payload: {
          reason: message,
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    if (isTyping) {
      return (
        <div className="flex min-h-44 items-center justify-center rounded-lg border border-charcoal-900/8 bg-white/70">
          <TypingLoader />
        </div>
      )
    }

    if (submitted) {
      return (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-charcoal-900/10 bg-white px-5 text-center shadow-[0_12px_32px_rgba(20,16,13,0.08)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700">
            <Check className="h-4 w-4" />
            Request sent
          </div>

          <h3 className="mt-5 font-display text-2xl text-charcoal-900">We got your request</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-charcoal-700/75">
            Mohit or the MIH team will call you soon with your tailored estimate and next steps.
          </p>

          {lastPricingDecision ? (
            <p className="mt-4 text-sm font-semibold text-brown-800">
              Estimated range: {formatLakhRange(lastPricingDecision.personalizedMinLakh, lastPricingDecision.personalizedMaxLakh)}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => closeChat('submit_close')}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-charcoal-900 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brown-900"
          >
            Close
          </button>
        </div>
      )
    }

    if (currentStepId === 'project') {
      return (
        <div className="space-y-8">
          <div className="grid gap-3 sm:grid-cols-2">
            {PROJECT_OPTIONS.map((option) => {
              const Icon = option.icon || Home
              const selected = selectedOptionByStep === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setProject(option.value as 'residential' | 'commercial')}
                  className={`${getOptionCardClass(selected, 'center')} min-h-28`}
                >
                  <Icon className="mx-auto h-5 w-5 text-charcoal-900" />
                  <p className="mt-4 font-display text-xl leading-tight text-charcoal-900">{option.label}</p>
                  {option.detail ? <p className="mt-2 text-sm text-charcoal-700/75">{option.detail}</p> : null}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (currentStepId === 'scale') {
      return (
        <div className="space-y-3">
          {scaleOptions.map((option) => {
            const selected = selectedOptionByStep === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setScale(option.value)}
                className={`${getOptionCardClass(selected, 'center')} min-h-20`}
              >
                <p className="font-display text-xl leading-tight text-charcoal-900">{option.label}</p>
                {option.detail ? <p className="mt-2 text-sm text-charcoal-700/75">{option.detail}</p> : null}
              </button>
            )
          })}
        </div>
      )
    }

    if (currentStepId === 'scope') {
      return (
        <div className="space-y-3">
          {SCOPE_OPTIONS.map((option) => {
            const selected = selectedOptionByStep === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setScope(option.value)}
                className={`${getOptionCardClass(selected)} flex min-h-24 items-center justify-between gap-4`}
              >
                <div>
                  <p className="font-display text-lg leading-tight text-charcoal-900">{option.label}</p>
                  {option.detail ? <p className="mt-2 text-sm text-charcoal-700/75">{option.detail}</p> : null}
                </div>
                <span className={`ml-6 inline-flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-charcoal-900' : 'border-charcoal-900/35'}`}>
                  {selected ? <span className="h-2.5 w-2.5 rounded-full bg-charcoal-900" /> : null}
                </span>
              </button>
            )
          })}

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-700/75 transition hover:text-charcoal-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-700/50">Select to continue</span>
          </div>
        </div>
      )
    }

    if (currentStepId === 'finish') {
      return (
        <div className="space-y-3">
          {FINISH_OPTIONS.map((option) => {
            const selected = selectedOptionByStep === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFinish(option.value)}
                className={`${getOptionCardClass(selected)} min-h-24`}
              >
                <p className="font-display text-lg leading-tight text-charcoal-900">{option.label}</p>
                {option.detail ? <p className="mt-2 text-sm italic text-charcoal-700/80">{option.detail}</p> : null}
              </button>
            )
          })}

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-700/75 transition hover:text-charcoal-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-700/50">Select to continue</span>
          </div>
        </div>
      )
    }

    return (
      <div className="rounded-lg border border-charcoal-900/10 bg-white p-4 shadow-[0_12px_30px_rgba(20,16,13,0.08)]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-700/70">Full name</span>
            <input
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Your full name"
              className="h-11 w-full rounded-md border border-charcoal-900/16 bg-white px-3 text-sm outline-none focus:border-charcoal-900"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-700/70">Phone number</span>
            <input
              value={phoneInput}
              onChange={(event) => setPhoneInput(event.target.value)}
              placeholder="10-digit phone number"
              className="h-11 w-full rounded-md border border-charcoal-900/16 bg-white px-3 text-sm outline-none focus:border-charcoal-900"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-700/70">City (optional)</span>
          <input
            value={cityInput}
            onChange={(event) => setCityInput(event.target.value)}
            placeholder="City"
            className="h-11 w-full rounded-md border border-charcoal-900/16 bg-white px-3 text-sm outline-none focus:border-charcoal-900"
          />
        </label>

        {submitError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
        ) : null}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-700/75 transition hover:text-charcoal-900 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            type="button"
            onClick={() => void submitLead()}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-charcoal-900 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brown-900 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get estimate'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {mounted && !isOpen ? (
        <motion.button
          onClick={openChat}
          className="fixed bottom-22 right-5 z-40 inline-flex h-12 items-center gap-3 rounded-full border border-white/15 bg-charcoal-900 px-3.5 pr-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(20,16,13,0.28)] transition hover:-translate-y-0.5 hover:bg-brown-900 hover:shadow-[0_20px_48px_rgba(20,16,13,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal-900"
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          title="Get a free estimate"
          aria-label="Open MIH AI estimate assistant"
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-charcoal-900">
            <MessageCircle className="h-4 w-4" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-charcoal-900 bg-[#25D366]" />
          </span>
          <span className="leading-none">Ask MIH AI</span>
        </motion.button>
      ) : null}

      <AnimatePresence>
        {mounted && isOpen ? (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50"
          >
            <div className="flex h-full w-full items-end justify-end p-3 sm:p-5">
              <motion.div
                initial={prefersReducedMotion ? false : { y: 24, opacity: 0.9, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.24 }}
                className="pointer-events-auto h-[min(82vh,680px)] w-full max-w-107.5 overflow-hidden rounded-xl border border-charcoal-900/10 bg-[#f5f1ef] text-charcoal-900 shadow-[0_24px_80px_rgba(20,16,13,0.28)]"
              >
                <div className="flex h-full flex-col">
                  <header className="border-b border-charcoal-900/10 bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-charcoal-900">MIH AI Design Assistant</p>
                          <p className="text-xs text-charcoal-700/60">Quick estimate in five short steps</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => closeChat('header_close')}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal-900/12 bg-white text-charcoal-700 transition hover:bg-charcoal-900 hover:text-white"
                        aria-label="Close chatbot"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="mx-auto w-full">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={submitted ? 'submitted' : isTyping ? 'typing' : currentStepId}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: 'easeOut' }}
                          className="mx-auto"
                        >
                          {!submitted && !isTyping && (
                            <div className="mb-6">
                              <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-700/65">
                                <span>Step {stepIndex + 1} of {totalSteps}</span>
                                <span>{Math.round(progressPct)}%</span>
                              </div>

                              <div className="relative mb-6">
                                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-charcoal-900/18" />
                                <motion.div
                                  className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-charcoal-900"
                                  initial={false}
                                  animate={{ width: `${progressPct}%` }}
                                  transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: 'easeOut' }}
                                />
                                <div className="relative flex items-center justify-between">
                                  {STEP_IDS.map((stepId, idx) => {
                                    const done = idx < stepIndex
                                    const active = idx === stepIndex
                                    return (
                                      <div key={stepId} className="flex flex-col items-center">
                                        <span
                                          className={`inline-flex h-3 w-3 items-center justify-center rounded-full border transition ${
                                            done
                                              ? 'border-charcoal-900 bg-charcoal-900'
                                              : active
                                                ? 'border-charcoal-900 bg-white'
                                                : 'border-charcoal-900/20 bg-[#d8d2d1]'
                                          }`}
                                        >
                                          {active ? <span className="h-1.5 w-1.5 rounded-full bg-charcoal-900" /> : null}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                                  <Sparkles className="h-3.5 w-3.5" />
                                </div>
                                <div className="rounded-2xl rounded-tl-sm border border-charcoal-900/8 bg-white px-4 py-3 shadow-[0_8px_22px_rgba(20,16,13,0.06)]">
                                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal-700/55">{stepMeta.label}</p>
                                  <h3 className="font-display text-xl leading-tight text-charcoal-900">{stepMeta.title}</h3>
                                </div>
                              </div>
                            </div>
                          )}

                          {renderStep()}

                          {!isTyping && !submitted ? (
                            <p className="mt-4 text-center text-[10px] text-charcoal-700/45">
                              Knowledge {MIH_KNOWLEDGE_VERSION}
                            </p>
                          ) : null}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default function QuoteChatbot() {
  return (
    <Suspense fallback={null}>
      <ChatbotContent />
    </Suspense>
  )
}
