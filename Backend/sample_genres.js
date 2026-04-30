const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.DB_URL);
  const db = mongoose.connection.db;

  const samples = await db.collection('NEWBOOKS').aggregate([
    { $match: { genre: { $exists: true, $ne: null } } },
    { $group: { _id: "$genre" } },
    { $limit: 80 }
  ]).toArray();

  console.log("=== GENRE SAMPLES FROM NEWBOOKS ===");
  samples.forEach(s => console.log(s._id));
  console.log(`\nTotal distinct genre groups shown: ${samples.length}`);
  mongoose.disconnect();
}
run().catch(console.error);
