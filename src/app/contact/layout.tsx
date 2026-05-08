import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import QuoteChatbot from '@/components/chatbot/QuoteChatbot'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import InstagramButton from '@/components/layout/InstagramButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact MIH Interiors | Interior Designer Chandigarh | +91 6399936333',
  description: 'Contact MIH Interiors for free interior design consultation in Chandigarh. Call +91 6399936333. Visit SCO 62-63, Sector 17A, Chandigarh.',
  alternates: { canonical: 'https://mihinteriors.in/contact' },
  openGraph: {
    title: 'Contact MIH Interiors | Free Consultation',
    description: 'Book your free interior design consultation in Chandigarh.',
    url: 'https://mihinteriors.in/contact',
    images: [{ url: '/contact-hero.png', width: 1200, height: 630, alt: 'MIH Interiors Contact' }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact MIH Interiors',
            url: 'https://mihinteriors.in/contact',
            mainEntity: {
              '@type': 'InteriorDesigner',
              name: 'MIH Interiors',
              telephone: '+91 6399936333',
              email: 'info@mihinteriors.in',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'SCO 62-63, 3rd Floor, Sector 17A, Near Oyster Hotel',
                addressLocality: 'Chandigarh',
                postalCode: '160017',
                addressCountry: 'IN',
              },
              openingHours: 'Mo-Sa 10:00-19:00',
            },
          }),
        }}
      />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <QuoteChatbot />
      <WhatsAppButton />
      <InstagramButton />
    </div>
  )
}
