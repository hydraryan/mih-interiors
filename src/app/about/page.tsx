import type { Metadata } from 'next'
import AboutClient from '@/components/about/AboutClient'
import { getActiveMediaMap } from '@/lib/media'
import dbConnect from '@/lib/mongodb'
import TeamMember from '@/lib/models/TeamMember'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'About MIH Interiors | Ar. Mohit Mahajan | Best Interior Designer Chandigarh',
  description: 'Learn about MIH Interiors, founded by Ar. Mohit Mahajan in 2007. 18+ years of premium interior design in Chandigarh, Mohali, and Panchkula with 1000+ projects completed.',
  alternates: { canonical: 'https://mihinteriors.in/about' },
  keywords: [
    'Ar Mohit Mahajan', 'MIH Interiors founder', 'interior designer chandigarh',
    'about MIH interiors', 'best interior designer chandigarh', 'MIH interiors history',
  ],
  openGraph: {
    title: 'About MIH Interiors | Ar. Mohit Mahajan | Interior Designer Chandigarh',
    description: 'Meet the team behind Chandigarh\'s trusted interior design studio. 18+ years of practice and 1000+ projects delivered.',
    url: 'https://mihinteriors.in/about',
    type: 'website',
    images: [{ url: '/about-hero.png', width: 1200, height: 630, alt: 'MIH Interiors Team' }],
  },
}

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About MIH Interiors',
  url: 'https://mihinteriors.in/about',
  description: 'MIH Interiors was founded by Ar. Mohit Mahajan in 2007 in Chandigarh, India.',
  mainEntity: {
    '@type': 'InteriorDesigner',
    name: 'MIH Interiors',
    founder: {
      '@type': 'Person',
      name: 'Mohit Mahajan',
      honorificPrefix: 'Ar.',
      jobTitle: 'Founder & Principal Architect',
      worksFor: { '@type': 'Organization', name: 'MIH Interiors' },
    },
    foundingDate: '2007',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 25 },
    areaServed: ['Chandigarh', 'Mohali', 'Panchkula', 'Punjab'],
  },
}

export default async function AboutPage() {
  await dbConnect()

  const [media, teamMembers] = await Promise.all([
    getActiveMediaMap(),
    TeamMember.find({ isActive: true }).sort({ order: 1 }).lean(),
  ])

  const images = {
    hero: media.resolve('/about-hero.png'),
    vision: media.resolve('/about-vision.png'),
    visionDetail: media.resolve('/about-vision-detail.png'),
    craft: media.resolve('/about-craft.png'),
    materials: media.resolve('/about-materials.png'),
    founder: media.resolve('/about-founder.png'),
  }

  const plainTeamMembers = JSON.parse(JSON.stringify(teamMembers))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <AboutClient images={images} teamMembers={plainTeamMembers} />
    </>
  )
}
