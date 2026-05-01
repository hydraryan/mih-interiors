import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

const uri = 'mongodb+srv://aryanrajput5699_db_user:O65gNbKB8aiafDgI@cluster0.byoxunj.mongodb.net/mih_interiors?retryWrites=true&w=majority&appName=Cluster0';

async function test() {
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
