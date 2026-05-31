import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import QuoteChatbot from '@/components/chatbot/QuoteChatbot'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import InstagramButton from '@/components/layout/InstagramButton'

export default function PrivacyPolicyLayout({
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
