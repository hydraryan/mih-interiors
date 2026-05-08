import mongoose from 'mongoose'

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  designation: {
    type: String,
    required: [true, 'Please provide a designation'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
})

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema)
