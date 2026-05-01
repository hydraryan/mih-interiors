const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['Residential', 'Commercial'] },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  mainImage: { type: String, required: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const SEED_PROJECTS = [
  {
    title: "Luxury Villa in Sector 8",
    slug: "luxury-villa-sector-8",
    location: "Chandigarh",
    type: "Residential",
    description: "A premium 4BHK villa featuring Italian marble flooring, custom-built teak furniture, and a state-of-the-art modular kitchen. The design focuses on maximizing natural light and creating a seamless flow between indoor and outdoor spaces.",
    mainImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: true,
    order: 1
  },
  {
    title: "Modern Tech Office",
    slug: "modern-tech-office-it-park",
    location: "IT Park, Chandigarh",
    type: "Commercial",
    description: "A contemporary office space designed for a tech startup. Features open-plan workstations, ergonomic furniture, acoustic-treated meeting rooms, and a vibrant cafeteria. The aesthetic is clean, professional, yet energetic.",
    mainImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1416339442236-8ceb164046f8?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: true,
    order: 2
  },
  {
    title: "Minimalist Penthouse",
    slug: "minimalist-penthouse-panchkula",
    location: "Panchkula",
    type: "Residential",
    description: "A minimalist approach to luxury living. This penthouse features a monochromatic palette with warm wooden accents, hidden storage solutions, and breathtaking views of the Shivalik hills.",
    mainImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1616137422495-1e902b721149?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: false,
    order: 3
  }
];

async function seed() {
  try {
    const MONGODB_URI = "mongodb+srv://aryanrajput5699_db_user:O65gNbKB8aiafDgI@cluster0.byoxunj.mongodb.net/mih_interiors?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    await Project.deleteMany({});
    console.log("Cleared existing projects.");

    await Project.insertMany(SEED_PROJECTS);
    console.log(`Seeded ${SEED_PROJECTS.length} projects.`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
