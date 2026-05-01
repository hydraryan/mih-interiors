const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://aryanrajput5699_db_user:O65gNbKB8aiafDgI@cluster0.byoxunj.mongodb.net/mih_interiors?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to Atlas.');
    
    // List all databases
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log('Available Databases:');
    for (const dbInfo of dbs.databases) {
      console.log(`- ${dbInfo.name}`);
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      console.log(`  Collections: ${collections.map(c => c.name).join(', ')}`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
