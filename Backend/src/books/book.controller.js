const Book = require('./book.model');
const NewBook = require('./newBook.model');
const Order = require('../orders/order.model');

// Mood → genre keyword mapping (derived from real NEWBOOKS genre tags)
const MOOD_GENRE_MAP = {
    happy:      ['Humor', 'Comedy', 'Childrens', 'Picture Books', 'Storytime', 'Funny', 'Fun'],
    calm:       ['Poetry', 'Nature', 'Spirituality', 'Meditation', 'Buddhism', 'Mindfulness', 'Self Help', 'Zen'],
    thoughtful: ['Philosophy', 'Psychology', 'Biography', 'History', 'Nonfiction', 'Science', 'Essays', 'Memoir'],
    sad:        ['Drama', 'Literary Fiction', 'Tragedy', 'War', 'Grief', 'Classics', 'Literary'],
    motivated:  ['Business', 'Self Help', 'Sports', 'Leadership', 'Productivity', 'Entrepreneurship', 'Success'],
    relaxed:    ['Travel', 'Cooking', 'Food and Drink', 'Art', 'Gardening', 'Nature', 'Crafts', 'Culinary'],
};

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
        const {category} = req.query;
        let query = {};
        if(category && category !== "choose a genre") {
            query.category = category.toLowerCase();
        }
        const books = await Book.find(query).sort({createdAt:-1}); // Fetch books from the database, sorted by creation date in descending order
        res.status(200).send(books);

       } catch(error){
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

const getExploreBooks = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let query = {};

        if (search && search.trim()) {
            // Search across both title and author simultaneously
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { author: { $regex: search.trim(), $options: 'i' } }
            ];
        } else if (category && category !== 'all') {
            // Regex search finds 'Fiction' inside 'Fiction, Literature, Classics'
            query.genre = { $regex: category, $options: 'i' };
        }

        const [books, totalBooks] = await Promise.all([
            NewBook.find(query).skip(skip).limit(parseInt(limit)),
            NewBook.countDocuments(query)
        ]);

        res.status(200).send({
            books,
            totalBooks,
            totalPages: Math.ceil(totalBooks / parseInt(limit)),
            currentPage: parseInt(page)
        });

    } catch (error) {
        console.error("Error fetching explore books:", error);
        res.status(500).send({ message: "Failed to fetch explore books" });
    }
};

const getExploreBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await NewBook.findById(id);
        if (!book) {
            return res.status(404).send({ message: "Explore book not found" });
        }
        res.status(200).send(book);
    } catch (error) {
        console.error("Error fetching explore book by ID:", error);
        res.status(500).send({ message: "Failed to fetch explore book details" });
    }
};

const getBooksByMood = async (req, res) => {
    try {
        const { moodType } = req.params;
        const { limit = 12, page = 1 } = req.query;
        const keywords = MOOD_GENRE_MAP[moodType.toLowerCase()];

        if (!keywords) {
            return res.status(400).send({ message: 'Unknown mood type' });
        }

        // Build an $or regex query across the genre string field
        const query = {
            $or: keywords.map(kw => ({
                genre: { $regex: kw, $options: 'i' }
            }))
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [books, totalBooks] = await Promise.all([
            NewBook.find(query).skip(skip).limit(parseInt(limit)).sort({ rating: -1 }),
            NewBook.countDocuments(query)
        ]);

        res.status(200).send({
            books,
            totalBooks,
            totalPages: Math.ceil(totalBooks / parseInt(limit)),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching mood books:', error);
        res.status(500).send({ message: 'Failed to fetch mood books' });
    }
};

// Category keyword → genre keyword map for cross-collection matching
const CATEGORY_GENRE_MAP = {
    fiction:      ['Fiction', 'Literary Fiction', 'Classics', 'Drama'],
    nonfiction:   ['Nonfiction', 'Biography', 'History', 'Memoir', 'Essays'],
    business:     ['Business', 'Leadership', 'Productivity', 'Entrepreneurship', 'Success'],
    'self-help':  ['Self Help', 'Mindfulness', 'Spirituality', 'Meditation'],
    mystery:      ['Mystery', 'Thriller', 'Crime', 'Detective'],
    fantasy:      ['Fantasy', 'Science Fiction', 'Sci-Fi', 'Adventure'],
    romance:      ['Romance', 'Love'],
    children:     ['Childrens', 'Picture Books', 'Storytime', 'Funny'],
    science:      ['Science', 'Philosophy', 'Psychology'],
    history:      ['History', 'Biography', 'Memoir', 'War'],
    biography:    ['Biography', 'Memoir', 'Nonfiction'],
    humor:        ['Humor', 'Comedy', 'Funny'],
    poetry:       ['Poetry', 'Nature'],
    travel:       ['Travel', 'Cooking', 'Culinary', 'Art'],
    cooking:      ['Cooking', 'Food and Drink', 'Culinary'],
    sports:       ['Sports', 'Leadership', 'Productivity'],
};

const getRecommendations = async (req, res) => {
    try {
        const { email, limit = 18 } = req.query;
        const intLimit = parseInt(limit);

        // If user is logged in, try to personalise
        if (email) {
            // 1. Fetch all orders for this user
            const orders = await Order.find({ email }).sort({ createdAt: -1 }).limit(10);

            if (orders.length > 0) {
                // 2. Collect all productIds across orders
                const productIds = orders.flatMap(o => o.productIds);

                // 3. Fetch those books to get their categories
                const purchasedBooks = await Book.find({ _id: { $in: productIds } }).select('category');

                if (purchasedBooks.length > 0) {
                    // 4. Build a unique set of genre keywords from purchased categories
                    const genreKeywords = new Set();
                    purchasedBooks.forEach(b => {
                        const cat = (b.category || '').toLowerCase().trim();
                        const keywords = CATEGORY_GENRE_MAP[cat];
                        if (keywords) keywords.forEach(kw => genreKeywords.add(kw));
                        else {
                            // Fallback: use the raw category string as a keyword
                            genreKeywords.add(b.category);
                        }
                    });

                    if (genreKeywords.size > 0) {
                        // 5. Query NEWBOOKS for matching genres, sorted by rating
                        const genreQuery = {
                            $or: [...genreKeywords].map(kw => ({
                                genre: { $regex: kw, $options: 'i' }
                            }))
                        };

                        const books = await NewBook.find(genreQuery)
                            .sort({ rating: -1 })
                            .limit(intLimit);

                        if (books.length > 0) {
                            return res.status(200).json({
                                books,
                                personalized: true,
                                genres: [...genreKeywords].slice(0, 5),
                            });
                        }
                    }
                }
            }
        }

        // Fallback: top-rated books from NEWBOOKS
        const books = await NewBook.find({ rating: { $exists: true } })
            .sort({ rating: -1 })
            .limit(intLimit);

        return res.status(200).json({
            books,
            personalized: false,
        });

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch recommendations' });
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteBook,
    getExploreBooks,
    getExploreBookById,
    getBooksByMood,
    getRecommendations,
}