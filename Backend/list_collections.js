const mongoose = require('mongoose');
require('dotenv').config();

async function listCollections() {
  try {
    await mongoose.connect(process.env.DB_URL);
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n--- Collections in the Database ---`);
    
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`Collection: '${coll.name}' -> ${count} documents`);
    }

  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    mongoose.disconnect();
  }
}

listCollections();
