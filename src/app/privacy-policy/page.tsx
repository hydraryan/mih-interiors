'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026"

  return (
    <div className="min-h-screen bg-[#fbf4eb] text-charcoal-900 selection:bg-brown-200">
      
      {/* HEADER SECTION */}
      <section className="pt-40 pb-20 px-6 md:pt-56 md:pb-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fbf4eb] z-20" />
        
        <div className="max-w-4xl mx-auto relative z-30 text-center">
          <ScrollReveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600 mb-6">Legal & Compliance</p>
            <h1 className="font-display text-5xl md:text-7xl leading-tight tracking-tighter text-charcoal-900 mb-8">
              Privacy <span className="italic text-brown-600">Policy.</span>
            </h1>
            <p className="text-charcoal-500 font-light text-lg max-w-2xl mx-auto">
              We respect your privacy and are committed to protecting the personal information you share with us.
            </p>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-charcoal-400">
              Last Updated: {lastUpdated}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="prose prose-lg prose-headings:font-display prose-headings:font-normal prose-headings:text-charcoal-900 prose-p:text-charcoal-600 prose-p:font-light prose-p:leading-relaxed prose-a:text-brown-600 prose-a:no-underline hover:prose-a:underline max-w-none">
              
              <h2>1. Introduction</h2>
              <p>
                Welcome to MIH Interiors ("we," "our," or "us"). We understand that confidentiality and discretion are paramount when designing your personal and professional spaces. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our services in Chandigarh, Punjab, and across North India.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We collect information that you voluntarily provide to us when expressing an interest in obtaining information about us or our interior design services. The personal information we collect may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-charcoal-600 font-light mb-8">
                <li><strong>Contact Details:</strong> Names, phone numbers, email addresses, and location data (city).</li>
                <li><strong>Project Specifics:</strong> Information regarding your property, floor plans, budget ranges, and design preferences.</li>
                <li><strong>Communication Records:</strong> Messages sent via our contact forms, chatbot, or direct emails.</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>
                We use the personal information collected to direct our architectural and interior design processes. Specifically, we use your data to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-charcoal-600 font-light mb-8">
                <li>Facilitate project consultations and provide accurate design quotes.</li>
                <li>Communicate with you regarding project updates, site visits, and material selections.</li>
                <li>Improve our website, portfolio presentation, and customer service experience.</li>
                <li>Send administrative information, such as changes to our terms, conditions, and policies.</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. While we strive to protect your personal information, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
              </p>

              <h2>5. Sharing Your Information</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted vendors and contractors (e.g., carpenters, material suppliers, civil workers) strictly for the purpose of executing your interior design project, and only with your prior consent.
              </p>

              <h2>6. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, you may contact our design studio at:
              </p>
              <div className="bg-white p-8 rounded-3xl border border-brown-100 shadow-sm mt-6 not-prose">
                <p className="font-bold text-[10px] uppercase tracking-widest text-brown-600 mb-2">MIH Interiors</p>
                <p className="text-charcoal-600 font-light mb-1">MIH INTERIORS SCO - 62-63 , 3rd Floor , Sector 17 A , Near Oyster Hotel CHANDIGARH, Chandigarh 160017</p>
                <p className="text-charcoal-600 font-light mb-1">Email: miharchitect@gmail.com</p>
                <p className="text-charcoal-600 font-light">Phone: +91 98885 45403</p>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
