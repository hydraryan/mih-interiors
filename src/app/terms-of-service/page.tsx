'use client'

import React from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function TermsOfServicePage() {
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
              Terms of <span className="italic text-brown-600">Service.</span>
            </h1>
            <p className="text-charcoal-500 font-light text-lg max-w-2xl mx-auto">
              The terms and conditions governing your engagement with MIH Interiors and the use of our digital platforms.
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
              
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing our website and engaging with our interior design and architectural services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our site and services.
              </p>

              <h2>2. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Site and all content, including but not limited to 3D visualizations, floor plans, photographs, text, and graphics, are the proprietary property of MIH Interiors. No part of the Site or our portfolio may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, or distributed for any commercial purpose whatsoever, without our express prior written permission.
              </p>

              <h2>3. Interior Design Services</h2>
              <p>
                The information provided on this website regarding our services (Residential, Commercial, Construction & Architecture) constitutes an invitation to treat, not a binding offer. 
              </p>
              <ul className="list-disc pl-6 space-y-2 text-charcoal-600 font-light mb-8">
                <li>Project scopes, timelines, and budgets are preliminary and subject to a formal, signed contract.</li>
                <li>The interactive chatbot and online estimates provide approximate figures based on standard algorithms; actual project costs will vary upon site inspection and material selection.</li>
                <li>We reserve the right to refuse service, terminate engagements, or cancel projects at our sole discretion, subject to the terms of the specific project agreement.</li>
              </ul>

              <h2>4. User Representations</h2>
              <p>
                By using our platform or submitting an inquiry via our contact forms or chatbot, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you have the legal capacity to enter into these Terms of Service.
              </p>

              <h2>5. Modifications and Interruptions</h2>
              <p>
                We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site or services.
              </p>

              <h2>6. Governing Law</h2>
              <p>
                These Terms shall be governed by and defined following the laws of India. MIH Interiors and yourself irrevocably consent that the courts of Chandigarh, India, shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
              </p>

              <h2>7. Contact Information</h2>
              <p>
                To resolve a complaint regarding the Site or to receive further information regarding the use of the Site, please contact us at:
              </p>
              <div className="bg-white p-8 rounded-3xl border border-brown-100 shadow-sm mt-6 not-prose">
                <p className="font-bold text-[10px] uppercase tracking-widest text-brown-600 mb-2">MIH Interiors</p>
                <p className="text-charcoal-600 font-light mb-1">MIH INTERIORS SCO - 62-63 , 3rd Floor , Sector 17 A , Near Oyster Hotel CHANDIGARH, Chandigarh 160017</p>
                <p className="text-charcoal-600 font-light">Email: miharchitect@gmail.com</p>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
