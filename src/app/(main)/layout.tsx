import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import QuoteChatbot from "@/components/chatbot/QuoteChatbot";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <QuoteChatbot />
      <WhatsAppButton />
      <Footer />
    </>
  );
}
