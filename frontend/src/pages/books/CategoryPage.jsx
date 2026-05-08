import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFetchExploreBooksQuery } from '../../redux/features/books/bookApi'
import Loading from '../../components/Loading'
import { FiShoppingCart, FiStar } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'
import { Link } from 'react-router-dom'

// Generate a consistent price from the book's _id (so it never changes on re-render)
const generatePrice = (id = '', rating = 3) => {
    // Use last 4 chars of ID to seed a stable number between 0-99
    const seed = parseInt(id.slice(-4), 16) % 100;
    // Base price $6-$20, nudged up by rating
    const base = 6 + (seed % 15) + Math.floor((rating - 1) * 1.5);
    const newPrice = parseFloat(base.toFixed(2));
    const oldPrice = parseFloat((newPrice * 1.3).toFixed(2));
    return { newPrice, oldPrice };
};

// Compact card for the 100k NEWBOOKS dataset
const ExploreBookCard = ({ book }) => {
    const dispatch = useDispatch();
    const coverImage = book?.img || book?.coverImage;
    const description = book?.desc || book?.description || '';
    const { newPrice, oldPrice } = generatePrice(book._id, book.rating);

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-sky-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <div className="relative h-52 overflow-hidden bg-gray-800 flex items-center justify-center">
                <Link to={`/explore-books/${book._id}`} className="w-full h-full">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={book.title}
                            loading="lazy"
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-sky-900 to-indigo-900 flex items-center justify-center">
                            <span className="text-white text-5xl font-black opacity-25 select-none uppercase">
                                {book.title?.charAt(0) || '?'}
                            </span>
                        </div>
                    )}
                </Link>
                {book.rating && (
                    <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FiStar className="fill-yellow-400" />
                        {book.rating.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <Link to={`/explore-books/${book._id}`}>
                    <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2 hover:text-sky-400 transition-colors">
                        {book.title}
                    </h3>
                </Link>
                <p className="text-gray-400 text-xs mb-2">{book.author}</p>
                {description && (
                    <p className="text-gray-500 text-xs line-clamp-2 flex-1 mb-3">
                        {description}
                    </p>
                )}
                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 font-bold text-sm">₹{(newPrice * 83).toFixed(0)}</span>
                    <span className="text-gray-500 line-through text-xs">₹{(oldPrice * 83).toFixed(0)}</span>
                    <span className="text-xs text-orange-400 font-medium">
                        {Math.round(((oldPrice - newPrice) / oldPrice) * 100)}% off
                    </span>
                </div>
                <button
                    onClick={() => dispatch(addToCart({ ...book, newPrice, oldPrice }))}
                    className="mt-auto w-full bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <FiShoppingCart />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

const CategoryPage = () => {
    const { name } = useParams();
    const [page, setPage] = useState(1);
    const [allBooks, setAllBooks] = useState([]);

    const { data, isLoading, isFetching, isError } = useFetchExploreBooksQuery(
        { category: name, page, limit: 20 },
        {
            // Merge new pages into the accumulated list
            selectFromResult: (result) => result,
        }
    );

    // Accumulate books when new pages arrive
    React.useEffect(() => {
        if (data?.books) {
            if (page === 1) {
                setAllBooks(data.books);
            } else {
                setAllBooks(prev => [...prev, ...data.books]);
            }
        }
    }, [data, page]);

    // Reset when category changes
    React.useEffect(() => {
        setPage(1);
        setAllBooks([]);
    }, [name]);

    if (isLoading && page === 1) return <Loading />;
    if (isError) return (
        <div className="text-red-400 py-20 text-center">
            <p className="text-xl">Error loading books.</p>
            <p className="text-sm mt-2 text-gray-500">Please try again later.</p>
        </div>
    );

    const totalBooks = data?.totalBooks || 0;
    const totalPages = data?.totalPages || 1;
    const hasMore = page < totalPages;

    return (
        <div className="py-8 px-4 max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-end gap-4">
                <h1 className="text-4xl font-bold text-white capitalize">{name}</h1>
                {totalBooks > 0 && (
                    <span className="text-gray-400 text-sm mb-1">
                        {totalBooks.toLocaleString()} books found
                    </span>
                )}
            </div>

            {/* Books Grid */}
            {allBooks.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {allBooks.map((book) => (
                            <ExploreBookCard key={book._id} book={book} />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="flex flex-col items-center mt-10 gap-2">
                        <p className="text-gray-500 text-sm">
                            Showing {allBooks.length} of {totalBooks.toLocaleString()} books
                        </p>
                        {hasMore && (
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={isFetching}
                                className="mt-2 px-8 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                            >
                                {isFetching ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                        Loading...
                                    </>
                                ) : (
                                    'Load More Books'
                                )}
                            </button>
                        )}
                    </div>
                </>
            ) : (
                !isLoading && (
                    <div className="text-gray-400 text-center py-20">
                        <p className="text-5xl mb-4">📚</p>
                        <h2 className="text-xl font-semibold">No books found in "{name}"</h2>
                        <p className="mt-2 text-sm">Try exploring another category!</p>
                    </div>
                )
            )}
        </div>
    );
}

export default CategoryPage
