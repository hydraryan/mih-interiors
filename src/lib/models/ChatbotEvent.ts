import mongoose from 'mongoose'

const ChatbotEventSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true },
  eventType: { type: String, required: true, index: true },
  stepId: { type: String },
  source: { type: String, default: 'chatbot' },
  personalizationConsent: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  payload: { type: mongoose.Schema.Types.Mixed },
  userAgent: { type: String },
  pagePath: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },
})

ChatbotEventSchema.index({ conversationId: 1, createdAt: -1 })

export default mongoose.models.ChatbotEvent || mongoose.model('ChatbotEvent', ChatbotEventSchema)
