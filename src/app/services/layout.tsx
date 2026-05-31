import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import QuoteChatbot from '@/components/chatbot/QuoteChatbot'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import InstagramButton from '@/components/layout/InstagramButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interior Design Services in Chandigarh | MIH Interiors | Residential & Commercial',
  description: 'Premium interior design services by MIH Interiors Chandigarh. Residential interiors, commercial design, modular kitchen, 3D visualization, and construction. Serving Chandigarh, Mohali & Panchkula.',
  alternates: { canonical: 'https://mihinteriors.in/services' },
  keywords: [
    'interior design services chandigarh', 'residential interior design', 'commercial interior design',
    'modular kitchen design chandigarh', '3d interior visualization', 'home construction chandigarh',
    'interior design packages chandigarh', 'MIH interiors services',
  ],
  openGraph: {
    title: 'Interior Design Services | MIH Interiors Chandigarh',
    description: 'Complete interior design services — residential, commercial, construction & 3D visualization. Chandigarh\'s most trusted firm.',
    url: 'https://mihinteriors.in/services',
    type: 'website',
    images: [{ url: '/services-hero.png', width: 1200, height: 630, alt: 'MIH Interiors Services Chandigarh' }],
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <QuoteChatbot />
      <WhatsAppButton />
      <InstagramButton />
    </div>
  )
}
