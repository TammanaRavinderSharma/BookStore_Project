import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetchExploreBooksQuery } from '../../redux/features/books/bookApi';
import Loading from '../../components/Loading';
import { FiShoppingCart, FiStar, FiSearch } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { Link } from 'react-router-dom';

const generatePrice = (id = '', rating = 3) => {
    const seed = parseInt(id.slice(-4), 16) % 100;
    const base = 6 + (seed % 15) + Math.floor((rating - 1) * 1.5);
    const newPrice = parseFloat(base.toFixed(2));
    const oldPrice = parseFloat((newPrice * 1.3).toFixed(2));
    return { newPrice, oldPrice };
};

const SearchBookCard = ({ book }) => {
    const dispatch = useDispatch();
    const coverImage = book?.img || book?.coverImage;
    const description = book?.desc || book?.description || '';
    const { newPrice, oldPrice } = generatePrice(book._id, book.rating);

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-sky-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <Link to={`/explore-books/${book._id}`} className="block relative h-52 overflow-hidden bg-gray-800 flex items-center justify-center">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={book.title}
                        loading="lazy"
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="text-gray-600 text-4xl flex items-center justify-center h-full">📚</div>
                )}
                {book.rating && (
                    <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FiStar className="fill-yellow-400" size={10} />
                        {book.rating.toFixed(1)}
                    </div>
                )}
            </Link>
            <div className="p-4 flex flex-col flex-1">
                <Link to={`/explore-books/${book._id}`}>
                    <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2 hover:text-sky-400 transition-colors">
                        {book.title}
                    </h3>
                </Link>
                <p className="text-gray-400 text-xs mb-2">{book.author}</p>
                {description && (
                    <p className="text-gray-500 text-xs line-clamp-2 flex-1 mb-3">{description}</p>
                )}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 font-bold text-sm">${newPrice}</span>
                    <span className="text-gray-500 line-through text-xs">${oldPrice}</span>
                    <span className="text-xs text-orange-400 font-medium">
                        {Math.round(((oldPrice - newPrice) / oldPrice) * 100)}% off
                    </span>
                </div>
                <button
                    onClick={() => dispatch(addToCart({ ...book, newPrice, oldPrice }))}
                    className="mt-auto w-full bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <FiShoppingCart size={12} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [page, setPage] = useState(1);
    const [allBooks, setAllBooks] = useState([]);

    const { data, isLoading, isFetching, isError } = useFetchExploreBooksQuery(
        { search: query, page, limit: 20 },
        { skip: !query }
    );

    // Accumulate books on new pages
    useEffect(() => {
        if (data?.books) {
            if (page === 1) {
                setAllBooks(data.books);
            } else {
                setAllBooks(prev => [...prev, ...data.books]);
            }
        }
    }, [data, page]);

    // Reset on new search
    useEffect(() => {
        setPage(1);
        setAllBooks([]);
    }, [query]);

    const totalBooks = data?.totalBooks || 0;
    const totalPages = data?.totalPages || 1;
    const hasMore = page < totalPages;

    return (
        <div className="py-8 px-4 max-w-screen-2xl mx-auto min-h-screen">

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <FiSearch className="text-sky-400" size={28} />
                    <h1 className="text-4xl font-bold text-white">Search Results</h1>
                </div>
                {query && (
                    <p className="text-gray-400 ml-11">
                        {isLoading ? 'Searching...' : (
                            <>
                                <span className="text-white font-semibold">{totalBooks.toLocaleString()}</span> results for{' '}
                                <span className="text-sky-400 font-semibold">"{query}"</span>
                            </>
                        )}
                    </p>
                )}
            </div>

            {/* No query state */}
            {!query && (
                <div className="text-center py-20">
                    <p className="text-6xl mb-4">🔍</p>
                    <h2 className="text-2xl font-semibold text-white mb-2">Start searching</h2>
                    <p className="text-gray-500">Use the search bar above to find books by title or author</p>
                </div>
            )}

            {/* Loading state */}
            {isLoading && page === 1 && <Loading />}

            {/* Error state */}
            {isError && (
                <div className="text-red-400 py-20 text-center">
                    <p className="text-xl">Something went wrong. Please try again.</p>
                </div>
            )}

            {/* Results Grid */}
            {allBooks.length > 0 && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {allBooks.map((book) => (
                            <SearchBookCard key={book._id} book={book} />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="flex flex-col items-center mt-10 gap-2">
                        <p className="text-gray-500 text-sm">
                            Showing {allBooks.length} of {totalBooks.toLocaleString()} results
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
                                ) : 'Load More Results'}
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* No results */}
            {!isLoading && query && allBooks.length === 0 && !isError && (
                <div className="text-center py-20">
                    <p className="text-6xl mb-4">📭</p>
                    <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
                    <p className="text-gray-500">Try searching with a different title or author name.</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
