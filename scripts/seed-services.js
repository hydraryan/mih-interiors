const mongoose = require('mongoose');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  shortDescription: { type: String },
  hero: {
    title: { type: String },
    subtitle: { type: String },
    image: { type: String },
  },
  sections: [mongoose.Schema.Types.Mixed],
  faqs: [mongoose.Schema.Types.Mixed],
  testimonials: [mongoose.Schema.Types.Mixed],
  seo: mongoose.Schema.Types.Mixed,
  publishStatus: { type: String, default: 'published' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

const SEED_SERVICES = [
  {
    title: 'Residential Interiors',
    slug: 'residential-interiors',
    category: 'residential',
    shortDescription: 'Bespoke interior design solutions for modern homes, villas, and apartments.',
    hero: {
      title: 'Elevate Your Living Space',
      subtitle: 'Luxury residential interiors tailored to your lifestyle and comfort.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2000',
    },
    sections: [
      {
        type: 'feature_grid',
        title: 'Our Specializations',
        subtitle: 'From modular kitchens to complete home transformations.',
        content: [
          { title: 'Modular Kitchens', desc: 'Ergonomic designs with premium hardware.', icon: 'ChefHat' },
          { title: 'Luxury Living Rooms', desc: 'Statement spaces for entertaining and relaxation.', icon: 'Sofa' },
          { title: 'Master Suites', desc: 'Personal sanctuaries designed for ultimate comfort.', icon: 'Bed' },
          { title: 'Smart Home Integration', desc: 'Seamless technology for the modern lifestyle.', icon: 'Cpu' }
        ]
      },
      {
        type: 'process_steps',
        title: 'The MIH Journey',
        subtitle: 'How we turn your vision into reality.',
        content: [
          { step: 1, title: 'Consultation', desc: 'Understanding your needs, style, and budget.' },
          { step: 2, title: 'Concept Design', desc: '2D layouts and mood boards for your approval.' },
          { step: 3, title: '3D Visualization', desc: 'Realistic renders of your future home.' },
          { step: 4, title: 'Execution', desc: 'Precise on-site work with periodic updates.' }
        ]
      }
    ],
    faqs: [
      { question: 'What is the typical timeline for a 3BHK project?', answer: 'Usually 45-60 days from design approval.' },
      { question: 'Do you provide warranties?', answer: 'Yes, we offer up to 10 years warranty on modular work.' }
    ],
    seo: {
      title: 'Best Residential Interior Designers in Chandigarh | MIH Interiors',
      description: 'MIH Interiors provides premium residential interior design services in Chandigarh, Mohali, and Panchkula. Transform your home today.',
      keywords: ['interior designer', 'home interiors', 'chandigarh', 'residential design']
    },
    publishStatus: 'published',
    order: 1
  },
  {
    title: 'Commercial Interiors',
    slug: 'commercial-interiors',
    category: 'commercial',
    shortDescription: 'High-performance workspaces and retail environments that drive business growth.',
    hero: {
      title: 'Design for Success',
      subtitle: 'Strategic commercial interiors that reflect your brand identity.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
    },
    sections: [
      {
        type: 'feature_grid',
        title: 'Commercial Solutions',
        subtitle: 'Creating spaces that inspire productivity and brand loyalty.',
        content: [
          { title: 'Corporate Offices', desc: 'Efficient layouts promoting collaboration.', icon: 'Briefcase' },
          { title: 'Retail Stores', desc: 'Strategic customer paths and stunning displays.', icon: 'ShoppingBag' },
          { title: 'Restaurants & Cafes', desc: 'Ambience-driven designs for dining excellence.', icon: 'Utensils' },
          { title: 'Healthcare Facilities', desc: 'Functional and calming clinical environments.', icon: 'Activity' }
        ]
      }
    ],
    faqs: [
      { question: 'Do you handle commercial renovations?', answer: 'Yes, we specialize in both new fit-outs and office upgrades.' }
    ],
    seo: {
      title: 'Commercial Interior Design & Office Fit-outs | MIH Interiors',
      description: 'Expert commercial interior designers in Chandigarh. We create modern offices and retail spaces that enhance productivity and branding.',
      keywords: ['office interiors', 'commercial design', 'retail fit-out', 'chandigarh office design']
    },
    publishStatus: 'published',
    order: 2
  },
  {
    title: 'Construction + Architecture',
    slug: 'construction-architecture',
    category: 'construction',
    shortDescription: 'End-to-end building solutions from foundation to finishing with precision engineering.',
    hero: {
      title: 'Build with Confidence',
      subtitle: 'Premium construction and architectural services for luxury villas and kothis.',
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=2000',
    },
    sections: [
      {
        type: 'text_image',
        title: 'Holistic Construction',
        subtitle: 'One partner for your entire building journey.',
        content: {
          text: 'We provide comprehensive construction services including structural engineering, architectural planning, and MEP services. Our team ensures quality at every step, from site preparation to the final coat of paint.',
          image: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=1000'
        }
      }
    ],
    faqs: [
      { question: 'Do you assist with building approvals?', answer: 'Yes, our architectural team manages all necessary municipal approvals.' }
    ],
    seo: {
      title: 'Construction & Architectural Services in Chandigarh | MIH Interiors',
      description: 'Professional construction and architecture services for residential and commercial projects. Build your dream kothi with MIH Interiors.',
      keywords: ['construction company', 'architects', 'chandigarh builders', 'villa construction']
    },
    publishStatus: 'published',
    order: 3
  }
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('No MONGODB_URI found in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    await Service.deleteMany({});
    console.log('Cleared existing services.');

    await Service.insertMany(SEED_SERVICES);
    console.log(`Seeded ${SEED_SERVICES.length} services.`);

    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seed();
