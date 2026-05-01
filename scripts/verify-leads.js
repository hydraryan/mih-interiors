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
    await client.connect();
    console.log('Connected to Atlas.');
    
    const db = client.db('mih_interiors');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections in mih_interiors:', collections.map(c => c.name));
    
    const collection = db.collection('leads');
    const count = await collection.countDocuments();
    console.log('Document count in "leads" collection:', count);
    
    if (count > 0) {
      const latest = await collection.findOne({}, { sort: { createdAt: -1 } });
      console.log('Latest Lead Name:', latest.name);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
