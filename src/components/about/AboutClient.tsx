"use client"

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Home,
  PenTool,
  Ruler,
} from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface TeamMember {
  _id: string
  name: string
  designation: string
  image: string
}

interface AboutClientProps {
  images: {
    hero: string
    vision: string
    visionDetail: string
    craft: string
    materials: string
    founder: string
  }
  teamMembers: TeamMember[]
}

const stats = [
  { value: '18+', label: 'years shaping interiors' },
  { value: '1000+', label: 'projects delivered' },
  { value: '2007', label: 'studio established' },
  { value: 'Tricity', label: 'Chandigarh, Mohali, Panchkula' },
]

const services = [
  {
    icon: Home,
    title: 'Homes',
    text: 'Apartments, villas, kothis, kitchens, wardrobes, lighting, and complete residential execution.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Workspaces',
    text: 'Offices, retail spaces, hospitality corners, and commercial interiors planned for daily use.',
  },
  {
    icon: PenTool,
    title: 'Visualization',
    text: '3D design, material direction, site detailing, and decisions clients can understand before work begins.',
  },
]

const process = [
  {
    title: 'Read the space',
    text: 'We study movement, light, storage, family routines, and the way each room needs to support real life.',
  },
  {
    title: 'Shape the direction',
    text: 'Plans, mood, materials, and 3D views come together so the design feels clear before execution begins.',
  },
  {
    title: 'Build with control',
    text: 'Site work, vendor coordination, joinery, finishes, and handover are tracked with the original design intent in mind.',
  },
]

const values = [
  'Architecture-led planning',
  'Warm, durable material palettes',
  'Transparent design decisions',
  'Founder-guided execution',
]

