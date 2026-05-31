import mongoose from 'mongoose'

const AdminOtpChallengeSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true, trim: true, lowercase: true },
    purpose: { type: String, enum: ['password_reset'], required: true },
    otpHash: { type: String, required: true },
    recipientEmails: { type: [String], default: [] },
    expiresAt: { type: Date, required: true },
    cooldownUntil: { type: Date, required: true },
    attemptCount: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    verifiedAt: { type: Date },
    resetTokenHash: { type: String },
    resetTokenExpiresAt: { type: Date },
    consumedAt: { type: Date },
    requestedByIp: { type: String },
    lastAttemptByIp: { type: String },
  },
  { timestamps: true }
)

AdminOtpChallengeSchema.index({ adminId: 1, purpose: 1 }, { unique: true })
AdminOtpChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.AdminOtpChallenge || mongoose.model('AdminOtpChallenge', AdminOtpChallengeSchema)
