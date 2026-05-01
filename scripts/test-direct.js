const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://aryanrajput5699_db_user:O65gNbKB8aiafDgI@cluster0.byoxunj.mongodb.net/mih_interiors?retryWrites=true&w=majority&appName=Cluster0';
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
