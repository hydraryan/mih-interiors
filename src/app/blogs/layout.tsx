import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import QuoteChatbot from "@/components/chatbot/QuoteChatbot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interior Design Wisdom & Trends | MIH Interiors Blog",
  description: "Explore the latest in luxury interior design, cost guides, and Vastu tips for Indian homes from the experts at MIH Interiors.",
};

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
