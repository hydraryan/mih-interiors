import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true,
    enum: ['residential', 'commercial', 'construction']
  },
  shortDescription: { type: String },
  hero: {
    title: { type: String },
    subtitle: { type: String },
    image: { type: String },
  },
  sections: [
    {
      type: { 
        type: String, 
        enum: ['feature_grid', 'text_image', 'process_steps', 'trust_badges'] 
      },
      title: { type: String },
      subtitle: { type: String },
      content: { type: mongoose.Schema.Types.Mixed },
    }
  ],
  faqs: [
    {
      question: { type: String },
      answer: { type: String },
    }
  ],
  testimonials: [
    {
      name: { type: String },
      role: { type: String },
      content: { type: String },
      avatar: { type: String },
      rating: { type: Number, default: 5 },
    }
  ],
  seo: {
    title: { type: String },
    description: { type: String },
    ogImage: { type: String },
    keywords: [String],
  },
  publishStatus: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
  showOnHomepage: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema)
