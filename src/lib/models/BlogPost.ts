import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // Markdown or HTML
  excerpt: { type: String, required: true },
  mainImage: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Design Trends, Home Improvement
  author: {
    name: { type: String, default: 'MIH Team' },
    role: { type: String, default: 'Interior Experts' },
    image: { type: String }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    canonicalUrl: String,
    ogImage: String
  },
  readingTime: { type: String, default: '5 min read' },
  publishedAt: { type: Date, default: Date.now },
  publishStatus: { type: String, enum: ['draft', 'published'], default: 'draft' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
