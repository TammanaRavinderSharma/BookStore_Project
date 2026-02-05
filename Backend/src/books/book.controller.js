const Book = require('./book.model');

const postABook = async(req,res) => {
     try{
        const newBook = await Book({...req.body});
        await newBook.save();
        res.status(200).send({message:"Book posted successfully",book: newBook});

     }catch(error){
        console.error("Error creating book:", error);
        res.status(500).send({message:"failed to create book"});
     }
}

const getAllBooks = async (req,res) => {
       try{
        const books = await Book.find().sort({createdAt:-1}); // Fetch all books from the database, sorted by creation date in descending order
        res.status(200).send(books);

       } catch{
         console.error("Error fetching books", error);
        res.status(500).send({message:"failed to fetch books"});
       }
}
const getSingleBook = async (req,res) => {
    try{
         const {id} = req.params;
         const book = await Book.findById(id)
         if(!book){
            res.status(404).send({message:"Book not found"})
         }
         res.status(200).send(book);

    }catch(error){
        console.error("Error fetching book", error);
        res.status(500).send({message:"failed to fetch book"});
    }
}
//update boook data
const UpdateBook = async (req,res) => {
    try{
        const{id}=req.params;
        const updatedbook = await Book.findByIdAndUpdate(id,req.body,{new:true});
        if(!updatedbook){
            res.status(404).send({message:"Book is not found"});
        }
        res.status(200).send({
            message:"Book updated successfully",
            book : updatedbook
        })

    }catch(err){
        console.error("failed to update book",err);
        res.status(500).send({message:"failed to update the book"})


    }
}
const deleteBook = async (req,res) => {
    try{
        const {id} = req.params;
        const deletedbook = await Book.findByIdAndDelete(id);
        if(!deletedbook){
            res.status(404).send({message:"Book is not found"})
        }
        res.status(200).send({
            message : "Book deleted successfully",
            book :deletedbook
        }); 

    }catch(error){
        console.error("Error deleting a book",error);
        res.status(500).send({message:"failed to delete the book"})

    }
}

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteBook

}