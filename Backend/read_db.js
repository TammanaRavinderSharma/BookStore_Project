const mongoose = require('mongoose');
require('dotenv').config();

async function checkBooksCount() {
  try {
    await mongoose.connect(process.env.DB_URL);
    const db = mongoose.connection.db;
    
    // Get total count of books
    const count = await db.collection('books').countDocuments();
    console.log(`\nTOTAL BOOKS IN DATABASE: ${count}`);

  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    mongoose.disconnect();
  }
}

checkBooksCount();
