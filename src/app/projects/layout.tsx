import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import QuoteChatbot from '@/components/chatbot/QuoteChatbot'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio | MIH Interiors - Modern Legacies & Interior Design',
  description: 'Explore the portfolio of MIH Interiors. A showcase of luxury residential and commercial interior design projects across Chandigarh, Punjab, and North India.',
  openGraph: {
    title: 'MIH Interiors Portfolio',
    description: 'Bespoke interior design masterpieces. Discover our latest residential and commercial transformations.',
    images: ['/projects-hero.png'],
  },
}

export default function ProjectsLayout({
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
