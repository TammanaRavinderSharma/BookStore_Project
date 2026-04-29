const mongoose = require('mongoose');
require('dotenv').config();
const NewBook = require('./src/books/newBook.model');

async function run() {
    await mongoose.connect(process.env.DB_URL);

    const categories = ['fiction', 'history', 'nonfiction', 'fantasy', 'romance'];

    for (const cat of categories) {
        const total = await NewBook.countDocuments({ genre: { $regex: cat, $options: 'i' } });
        const sample = await NewBook.findOne({ genre: { $regex: cat, $options: 'i' } });
        console.log(`[${cat}] -> ${total} books | Sample: "${sample?.title}" | has img: ${!!sample?.img}`);
    }

    process.exit();
}

run().catch(console.error);