export default function AboutClient({ images, teamMembers = [] }: AboutClientProps) {
  const visibleTeam = teamMembers.length > 0
    ? teamMembers
    : [
        {
          _id: 'founder-fallback',
          name: 'Ar. Mohit Mahajan',
          designation: 'Founder & Principal Architect',
          image: images.founder,
        },
      ]

  return (
    <div className="overflow-x-hidden bg-[#f6f1e8] text-charcoal-900 selection:bg-amber-300 selection:text-charcoal-900">
      <section className="relative min-h-svhflow-hidden bg-[#f6f1e8]">
        <Image
          src={images.vision}
          alt="Bright modern interior designed by MIH Interiors"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#fbf7ef]/96 via-[#fbf7ef]/76 to-[#fbf7ef]/10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#f6f1e8] via-transparent to-white/56" />

        <div className="relative z-10 mx-auto flex min-h-svh max-w-375 flex-col justify-center px-5 pb-6 pt-30 sm:px-8 sm:pt-32 lg:px-12">
          <ScrollReveal className="max-w-4xl pb-5 md:pb-6">
            <p className="mb-4 inline-flex border-b border-brown-900/20 pb-2 text-sm font-bold text-brown-800">
              About MIH Interiors
            </p>
            <h1 className="font-display text-5xl leading-[0.98] text-brown-900 sm:text-6xl md:text-7xl lg:text-[5.8rem] xl:text-[6.35rem]">
              Design that lives beautifully.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-charcoal-900/76 md:text-xl md:leading-9">
              MIH Interiors is a Chandigarh studio creating calm, functional, deeply finished homes and workspaces since 2007.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/projects"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-charcoal-900 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-charcoal-900/12 transition-colors hover:bg-brown-900"
              >
                View projects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-charcoal-900/16 bg-white/74 px-7 py-3 text-sm font-bold text-charcoal-900 shadow-sm backdrop-blur-md transition-colors hover:bg-white"
              >
                Start a conversation
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="grid overflow-hidden rounded-2xl border border-charcoal-900/10 bg-white/82 shadow-2xl shadow-charcoal-900/8 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border-charcoal-900/10 px-5 py-4 sm:border-r last:border-r-0">
                  <p className="font-display text-3xl leading-none text-brown-900 md:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-sm leading-5 text-charcoal-900/58">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#f6f1e8] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
        <div className="mx-auto grid max-w-350 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <ScrollReveal className="space-y-7">
            <p className="text-sm font-semibold text-amber-700">What makes the studio different</p>
            <h2 className="max-w-2xl font-display text-5xl leading-tight text-brown-900 md:text-6xl">
              We treat interiors as architecture people live inside every day.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-charcoal-800/78">
              MIH Interiors was founded by Ar. Mohit Mahajan with a simple standard: the design should be beautiful, but it should also make daily life easier. Our work balances planning, storage, materials, light, execution, and the quiet details that decide whether a space still feels good years later.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" className="grid gap-4 md:grid-cols-2">
            <div className="relative min-h-105 overflow-hidden rounded-lg bg-charcoal-900 md:min-h-140">
              <Image
                src={images.hero}
                alt="MIH Interiors vision for refined interior design"
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div className="relative min-h-62.5 overflow-hidden rounded-lg bg-charcoal-900 md:min-h-82.5">
                <Image
                  src={images.visionDetail}
                  alt="Interior detail and material planning"
                  fill
                  sizes="(min-width: 1024px) 22vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="rounded-lg bg-charcoal-900 p-7 text-white">
                <Ruler className="h-7 w-7 text-amber-300" />
                <p className="mt-8 font-display text-3xl leading-tight">
                  The best rooms feel effortless because every inch has already been argued with.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white px-5 py-18 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-350">
          <ScrollReveal className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-700">Design scope</p>
              <h2 className="mt-3 max-w-3xl font-display text-5xl leading-tight text-brown-900 md:text-6xl">
                Designed for real homes, real teams, and real handovers.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-charcoal-800/70">
              One studio for concept, visualization, material direction, and execution support.
            </p>
          </ScrollReveal>

          <div className="grid gap-px overflow-hidden rounded-lg bg-charcoal-900/12 md:grid-cols-3">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.05} className="bg-white p-7 md:p-8">
                <service.icon className="h-7 w-7 text-amber-600" />
                <h3 className="mt-8 font-display text-3xl text-brown-900">{service.title}</h3>
                <p className="mt-4 text-base leading-7 text-charcoal-800/72">{service.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#20221d] px-5 py-20 text-white sm:px-8 md:py-28 lg:px-12">
        <div className="mx-auto grid max-w-350 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <ScrollReveal className="relative min-h-130 overflow-hidden rounded-lg bg-charcoal-900">
            <Image
              src={images.craft}
              alt="Craft and finishing by MIH Interiors"
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-charcoal-900/60 via-transparent to-transparent" />
          </ScrollReveal>

          <ScrollReveal direction="left" className="space-y-8">
            <div>
              <p className="text-sm font-semibold text-amber-300">Our process</p>
              <h2 className="mt-3 font-display text-5xl leading-tight md:text-6xl">
                Clear decisions before the site gets noisy.
              </h2>
            </div>
            <div className="space-y-7">
              {process.map((step, index) => (
                <div key={step.title} className="grid gap-4 border-t border-white/14 pt-6 sm:grid-cols-[4rem_1fr]">
                  <p className="font-display text-4xl text-amber-300">0{index + 1}</p>
                  <div>
                    <h3 className="font-display text-3xl">{step.title}</h3>
                    <p className="mt-2 text-base leading-7 text-white/70">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#f6f1e8] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
        <div className="mx-auto grid max-w-350 gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <ScrollReveal className="relative min-h-140 overflow-hidden rounded-lg bg-charcoal-900">
            <Image
              src={images.founder}
              alt="Ar. Mohit Mahajan, founder of MIH Interiors"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-charcoal-900/78 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <p className="text-sm text-white/66">Founder & Principal Architect</p>
              <p className="mt-1 font-display text-4xl">Ar. Mohit Mahajan</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold text-amber-700">Founder-led studio</p>
              <h2 className="max-w-3xl font-display text-5xl leading-tight text-brown-900 md:text-6xl">
                The same eye that sets the concept stays close to the final detail.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-charcoal-800/78">
                Ar. Mohit Mahajan guides the studio with an architectural lens, bringing proportion, planning, and construction awareness into each project. The result is design that looks polished without losing its practicality.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value} className="flex items-center gap-3 border-t border-charcoal-900/12 py-4">
                  <Check className="h-5 w-5 shrink-0 text-amber-700" />
                  <p className="text-base font-semibold text-charcoal-900">{value}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white px-5 py-18 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-350">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="text-sm font-semibold text-amber-700">Team</p>
            <h2 className="mt-3 font-display text-5xl leading-tight text-brown-900 md:text-6xl">
              A focused team, built around close attention.
            </h2>
            <p className="mt-5 text-lg leading-8 text-charcoal-800/72">
              We keep the project team close enough for decisions to stay sharp, communication to stay clear, and execution to stay aligned with the design.
            </p>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleTeam.map((member, index) => (
              <ScrollReveal key={member._id} delay={index * 0.05} className="group overflow-hidden rounded-lg bg-[#f6f1e8]">
                <div className="relative aspect-4/5 overflow-hidden bg-charcoal-900/10">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1280px) 23vw, (min-width: 640px) 48vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-sm leading-6 text-charcoal-800/58">{member.designation}</p>
                  <h3 className="mt-1 font-display text-3xl leading-tight text-brown-900">{member.name}</h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal-900 px-5 py-20 text-white sm:px-8 md:py-28 lg:px-12">
        <Image
          src={images.materials}
          alt="Materials and finishes selected by MIH Interiors"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-charcoal-900/72" />
        <ScrollReveal className="relative z-10 mx-auto grid max-w-350 gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <BadgeCheck className="mb-8 h-9 w-9 text-amber-300" />
            <h2 className="max-w-4xl font-display text-5xl leading-tight md:text-7xl">
              Ready to shape a space with more clarity?
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Bring us the site, the routine, the budget, and the feeling you want. We will help translate it into a designed, buildable direction.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-7 py-4 text-sm font-bold text-charcoal-900 transition-colors hover:bg-amber-300"
          >
            Talk to MIH
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  )
}
