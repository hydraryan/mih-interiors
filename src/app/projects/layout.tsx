import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import QuoteChatbot from '@/components/chatbot/QuoteChatbot'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interior Design Portfolio | MIH Interiors Chandigarh | 1000+ Projects',
  description: 'Explore MIH Interiors\' portfolio of 1000+ luxury interior design projects in Chandigarh, Mohali & Panchkula. Residential villas, commercial offices, modular kitchens. View completed projects.',
  alternates: { canonical: 'https://mihinteriors.in/projects' },
  keywords: [
    'interior design portfolio chandigarh', 'MIH interiors portfolio', 'interior design projects chandigarh',
    'luxury interior design chandigarh', 'residential interior projects mohali', 'commercial interior projects chandigarh',
  ],
  openGraph: {
    title: 'Interior Design Portfolio | MIH Interiors | 1000+ Completed Projects',
    description: 'View stunning interior design transformations by MIH Interiors across Chandigarh Tricity.',
    url: 'https://mihinteriors.in/projects',
    images: [{ url: '/projects-hero.png', width: 1200, height: 630, alt: 'MIH Interiors Portfolio Chandigarh' }],
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'MIH Interiors Portfolio — Chandigarh Interior Design Projects',
            url: 'https://mihinteriors.in/projects',
            description: 'Portfolio of 1000+ interior design projects by MIH Interiors in Chandigarh.',
            publisher: {
              '@type': 'InteriorDesigner',
              name: 'MIH Interiors',
              url: 'https://mihinteriors.in',
            },
          }),
        }}
      />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <QuoteChatbot />
      <WhatsAppButton />
    </div>
  )
}
