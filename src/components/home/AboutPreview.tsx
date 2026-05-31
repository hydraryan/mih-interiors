import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'
import Link from 'next/link'

export default function AboutPreview() {
  return (
    <section className="bg-cream-100 py-32 px-8 border-b border-cream-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        <div className="lg:w-1/2">
          <ScrollReveal>
            <span className="font-body text-blush-400 text-sm uppercase tracking-widest block mb-4">Our Story</span>
            <h2 className="font-display text-5xl text-brown-800 mb-8 leading-tight">
              Crafting Spaces That Speak Your Legacy.
            </h2>
            <p className="font-body text-charcoal-800 mb-6 text-lg leading-relaxed">
              Established in 2007 by Ar. Mohit Mahajan, MIH Interiors has transformed over 500 spaces across Chandigarh, Punjab, and North India.
            </p>
            <p className="font-body text-charcoal-800 mb-10 text-lg leading-relaxed">
              We believe in transparency. That's why every project comes with a hyper-realistic 3D visualization, ensuring there are zero surprises during execution. 
            </p>
            
            <div className="flex gap-4">
              <Link 
                href="/about" 
                className="bg-brown-800 text-cream-100 px-8 py-4 font-body uppercase tracking-wider hover:bg-brown-900 transition-colors"
              >
                More About Us
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:w-1/2 relative h-[600px] w-full">
          <ScrollReveal direction="scale" className="h-full w-full relative">
            <div className="absolute inset-0 bg-brown-800 translate-x-4 translate-y-4" />
            <div className="absolute inset-0 bg-cream-200 border border-brown-200 flex items-center justify-center">
              {/* Fallback pattern while missing an image */}
              <div className="text-center p-8">
                <span className="font-display text-2xl text-brown-800 opacity-50 block mb-2">Mohit Mahajan</span>
                <span className="font-body text-charcoal-800 opacity-50 block">Founder & Principal Designer</span>
              </div>
            </div>
            {/* If there was an image: 
            <Image 
              src="/images/mohit-mahajan.jpg" 
              alt="Mohit Mahajan"
              fill
              className="object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
            />
            */}
          </ScrollReveal>
        </div>

      </div>
    </section>
  )
}
