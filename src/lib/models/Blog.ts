import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true, maxLength: 160 },
  content: { type: String, required: true }, // HTML
  coverImage: { type: String }, 
  
  // SEO
  metaTitle: { type: String },
  metaDescription: { type: String },
  focusKeyword: { type: String },
  tags: [{ type: String }],
  category: { type: String, enum: ['residential', 'commercial', 'tips', 'trends', 'city-guide', 'vastu'] },
  
  // City targeting
  targetCity: { type: String },
  
  // Content
  author: { type: String, default: 'MIH Interiors Team' },
  readTime: { type: Number },
  
  // Status
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Analytics
  views: { type: Number, default: 0 },
})

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
