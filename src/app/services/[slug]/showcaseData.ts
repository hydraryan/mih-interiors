export const domainStories = {
  'residential-interiors': [
    {
      id: '01',
      tag: 'Culinary Excellence',
      title: 'Intelligent Modular Kitchens',
      desc: 'The heart of an Indian home requires a delicate balance of robust functionality and seamless aesthetics. We design ergonomic layouts with premium hardware, ensuring adequate ventilation and customized storage.',
      bullets: ['Moisture-resistant materials', 'Custom pantry units', 'Integrated lighting'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left' as const,
      serviceSlug: 'residential-interiors',
      hasStats: false
    },
    {
      id: '02',
      tag: 'Shared Moments',
      title: 'Elevated Living Spaces',
      desc: 'We treat living spaces as the narrative core of the home. Through layered lighting, rich material textures, and bespoke joinery, we craft environments that naturally invite conversation and grand entertaining.',
      bullets: [],
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      alignment: 'right' as const,
      serviceSlug: 'residential-interiors',
      hasStats: true,
      stats: [
        { value: '300+', label: 'Spaces unified' },
        { value: '100%', label: 'Tailored comfort' }
      ]
    },
    {
      id: '03',
      tag: 'Personal Sanctuaries',
      title: 'Master En-suites',
      desc: 'Bedrooms should act as sensory reset spaces. We integrate deeply personalized configurations, soothing color palettes, and ambient lighting to ensure the hours of your day are grounded in tranquility.',
      bullets: ['Acoustic treatments', 'Ambient dimming', 'Bespoke bedframes'],
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left' as const,
      serviceSlug: 'residential-interiors',
      hasStats: false
    },
    {
      id: '04',
      tag: 'Curated Storage',
      title: 'Bespoke Wardrobes',
      desc: 'Custom-built wardrobes that combine architectural refinement with precise internal organization. Crafted securely to safeguard luxury garments while complementing the overarching visual language.',
      bullets: ['Climate-controlled zones', 'Soft-close mechanisms', 'Fluted glass facades'],
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left-split' as const,
      serviceSlug: 'residential-interiors',
      hasStats: false
    },
    {
      id: '05',
      tag: 'Future Forward',
      title: 'Smart Home Environments',
      desc: 'Invisible integration of automation. From motorized window treatments to scene-based lighting control, we ensure technological capability never compromises aesthetic refinement.',
      bullets: [],
      image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200',
      alignment: 'right' as const,
      serviceSlug: 'residential-interiors',
      hasStats: true,
      stats: [
        { value: '1Touch', label: 'Ambient control' },
        { value: 'Hidden', label: 'Wire management' }
      ]
    }
  ],
  'commercial-interiors': [
    {
      id: '01',
      tag: 'Productivity Focused',
      title: 'Commercial Offices',
      desc: 'High-performance workspaces designed to enhance productivity, embody brand identity, and support collaborative dynamics without sacrificing acoustic privacy or ergonomic comfort.',
      bullets: ['Acoustic privacy pods', 'Ergonomic layouts', 'Brand-aligned palettes'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left' as const,
      serviceSlug: 'commercial-interiors',
      hasStats: false
    },
    {
      id: '02',
      tag: 'Customer Experience',
      title: 'Retail & Showrooms',
      desc: 'Inviting spatial strategies that naturally guide foot traffic, highlight product portfolios brilliantly, and create memorable brand touchpoints ensuring clients return time and again.',
      bullets: [],
      image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200',
      alignment: 'right' as const,
      serviceSlug: 'commercial-interiors',
      hasStats: true,
      stats: [
        { value: '45%', label: 'Avg. Stay Increase' },
        { value: 'Custom', label: 'Display Systems' }
      ]
    },
    {
      id: '03',
      tag: 'Hospitality',
      title: 'Restaurant & Cafe Ambience',
      desc: 'Crafting immersive dining atmospheres that balance operational efficiency with distinct aesthetic themes. We design spaces that look photogenic while withstanding the rigors of heavy commercial use.',
      bullets: ['Durable finish selections', 'Mood-centric lighting', 'Optimized circulation'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left' as const,
      serviceSlug: 'commercial-interiors',
      hasStats: false
    },
    {
      id: '04',
      tag: 'Wellness & Clinical',
      title: 'Healthcare Spaces',
      desc: 'Warm, approachable, and calming clinical environments. We shift away from sterile aesthetics to deliver spaces that soothe patient anxieties while maintaining strict sanitation and functional standards.',
      bullets: ['Calming pastel tones', 'Anti-microbial surfaces', 'Seamless accessibility'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left-split' as const,
      serviceSlug: 'commercial-interiors',
      hasStats: false
    }
  ],
  'construction-architecture': [
    {
      id: '01',
      tag: 'Ground Up',
      title: 'Architectural Framing',
      desc: 'Building structural shells with meticulous engineering oversight. We guide the core structural logic so everything from plumbing routes to HVAC systems are integrated flawlessly from day one.',
      bullets: ['Structural integrity', 'Material sustainability', 'Code compliance'],
      image: 'https://images.unsplash.com/photo-1541888086915-46fdfe1c1dbb?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left' as const,
      serviceSlug: 'construction-architecture',
      hasStats: false
    },
    {
      id: '02',
      tag: 'Curb Appeal',
      title: 'Facade & Exterior Design',
      desc: 'Creating visual landmarks. We balance the aesthetics of building facades with weathering constraints, utilizing brickwork, stone, cladding, and modern glazing to make a stated architectural impression.',
      bullets: [],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
      alignment: 'right' as const,
      serviceSlug: 'construction-architecture',
      hasStats: true,
      stats: [
        { value: '100%', label: 'Weather Resistant' },
        { value: 'Max', label: 'Curb Appeal' }
      ]
    },
    {
      id: '03',
      tag: 'Boundless Horizons',
      title: 'Outdoor & Landscape Planning',
      desc: 'Transforming transitional outdoor spaces into lush, usable extensions of your structure. We specify weather-resistant decking, vertical gardens, and bespoke outdoor seating tailored for the Indian climate.',
      bullets: ['Weather-treated woods', 'Integrated planters', 'Subtle path lighting'],
      image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
      alignment: 'left' as const,
      serviceSlug: 'construction-architecture',
      hasStats: false
    }
  ]
};