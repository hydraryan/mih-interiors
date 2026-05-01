import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Minimal model for seeding
const BlogPostSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  mainImage: String,
  category: String,
  author: { name: String, role: String },
  seo: { title: String, description: String, keywords: [String] },
  readingTime: String,
  publishedAt: Date,
  publishStatus: String,
  featured: Boolean,
});

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

const BLOG_POSTS = [
  {
    title: "10 Luxury Interior Design Trends Dominating Indian Homes in 2024",
    slug: "luxury-interior-design-trends-india-2024",
    category: "Design Trends",
    excerpt: "From sustainable materials to high-tech 'smart' aesthetics, explore the trends that are redefining luxury living in India this year.",
    mainImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
    content: `
      <h2>The Evolution of Indian Luxury</h2>
      <p>Luxury in India is no longer just about gold and velvet. In 2024, it's about <strong>curated minimalism</strong> and <strong>bespoke craftsmanship</strong>. Homeowners in cities like Chandigarh, Delhi, and Mumbai are looking for spaces that reflect their global travels while remaining rooted in Indian heritage.</p>
      
      <h3>1. Sustainable Opulence</h3>
      <p>We are seeing a massive shift towards reclaimed wood, natural stone, and organic fabrics. High-end interiors now prioritize the 'story' behind the material.</p>
      
      <h3>2. Smart Integration</h3>
      <p>Invisible technology—where your home automation is hidden behind walnut paneling—is the new standard for luxury renovations.</p>
      
      <blockquote>"True luxury is when the space anticipates your needs before you do." - Mohit, Founder of MIH Interiors</blockquote>
      
      <h3>3. The Return of Artisanal Craft</h3>
      <p>Hand-carved screens (Jaalis) and custom brass inlay work are finding their way into modern, sleek apartments, creating a beautiful juxtaposition.</p>
    `,
    seo: {
      title: "Luxury Interior Design Trends India 2024 | MIH Interiors",
      description: "Explore the top 10 luxury interior design trends in India for 2024. Expert insights on sustainable luxury, smart homes, and bespoke Indian craftsmanship.",
      keywords: ["luxury interiors India", "interior design trends 2024", "home decor India", "premium renovation"]
    },
    readingTime: "6 min read",
    featured: true
  },
  {
    title: "How Much Does it Cost to Design a 3BHK Apartment in Chandigarh?",
    slug: "3bhk-interior-design-cost-chandigarh-mohali",
    category: "Home Improvement",
    excerpt: "A comprehensive guide to budgeting your 3BHK interior project in the Tricity area, covering everything from essential packages to ultra-luxury finishes.",
    mainImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000",
    content: `
      <h2>Budgeting for your Dream Home in Tricity</h2>
      <p>Chandigarh and Mohali have seen a surge in premium residential projects. If you've just received the keys to your 3BHK, your first question is likely: <em>How much will it cost to make it liveable?</em></p>
      
      <h3>Breakdown of Costs</h3>
      <p>At MIH Interiors, we categorize costs into three tiers:</p>
      <ul>
        <li><strong>Essential (6-10 Lakhs):</strong> Focuses on modular kitchen, wardrobes, and basic lighting.</li>
        <li><strong>Premium (12-18 Lakhs):</strong> Includes false ceilings, wallpaper, premium upholstery, and specialized lighting.</li>
        <li><strong>Luxury (20 Lakhs+):</strong> Full automation, Italian marble, custom furniture, and bespoke wall treatments.</li>
      </ul>
      
      <p>Location matters. Designing in Sector 17 or Zirakpur might have different logistical costs, but the quality of materials remains our priority.</p>
    `,
    seo: {
      title: "3BHK Interior Design Cost in Chandigarh & Mohali (2024 Guide)",
      description: "Complete guide to interior design costs for a 3BHK in Chandigarh and Mohali. Detailed budget breakdown for essential, premium, and luxury finishes.",
      keywords: ["interior design cost Chandigarh", "3BHK interior budget Mohali", "Chandigarh interior designers price", "renovation cost India"]
    },
    readingTime: "8 min read",
    featured: false
  },
  {
    title: "Maximizing Small Office Spaces: 5 Smart Design Hacks",
    slug: "small-office-interior-design-hacks",
    category: "Commercial Strategy",
    excerpt: "Struggling with a compact workspace? Learn how professional interior design can double your perceived area and boost employee productivity.",
    mainImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
    content: `
      <h2>The Power of Vertical Thinking</h2>
      <p>Commercial real estate is expensive. Whether you are in Gurgaon or Ludhiana, making the most of every square inch is vital for business efficiency.</p>
      <h3>Hacks for Productivity</h3>
      <p>1. <strong>Glass Partitions:</strong> Maintain privacy without blocking light. 2. <strong>Multi-functional Furniture:</strong> Desks that convert to meeting tables. 3. <strong>Light Palettes:</strong> Use neutral tones to open up the room.</p>
    `,
    seo: {
      title: "Small Office Interior Design Ideas | Commercial Renovation India",
      description: "Master small office design with these 5 expert hacks. Boost productivity and space efficiency in your commercial workspace.",
      keywords: ["office interior design", "small office ideas", "commercial interiors India", "workspace optimization"]
    },
    readingTime: "4 min read",
    featured: false
  },
  {
    title: "The Ultimate Guide to Choosing the Right Modular Kitchen for Indian Cooking",
    slug: "modular-kitchen-guide-indian-cooking",
    category: "Design Trends",
    excerpt: "Indian kitchens deal with heat, oil, and spices. Here is how to choose a modular kitchen that stands the test of time and culinary intensity.",
    mainImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>Built for the Indian Chef</h2><p>Spices and heavy cooking require robust ventilation and stain-resistant surfaces. We recommend Acrylic or PU finishes for easy cleaning.</p>`,
    seo: {
      title: "Best Modular Kitchen for Indian Homes | MIH Interiors",
      description: "How to choose a modular kitchen for Indian cooking. Focus on chimney power, surface durability, and ergonomic layouts.",
      keywords: ["modular kitchen India", "kitchen design tips", "Indian kitchen renovation"]
    },
    readingTime: "7 min read",
    featured: false
  },
  {
    title: "Vastu Shastra for Modern Homes: Balancing Energy without Compromising Style",
    slug: "vastu-shastra-modern-home-design",
    category: "Architecture",
    excerpt: "Is it possible to have a high-end, contemporary home that is fully Vastu compliant? Yes, and here is how we do it at MIH.",
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>Ancient Wisdom, Modern Aesthetic</h2><p>Vastu doesn't mean compromising on your dream glass-walled living room. It's about the flow of energy (Prana) through clever layout planning.</p>`,
    seo: {
      title: "Vastu Shastra for Modern Interior Design | MIH Interiors",
      description: "Integrate Vastu Shastra into your modern home design. Expert tips on layout, colors, and orientation for positive energy.",
      keywords: ["Vastu for home", "Vastu interior design", "modern Vastu tips"]
    },
    readingTime: "10 min read",
    featured: false
  },
  {
    title: "Why Hire an Interior Designer? The ROI of Professional Design",
    slug: "why-hire-interior-designer-roi",
    category: "MIH Stories",
    excerpt: "Think an interior designer is just an added expense? Discover how professional design increases your property value and saves you money in the long run.",
    mainImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>More than Just Aesthetics</h2><p>A professional designer prevents costly mistakes, gives you access to wholesale vendors, and ensures your home looks like a cohesive masterpiece rather than a collection of random furniture.</p>`,
    seo: {
      title: "Is Hiring an Interior Designer Worth It? | ROI Analysis",
      description: "Discover the return on investment (ROI) of hiring a professional interior designer. Save time, money, and increase property value.",
      keywords: ["hire interior designer", "benefits of interior design", "home value increase"]
    },
    readingTime: "5 min read",
    featured: false
  },
  {
    title: "The Rise of Biophilic Design in Indian Urban Apartments",
    slug: "biophilic-design-trends-indian-apartments",
    category: "Design Trends",
    excerpt: "Bringing the outdoors in: How to integrate nature into your city apartment for better mental health and air quality.",
    mainImage: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>Breathable Spaces</h2><p>With rising pollution in Indian cities, biophilic design is no longer a luxury—it's a necessity. Vertical gardens and indoor water features are the new favorites.</p>`,
    seo: {
      title: "Biophilic Interior Design for Indian Apartments | MIH Interiors",
      description: "Incorporate nature into your home with biophilic design. Best plants and natural elements for Indian urban living.",
      keywords: ["biophilic design", "indoor plants India", "eco-friendly home"]
    },
    readingTime: "6 min read",
    featured: false
  },
  {
    title: "Lighting Design 101: How to Set the Perfect Mood in Your Living Room",
    slug: "lighting-design-guide-living-room",
    category: "Design Trends",
    excerpt: "The most underrated element of design is lighting. Learn the layering technique: Ambient, Task, and Accent lighting.",
    mainImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>The Layered Approach</h2><p>Never rely on a single tube light or central bulb. Use warm LEDs at different heights to create depth and drama in your space.</p>`,
    seo: {
      title: "Living Room Lighting Design Guide | Interior Tips",
      description: "Master the art of living room lighting. Learn about layered lighting, color temperature, and fixture selection.",
      keywords: ["lighting design", "living room lights", "home lighting tips India"]
    },
    readingTime: "5 min read",
    featured: false
  },
  {
    title: "Renovating Your Old Ancestral Home: A Delicate Balance",
    slug: "renovating-ancestral-home-tips",
    category: "Architecture",
    excerpt: "How to preserve the heritage and soul of your family home while upgrading it for 21st-century comfort and plumbing.",
    mainImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>Respecting the Past</h2><p>Ancestral homes often have thick walls and high ceilings. We focus on modernizing the 'invisible' parts like wiring and pipes while restoring the architectural charm.</p>`,
    seo: {
      title: "Ancestral Home Renovation India | Preserving Heritage",
      description: "Tips for renovating old family homes in India. Balance traditional architecture with modern amenities.",
      keywords: ["home renovation India", "ancestral house remodel", "heritage restoration"]
    },
    readingTime: "9 min read",
    featured: false
  },
  {
    title: "Top 5 Flooring Materials for the Indian Climate",
    slug: "best-flooring-materials-india-climate",
    category: "Home Improvement",
    excerpt: "From Italian marble to vitrified tiles, we compare the best flooring options that stay cool in summer and durable during monsoons.",
    mainImage: "https://images.unsplash.com/photo-1581850518616-bcb8188c4436?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>Durability Meets Style</h2><p>Italian marble remains the king of luxury, but high-quality vitrified tiles offer incredible durability for high-traffic Indian households.</p>`,
    seo: {
      title: "Best Flooring for Indian Homes | Marble vs Tiles",
      description: "Compare top flooring materials for Indian homes. Insights on marble, granite, wood, and vitrified tiles.",
      keywords: ["flooring India", "Italian marble price", "best tiles for home"]
    },
    readingTime: "7 min read",
    featured: false
  },
  {
    title: "Designing a Kid's Bedroom that Grows with Them",
    slug: "kids-bedroom-design-longevity",
    category: "Design Trends",
    excerpt: "Stop choosing theme-heavy designs that become obsolete in 2 years. Learn how to build a flexible, creative space for your child.",
    mainImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>The Future-Proof Nursery</h2><p>Focus on neutral built-in furniture and add 'age-appropriate' personality through wall decals, rugs, and accessories that are easy to swap.</p>`,
    seo: {
      title: "Kid's Bedroom Interior Design Ideas | MIH Interiors",
      description: "Create a flexible and fun kid's bedroom. Design tips for longevity and creativity as your child grows.",
      keywords: ["kids room design", "nursery ideas India", "bedroom renovation"]
    },
    readingTime: "6 min read",
    featured: false
  },
  {
    title: "Sustainable Interior Design: Luxury that Doesn't Cost the Earth",
    slug: "sustainable-interior-design-luxury",
    category: "Design Trends",
    excerpt: "Eco-friendly design isn't just a buzzword. It's a commitment to quality and health. Discover low-VOC paints and FSC-certified wood.",
    mainImage: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>The Green Standard</h2><p>Sustainability and luxury are perfectly aligned. High-quality natural materials last longer and create a healthier indoor air environment for your family.</p>`,
    seo: {
      title: "Eco-Friendly Luxury Interiors | Sustainable Design India",
      description: "Learn about sustainable luxury interior design. Focus on healthy materials and long-lasting quality.",
      keywords: ["sustainable design", "eco-friendly home India", "green luxury"]
    },
    readingTime: "6 min read",
    featured: false
  },
  {
    title: "Hospitality Design: Creating Instagrammable Cafes and Restaurants",
    slug: "hospitality-design-instagrammable-cafes",
    category: "Commercial Strategy",
    excerpt: "In the age of social media, your restaurant's design is its best marketing tool. How to create spaces people love to share.",
    mainImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>The Selfie Spot</h2><p>A successful restaurant design needs at least one 'hero' wall. Lighting must be optimized for both mood and smartphone cameras.</p>`,
    seo: {
      title: "Cafe & Restaurant Interior Design | Instagrammable Spaces",
      description: "Boost your restaurant's social media presence with professional interior design. Tips for cafes and bars.",
      keywords: ["restaurant design", "cafe interiors India", "commercial design trends"]
    },
    readingTime: "5 min read",
    featured: false
  },
  {
    title: "Mastering the Open Floor Plan: Privacy in a Shared Space",
    slug: "mastering-open-floor-plan-tips",
    category: "Design Trends",
    excerpt: "Open layouts are beautiful but can be noisy and disorganized. Learn the art of 'Zoning' using rugs, furniture, and lighting.",
    mainImage: "https://images.unsplash.com/photo-1512918766775-d263227545b7?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>Zoning Your Home</h2><p>Use floor levels or ceiling height changes to distinguish between the dining and living areas without building a single wall.</p>`,
    seo: {
      title: "Open Floor Plan Design Ideas | Modern Home Layouts",
      description: "Expert tips for open floor plans. Learn how to create distinct zones while maintaining a spacious feel.",
      keywords: ["open floor plan", "interior zoning tips", "modern home layout"]
    },
    readingTime: "6 min read",
    featured: false
  },
  {
    title: "The MIH Journey: From a Small Studio to a Premium Design Firm",
    slug: "mih-interiors-journey-story",
    category: "MIH Stories",
    excerpt: "A look behind the curtain at how we've built a culture of excellence and obsessive attention to detail over the years.",
    mainImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=2000",
    content: `<h2>Passion for Perfection</h2><p>At MIH, we believe every home has a soul. Our journey started with a simple goal: to bring world-class design to the homes of Chandigarh and beyond.</p>`,
    seo: {
      title: "The Story of MIH Interiors | Our Design Philosophy",
      description: "Learn about the mission and journey of MIH Interiors. Meet the team behind the most luxury homes in Chandigarh.",
      keywords: ["MIH Interiors story", "about us", "design philosophy"]
    },
    readingTime: "4 min read",
    featured: false
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing blogs
    await BlogPost.deleteMany({});
    console.log('Cleared existing blog posts');

    const postsToInsert = BLOG_POSTS.map(p => ({
      ...p,
      author: (p as any).author || { name: 'MIH Team', role: 'Interior Experts' },
      publishStatus: 'published',
      publishedAt: new Date(),
    }));

    await BlogPost.insertMany(postsToInsert);
    console.log(`Successfully seeded ${postsToInsert.length} SEO-optimized blog posts!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
