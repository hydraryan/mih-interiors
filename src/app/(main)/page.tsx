import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import ServicesGrid from '@/components/home/ServicesGrid'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import ProcessSection from '@/components/home/ProcessSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTABanner from '@/components/home/CTABanner'
import { getActiveMediaMap } from '@/lib/media'
import dbConnect from '@/lib/mongodb'
import Service from '@/lib/models/Service'

export const metadata: Metadata = {
  title: 'Best Interior Designer in Chandigarh | MIH Interiors | 18+ Years | 1000+ Projects',
  description: 'MIH Interiors — Chandigarh\'s #1 rated interior design firm. Residential & commercial interiors, modular kitchen, 3D visualization. 18+ years, 1000+ projects across Chandigarh, Mohali & Panchkula. Book free consultation with Ar. Mohit Mahajan.',
  alternates: {
    canonical: 'https://mihinteriors.in',
  },
  openGraph: {
    title: 'MIH Interiors | Best Interior Designer in Chandigarh | Free Consultation',
    description: 'Transform your home with MIH Interiors — 18 years of luxury interior design in Chandigarh. 1000+ projects, 5-star rated. Residential, commercial, modular kitchen & construction.',
    url: 'https://mihinteriors.in',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MIH Interiors — Best Interior Designer Chandigarh',
      },
    ],
  },
}

export default async function Home() {
  await dbConnect()
  const [media, homepageServices] = await Promise.all([
    getActiveMediaMap(),
    Service.find({ showOnHomepage: true }).sort({ order: 1 }).lean()
  ])

  // Map images for both fallback and dynamic services
  const serviceImages = [
    '/services-residential.jpg',
    '/services-commercial.jpg',
    '/services-3d.jpg',
    '/services-construction.jpg',
    ...homepageServices.map(s => s.hero?.image).filter(Boolean)
  ]
  const imageMap = Object.fromEntries(
    serviceImages.map((image) => [image, media.resolve(image)]),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Who is the best interior designer in Chandigarh?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'MIH Interiors, led by Ar. Mohit Mahajan, is widely regarded as the best interior design firm in Chandigarh with 18+ years of experience and 1000+ completed projects across the Tricity region.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the cost of interior design in Chandigarh?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Interior design costs in Chandigarh range from Rs. 5.5L to Rs. 35L+ depending on home size and finish quality. MIH Interiors offers Essential, Premium, and Luxury packages with transparent pricing.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does MIH Interiors provide 3D visualization?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, every MIH Interiors project starts with comprehensive 3D visualization so clients can see and approve the design before any on-site work begins.',
                },
              },
              {
                '@type': 'Question',
                name: 'Which areas does MIH Interiors serve?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'MIH Interiors serves Chandigarh, Mohali, Panchkula, Zirakpur, and surrounding Punjab regions.',
                },
              },
              {
                '@type': 'Question',
                name: 'How to contact MIH Interiors?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Call +91-98885-45403, email miharchitect@gmail.com, or visit the office at SCO 62-63, 3rd Floor, Sector 17A, Chandigarh 160017.',
                },
              },
            ],
          }),
        }}
      />
      <HeroSection imageSrc={media.resolve('/hero_image.jpg')} />
      <ServicesGrid 
        imageMap={imageMap} 
        initialServices={JSON.parse(JSON.stringify(homepageServices))} 
      />
      <FeaturedProjects />
      <ProcessSection />
      <TestimonialsSection />
      <CTABanner imageSrc={media.resolve('/commercial-sites-photos/2.jpeg')} />
    </>
  )
}
