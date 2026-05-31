/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import OpenQuoteLink from '@/components/services/OpenQuoteLink';
import dbConnect from "@/lib/mongodb";
import Service from "@/lib/models/Service";
import Project from "@/lib/models/Project";
import { getActiveMediaMap } from "@/lib/media";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ServiceProjectsClient from "@/components/services/ServiceProjectsClient";
import { buildServiceQuoteHref, buildStartsFromLabel } from "@/lib/services/pricing";
import { 
  ChefHat, Sofa, Bed, Cpu, 
  Briefcase, ShoppingBag, Utensils, Activity,
  CheckCircle2, ArrowRight, Sparkles, Plus, Ruler, Heart, Zap, Home, PenTool
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

const iconMap: Record<string, any> = {
  ChefHat, Sofa, Bed, Cpu, 
  Briefcase, ShoppingBag, Utensils, Activity, Ruler, Heart, Zap, Home, PenTool, Sparkles
};

async function getService(slug: string) {
  await dbConnect();
  return Service.findOne({ slug, publishStatus: 'published' }).lean();
}

async function getVisibleService(slug: string) {
  const [service, media] = await Promise.all([getService(slug), getActiveMediaMap()]);
  if (!service) return null;

  return {
    ...service,
    hero: {
      ...service.hero,
      image: media.resolve(service.hero?.image),
    },
    seo: {
      ...service.seo,
      ogImage: media.resolve(service.seo?.ogImage || service.hero?.image),
    },
    sections: (service.sections || []).map((section: any) => {
      if (section.type !== 'text_image' || !section.content?.image) return section;

      return {
        ...section,
        content: {
          ...section.content,
          image: media.resolve(section.content.image),
        },
      };
    }),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const service = await getVisibleService(resolvedParams.slug)
  if (!service) return { title: 'Service Not Found | MIH Interiors' }

  const serviceKeywordMap: Record<string, string[]> = {
    'residential-interiors': [
      'residential interior design chandigarh', 'home interior chandigarh', '3bhk interior design chandigarh',
      'modular kitchen chandigarh', 'bedroom interior design chandigarh',
    ],
    'commercial-interiors': [
      'commercial interior design chandigarh', 'office interior design chandigarh',
      'retail interior design chandigarh', 'restaurant interior chandigarh',
    ],
    'construction-architecture': [
      'construction company chandigarh', 'architects chandigarh', 'villa construction chandigarh',
      'kothi construction chandigarh', 'home construction chandigarh',
    ],
    architecture: [
      'house front design chandigarh', 'front elevation design chandigarh', 'home facade design chandigarh',
      'villa elevation design', 'residential architecture chandigarh',
    ],
  }

  const keywords = serviceKeywordMap[resolvedParams.slug] || [
    'interior design chandigarh', 'MIH interiors', service.title,
  ]

  const canonicalUrl = `https://mihinteriors.in/services/${resolvedParams.slug}`
  const title = `${service.title} in Chandigarh | MIH Interiors | Best ${service.title}`
  const description = service.seo?.description ||
    `${service.title} by MIH Interiors Chandigarh. 18+ years experience, 1000+ projects. Expert ${service.title.toLowerCase()} services in Chandigarh, Mohali & Panchkula. Free consultation.`

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: service.seo?.ogImage || service.hero?.image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${service.title} in Chandigarh — MIH Interiors`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [service.seo?.ogImage || service.hero?.image || '/og-image.jpg'],
    },
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const service = await getVisibleService(resolvedParams.slug);
  if (!service) notFound();

  // Determine the best premium hero image based on the service domain
  const getPremiumHero = (slug: string) => {
    if (slug === 'architecture') return service.hero?.image || "/services-hero.png";
    if (slug.includes('residential')) return "/res-hero.png";
    if (slug.includes('commercial')) return "/com-hero.png";
    if (slug.includes('construction') || slug.includes('architecture')) return "/arch-hero.png";
    return service.hero?.image || "/services-hero.png";
  };

  const heroImage = getPremiumHero(resolvedParams.slug);

  // Ensure Construction + Interiors has a feature grid
  if (resolvedParams.slug === 'construction-architecture') {
    const hasFeatureGrid = service.sections?.some((s: any) => s.type === 'feature_grid');
    if (!hasFeatureGrid) {
      if (!service.sections) service.sections = [];
      service.sections.unshift({
        type: 'feature_grid',
        title: 'Construction & Architecture Solutions',
        subtitle: 'From foundation to finishing, we provide comprehensive solutions for your dream project.',
        content: [
          { title: 'Structural Design', desc: 'Robust engineering for safety and longevity.', icon: 'Activity' },
          { title: '3D Planning', desc: 'Photorealistic visualizations before construction begins.', icon: 'Cpu' },
          { title: 'Material Selection', desc: 'Premium materials sourced for durability and aesthetics.', icon: 'ShoppingBag' },
          { title: 'Project Management', desc: 'End-to-end execution with strict timelines.', icon: 'Briefcase' }
        ]
      });
    }
  }

  // 1. Fetch related projects based on slug
  let projectQuery: any = {};
  if (resolvedParams.slug === 'residential-interiors') {
    projectQuery.type = 'Residential';
  } else if (resolvedParams.slug === 'commercial-interiors') {
    projectQuery.type = 'Commercial';
  } else {
    // For construction and architecture, fetch all or featured
    projectQuery.featured = true;
  }
  
  const [projectsData, media] = await Promise.all([
    Project.find(projectQuery).sort({ order: 1, createdAt: -1 }).lean(),
    getActiveMediaMap(),
  ]);

  const relatedProjects = projectsData
    .map((p) => {
      const images = media.filter(p.images || []);
      const mainImage = media.isVisible(p.mainImage)
        ? p.mainImage
        : images[0] || media.resolve(p.mainImage);

      return {
        ...p,
        _id: p._id.toString(), // Convert ObjectId to string for client component
        mainImage,
        images: images.length ? images : [mainImage].filter(Boolean),
      };
    })
    .filter((p) => p.mainImage)
    .slice(0, 6); // Limit to 6 projects

  const getFeatureImage = (title: string, index: number) => {
    const t = (title || '').toLowerCase();
    if (t.includes('kitchen')) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('living')) return 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('suite') || t.includes('bed')) return 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('smart') || t.includes('tech')) return 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('office') || t.includes('corporate')) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('retail') || t.includes('store')) return 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('restaurant') || t.includes('cafe')) return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('health') || t.includes('clinic')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('elevation') || t.includes('front')) return 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('facade') || t.includes('material')) return 'https://images.unsplash.com/photo-1541888086225-f6740f9e8020?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('gate') || t.includes('boundary')) return 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('3d') || t.includes('plan')) return 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('structure') || t.includes('design')) return 'https://images.unsplash.com/photo-1541888086225-f6740f9e8020?auto=format&fit=crop&q=80&w=1200';
    if (t.includes('management') || t.includes('project')) return 'https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&q=80&w=1200';
    
    const fallbacks = [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&q=80&w=1200",
    ];
    return fallbacks[index % fallbacks.length];
  };

  return (
    <div className="min-h-screen bg-[#fbf4eb] text-charcoal-900 font-body selection:bg-brown-200 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.shortDescription,
            provider: {
              '@type': 'InteriorDesigner',
              name: 'MIH Interiors',
              url: 'https://mihinteriors.in',
              telephone: '+91 6399936333',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'SCO 62-63, 3rd Floor, Sector 17A',
                addressLocality: 'Chandigarh',
                postalCode: '160017',
                addressCountry: 'IN',
              },
            },
            areaServed: ['Chandigarh', 'Mohali', 'Panchkula', 'Punjab'],
            url: `https://mihinteriors.in/services/${service.slug}`,
            image: service.hero?.image,
            ...(service.faqs && service.faqs.length > 0 ? {
              mainEntity: {
                '@type': 'FAQPage',
                mainEntity: service.faqs.map((faq: { question: string; answer: string }) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              },
            } : {}),
          }),
        }}
      />
      {/* CHAPTER 1: THE DOMAIN (Hero) */}
      <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/20 z-10" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#fbf4eb] z-20" />
          <Image 
            src={heroImage}
            alt={service.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-30 text-center px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center">
              <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-charcoal-900/10 bg-white/50 px-6 py-2.5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-brown-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal-700">{service.category} Expertise</span>
              </div>
              
              <h1 className="font-display text-7xl md:text-[11rem] leading-[0.8] text-charcoal-900 tracking-tighter">
                {service.title.split(' ')[0]} <br />
                <span className="italic text-brown-600">{service.title.split(' ').slice(1).join(' ') || 'Solutions'}</span>
              </h1>
              
              <p className="mt-12 max-w-2xl text-lg md:text-2xl leading-relaxed text-charcoal-500 font-light">
                {service.shortDescription}
              </p>

              <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
                <OpenQuoteLink href={buildServiceQuoteHref(`/services/${service.slug}`, service.slug)} className="inline-flex items-center gap-3 rounded-full bg-charcoal-900 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.26em] text-white transition-colors hover:bg-brown-900">
                  <Plus className="h-4 w-4" />
                  {buildStartsFromLabel(service.startingPrice)}
                </OpenQuoteLink>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal-400">
                  Opens the quote chatbot with this service preselected
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CHAPTER 2: THE ANATOMY (Dynamic Sections) */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-32 md:py-48 space-y-48">
        {service.sections?.map((section: any, idx: number) => (
          <section key={idx}>
            
            {/* Feature Grid: The Fine Points */}
            {section.type === 'feature_grid' && (
              <ScrollReveal>
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-charcoal-900/10 pb-16">
                  <div className="max-w-2xl space-y-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">The Anatomy</span>
                    <h2 className="font-display text-5xl md:text-6xl text-charcoal-900 leading-tight">{section.title}</h2>
                  </div>
                  <p className="font-body text-charcoal-500 max-w-sm text-sm font-light leading-relaxed">{section.subtitle}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                  {section.content?.map((item: any, i: number) => {
                    const Icon = iconMap[item.icon] || CheckCircle2;
                    const imageSrc = getFeatureImage(item.title, i);
                    
                    const getGridClasses = (index: number) => {
                      if (index === 0) return 'md:col-span-8 md:row-span-1 h-[50vh] md:h-[60vh]';
                      if (index === 1) return 'md:col-span-4 md:row-span-2 h-[50vh] md:h-auto';
                      if (index === 2) return 'md:col-span-4 md:row-span-1 h-[50vh] md:h-[45vh]';
                      if (index === 3) return 'md:col-span-4 md:row-span-1 h-[50vh] md:h-[45vh]';
                      return 'md:col-span-4 h-[40vh]';
                    };
                    
                    return (
                      <div key={i} className={`group relative rounded-3xl overflow-hidden ${getGridClasses(i)}`}>
                        {/* Background Image */}
                        <Image 
                          src={imageSrc} 
                          alt={item.title} 
                          fill 
                          className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-charcoal-900/20 group-hover:bg-charcoal-900/40 transition-colors duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent opacity-90" />
                        
                        {/* Content */}
                        <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10">
                          {/* Top Row: Icon & Number */}
                          <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-charcoal-900 transition-all duration-500">
                              <Icon size={20} strokeWidth={1.5} />
                            </div>
                            <span className="font-display text-4xl text-white/40 group-hover:text-white transition-colors duration-500">
                              0{i + 1}
                            </span>
                          </div>
                          
                          {/* Bottom Row: Text */}
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full">
                            <div className="flex items-end justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4 opacity-60">
                                  <span className="w-4 h-px bg-white"></span>
                                  <span className="font-display text-[9px] uppercase tracking-[0.4em] text-white">Focus Area</span>
                                </div>
                                <h3 className="font-display text-3xl md:text-4xl text-white mb-2 leading-tight drop-shadow-lg">{item.title}</h3>
                              </div>
                              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:text-charcoal-900 transition-all duration-500 text-white shrink-0">
                                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                              </div>
                            </div>
                            
                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                              <div className="overflow-hidden">
                                <p className="font-body text-white/80 text-sm md:text-base leading-relaxed font-light mt-4 mb-2 max-w-lg">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}

            {/* Process Steps: The Journey */}
            {section.type === 'process_steps' && (
              <ScrollReveal>
                <div className="bg-charcoal-900 rounded-[4rem] p-12 md:p-24 lg:p-32 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-200 h-200 bg-brown-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
                  
                  <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/10 pb-16">
                    <div className="max-w-2xl space-y-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-400">The Masterplan</span>
                      <h2 className="font-display text-5xl md:text-7xl text-white leading-tight">{section.title}</h2>
                    </div>
                    <p className="font-body text-white/40 max-w-sm text-sm font-light leading-relaxed">{section.subtitle}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
                    {section.content?.map((step: any, i: number) => (
                      <div key={i} className="group relative space-y-8">
                        <div className="flex flex-col gap-8">
                          <div className="w-16 h-16 rounded-full bg-white/5 border-12 border-white/10 flex items-center justify-center font-display text-2xl text-brown-400 group-hover:bg-brown-600 group-hover:text-white transition-all duration-700">
                            {step.step || (i + 1)}
                          </div>
                          <div className="space-y-4">
                            <h3 className="font-display text-2xl text-white">{step.title}</h3>
                            <p className="font-body text-white/40 text-sm font-light leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Text + Image: The Signature */}
            {section.type === 'text_image' && (
              <div className={`flex flex-col lg:flex-row items-center gap-24 lg:gap-32 ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                <div className="flex-1 w-full space-y-12">
                  <ScrollReveal direction={idx % 2 === 0 ? 'left' : 'right'}>
                    <div className="space-y-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">The Signature</span>
                      <h2 className="font-display text-5xl md:text-7xl text-charcoal-900 leading-[1.1]">{section.title}</h2>
                    </div>
                    <p className="font-body text-charcoal-500 text-lg md:text-xl font-light leading-relaxed whitespace-pre-wrap pt-8">
                      {section.content?.text}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 border-t border-charcoal-900/10 pt-12 mt-12">
                      {['Meticulous Handover', '3D Photorealism', 'Material Curation', 'Artisanal Finish'].map((f) => (
                        <div key={f} className="flex items-center gap-4">
                          <CheckCircle2 size={18} className="text-brown-400 shrink-0" /> 
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-600">{f}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                </div>
                
                <div className="flex-1 w-full">
                  <ScrollReveal direction={idx % 2 === 0 ? 'right' : 'left'}>
                    <div className="relative aspect-4/5 w-full rounded-4xl overflow-hidden shadow-2xl shadow-brown-900/10 border-12 border-white">
                      <Image
                        src={section.content?.image || "/placeholder.jpg"}
                        alt={section.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* NEW: Related Projects */}
      <ServiceProjectsClient projects={relatedProjects} />

      {/* CHAPTER 3: THE INQUIRY (Dynamic CTA) */}
      <section className="py-56 px-6 bg-white rounded-t-[5rem]">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24">
             <div className="w-full md:w-1/2 space-y-12">
                <div className="space-y-6">
                   <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brown-600">The Next Step</span>
                   <h2 className="font-display text-6xl md:text-8xl text-charcoal-900 leading-tight">Start Your <br /> <span className="italic text-brown-600">{service.title.split(' ')[0]}.</span></h2>
                </div>
                <p className="text-xl text-charcoal-500 font-light leading-relaxed max-w-xl">
                   Experience the fusion of artistic vision and engineering precision. Book your free estimate for {service.title} today.
                </p>
             </div>
             
             <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <Link 
                  href="/contact"
                  className="group relative h-72 w-72 rounded-full bg-charcoal-900 flex items-center justify-center text-center p-8 transition-all hover:bg-brown-900 hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                   <div className="absolute inset-0 rounded-full border border-white/10 scale-90 group-hover:scale-110 transition-transform duration-700" />
                   <div className="space-y-4">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Inquire</span>
                      <span className="block font-display text-3xl text-white">Today.</span>
                      <ArrowRight className="mx-auto h-8 w-8 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" />
                   </div>
                </Link>
             </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
