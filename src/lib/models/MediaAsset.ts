import mongoose from 'mongoose'

const MediaAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sourceKey: { type: String, required: true, unique: true },
    sourceType: { type: String, enum: ['public', 'remote', 'upload'], required: true },
    sourceUrl: { type: String, required: true },
    assetPath: { type: String },
    folder: { type: String },
    placements: [{ type: String }],
    minWidth: { type: Number },
    minHeight: { type: Number },
    aspectRatio: { type: String },
    altText: { type: String },
    caption: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    width: { type: Number },
    height: { type: Number },
    fileSizeKb: { type: Number },
    cloudinaryPublicId: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
)

MediaAssetSchema.index({ sourceType: 1, folder: 1 })
MediaAssetSchema.index({ status: 1, updatedAt: -1 })

export default mongoose.models.MediaAsset || mongoose.model('MediaAsset', MediaAssetSchema)
