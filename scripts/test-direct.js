const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}
const client = new MongoClient(uri);

async function run() {
  try {
    console.log('Attempting direct MongoDB connection...');
    await client.connect();
    console.log('Connected successfully to Atlas!');
    
    const db = client.db('mih_interiors');
    const collection = db.collection('test_connection');
    
    const result = await collection.insertOne({ test: 'direct_driver', date: new Date() });
    console.log('Document inserted with _id:', result.insertedId);
    
    const doc = await collection.findOne({ _id: result.insertedId });
    console.log('Found document:', doc);

  } catch (err) {
    console.error('Connection Error:', err.message);
    if (err.message.includes('SSL')) {
      console.log('SUGGESTION: This is likely an IP Whitelist issue. Please double-check Atlas -> Network Access.');
    }
  } finally {
    await client.close();
  }
}

run();
