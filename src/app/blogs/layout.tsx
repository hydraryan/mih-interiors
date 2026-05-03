import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import QuoteChatbot from "@/components/chatbot/QuoteChatbot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Interior Design Blog | Tips, Trends & Guides | MIH Interiors Chandigarh',
  description: 'Interior design tips, cost guides, Vastu advice, and trends from MIH Interiors\' expert team in Chandigarh. Learn about modular kitchens, false ceilings, 3D design, and home renovation.',
  alternates: { canonical: 'https://mihinteriors.in/blogs' },
  keywords: [
    'interior design blog chandigarh', 'interior design tips india', 'home renovation guide chandigarh',
    'modular kitchen cost chandigarh', 'interior design trends 2024', 'vastu interior design',
    'false ceiling design ideas', 'MIH interiors blog',
  ],
  openGraph: {
    title: 'Interior Design Blog | MIH Interiors Chandigarh',
    description: 'Expert interior design insights, cost guides, and trends from Chandigarh\'s top interior design firm.',
    url: 'https://mihinteriors.in/blogs',
    type: 'website',
    images: [{ url: '/blog-hero.png', width: 1200, height: 630, alt: 'MIH Interiors Design Blog' }],
  },
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <QuoteChatbot />
      <WhatsAppButton />
      <Footer />
    </>
  );
}
