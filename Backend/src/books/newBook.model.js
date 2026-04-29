const mongoose = require('mongoose');

const newBookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
    },
    img: {
        type: String,
    },
    desc: {
        type: String,
    },
    rating: {
        type: Number,
    },
    isbn: {
        type: String,
    },
    isbn13: {
        type: Number,
    },
    link: {
        type: String,
    },
    pages: {
        type: Number,
    },
    reviews: {
        type: Number,
    },
    totalratings: {
        type: Number,
    },
    bookformat: {
        type: String,
    }
}, { 
    collection: 'NEWBOOKS',
    timestamps: true 
});

const NewBook = mongoose.model('NewBook', newBookSchema);

module.exports = NewBook;
