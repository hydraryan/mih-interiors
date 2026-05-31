import mongoose from 'mongoose'

const AdminUserSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'MIH Admin' },
    email: { type: String },
    role: { type: String, default: 'admin' },
    isActive: { type: Boolean, default: true },
    passwordChangedAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
)

AdminUserSchema.index({ adminId: 1 }, { unique: true })

export default mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema)
