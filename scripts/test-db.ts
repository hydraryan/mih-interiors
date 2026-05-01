import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;

async function test() {
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  console.log('Testing connection to Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB!');
    
    // Create a test collection and document
    const TestSchema = new mongoose.Schema({ name: String, date: Date });
    const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);
    
    await TestModel.create({ name: 'Connection Test', date: new Date() });
    console.log('Successfully created a test document in "mih_interiors" database.');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
