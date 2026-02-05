const express = require('express')
const router = express.Router(); 
const Book =  require('./book.model');
const {postABook,getAllBooks,getSingleBook,UpdateBook,deleteBook} = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

//frontend => backend server => controller => book schema => database => send to server => 
// back to the frontend
 
//post = when submit something frontend to db
//get = when get something back from db 
//put/pathch = when update something
//delete = when delete something

//post a book
router.post('/create-book', verifyAdminToken , postABook)
router.get("/",getAllBooks)
router.get("/:id",getSingleBook)
router.put("/edit/:id",verifyAdminToken,UpdateBook)
router.delete("/:id",verifyAdminToken,deleteBook)

module.exports = router;