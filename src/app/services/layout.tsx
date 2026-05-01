import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import QuoteChatbot from '@/components/chatbot/QuoteChatbot'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | MIH Interiors - Luxury Design & Build Solutions',
  description: 'Bespoke interior design services. From luxury residential transformations to high-end commercial spaces, we provide end-to-end design-build solutions in Chandigarh and across North India.',
  openGraph: {
    title: 'MIH Interiors Services',
    description: 'Expert interior design, 3D visualization, and turnkey project management. Tailored solutions for your unique lifestyle.',
    images: ['/services-hero.png'],
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
    </div>
  )
}
