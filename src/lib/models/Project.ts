import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  location: string;
  type: 'Residential' | 'Commercial';
  description: string;
  images: string[];
  imagePublicIds?: string[];
  mainImage: string;
  mainImagePublicId?: string;
  completionDate?: Date;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['Residential', 'Commercial'] 
    },
    description: { type: String, required: true },
    images: { 
      type: [String], 
      required: true,
      validate: [(val: string[]) => val.length <= 5, '{PATH} exceeds the limit of 5']
    },
    imagePublicIds: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length <= 5, '{PATH} exceeds the limit of 5'],
    },
    mainImage: { type: String, required: true },
    mainImagePublicId: { type: String },
    completionDate: { type: Date },
    featured: { type: Boolean, default: false },
    publishStatus: { type: String, enum: ['draft', 'published'], default: 'published' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
