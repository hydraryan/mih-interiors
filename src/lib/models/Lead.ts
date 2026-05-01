import mongoose from 'mongoose'

const LeadSchema = new mongoose.Schema({
  // Contact Info
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  city: { type: String, required: true },
  
  // Quote Details (from chatbot)
  projectType: { type: String, enum: ['residential', 'commercial', 'construction'] },
  scope: { type: String },
  bhkType: { type: String },
  areaSqft: { type: Number },
  packageTier: { type: String, enum: ['essential', 'premium', 'luxury', 'unsure'] },
  budget: { type: String },
  fullAnswers: { type: mongoose.Schema.Types.Mixed },
  additionalNotes: { type: String },
  
  // Service Attribution
  serviceSlug: { type: String },
  serviceCategory: { type: String },
  sourcePage: { type: String },
  
  // Chat Session + Personalization Metadata
  conversationId: { type: String },
  personalizationConsent: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  consentAccepted: { type: Boolean, default: false },
  deviceProfile: { type: mongoose.Schema.Types.Mixed },
  pricingDecision: { type: mongoose.Schema.Types.Mixed },
  confidenceScore: { type: Number },
  fallbackReason: { type: String },
  personalizationApplied: { type: Boolean, default: false },
  personalizationFactors: [String],
  
  // Meta
  source: { type: String, default: 'chatbot' }, 
  pageSource: { type: String }, 
  status: { type: String, enum: ['new', 'contacted', 'in_progress', 'converted', 'lost'], default: 'new' },
  adminNotes: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema)
