import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetchBooksByMoodQuery } from '../../redux/features/books/bookApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { FiShoppingCart, FiStar, FiArrowLeft } from 'react-icons/fi';
import Loading from '../../components/Loading';

const MOOD_META = {
    happy:      { emoji: '😄', label: 'Happy',      color: 'from-yellow-500/20 to-yellow-600/5',  accent: '#facc15' },
    calm:       { emoji: '😌', label: 'Calm',       color: 'from-cyan-500/20 to-cyan-600/5',      accent: '#22d3ee' },
    thoughtful: { emoji: '🤔', label: 'Thoughtful', color: 'from-fuchsia-500/20 to-fuchsia-600/5',accent: '#e879f9' },
    sad:        { emoji: '😔', label: 'Sad',        color: 'from-purple-500/20 to-purple-600/5',  accent: '#a78bfa' },
    motivated:  { emoji: '🔥', label: 'Motivated',  color: 'from-red-500/20 to-red-600/5',        accent: '#f87171' },
    relaxed:    { emoji: '🌿', label: 'Relaxed',    color: 'from-emerald-500/20 to-emerald-600/5',accent: '#34d399' },
};

// Generate a stable price from book ID
const generatePrice = (id = '', rating = 3) => {
    const seed = parseInt(id.slice(-4), 16) % 100;
    const base = 6 + (seed % 15) + Math.floor((rating - 1) * 1.5);
    const newPrice = parseFloat(base.toFixed(2));
    const oldPrice = parseFloat((newPrice * 1.3).toFixed(2));
    return { newPrice, oldPrice };
};

const MoodBookCard = ({ book }) => {
    const dispatch = useDispatch();
    const coverImage = book?.img || book?.coverImage;
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
                        <div className="text-gray-600 text-4xl flex items-center justify-center h-full">📚</div>
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
                <p className="text-gray-400 text-xs mb-3">{book.author}</p>
                <div className="flex items-center gap-2 mb-3 mt-auto">
                    <span className="text-green-400 font-bold text-sm">₹{(newPrice * 83).toFixed(0)}</span>
                    <span className="text-gray-500 line-through text-xs">₹{(oldPrice * 83).toFixed(0)}</span>
                    <span className="text-xs text-orange-400 font-medium">
                        {Math.round(((oldPrice - newPrice) / oldPrice) * 100)}% off
                    </span>
                </div>
                <button
                    onClick={() => dispatch(addToCart({ ...book, newPrice, oldPrice }))}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <FiShoppingCart />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default function MoodBooks() {
    const { moodType } = useParams();
    const [page, setPage] = useState(1);
    const [allBooks, setAllBooks] = useState([]);

    const meta = MOOD_META[moodType?.toLowerCase()] || {
        emoji: '📚', label: moodType, color: 'from-sky-500/20 to-sky-600/5', accent: '#38bdf8'
    };

    const { data, isLoading, isFetching, isError } = useFetchBooksByMoodQuery(
        { moodType: moodType?.toLowerCase(), limit: 20, page },
        { skip: !moodType }
    );

    React.useEffect(() => {
        if (data?.books) {
            if (page === 1) setAllBooks(data.books);
            else setAllBooks(prev => [...prev, ...data.books]);
        }
    }, [data, page]);

    React.useEffect(() => {
        setPage(1);
        setAllBooks([]);
    }, [moodType]);

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
        <div className="min-h-screen">
            {/* Mood gradient hero header */}
            <div className={`bg-gradient-to-b ${meta.color} py-12 px-4 mb-8`}>
                <div className="max-w-screen-2xl mx-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
                    >
                        <FiArrowLeft /> Back to Home
                    </Link>
                    <div className="flex items-end gap-4 flex-wrap">
                        <span className="text-6xl">{meta.emoji}</span>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: meta.accent }}>
                                Mood-Based Picks
                            </p>
                            <h1 className="text-4xl font-extrabold text-white capitalize">
                                {meta.label} Books
                            </h1>
                            {totalBooks > 0 && (
                                <p className="text-gray-400 text-sm mt-1">
                                    {totalBooks.toLocaleString()} books curated for this mood
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            <div className="px-4 max-w-screen-2xl mx-auto pb-16">
                {allBooks.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {allBooks.map((book) => (
                                <MoodBookCard key={book._id} book={book} />
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
                            <p className="text-5xl mb-4">{meta.emoji}</p>
                            <h2 className="text-xl font-semibold">No books found for "{meta.label}" mood</h2>
                            <p className="mt-2 text-sm">Try exploring another mood!</p>
                            <Link
                                to="/"
                                className="inline-block mt-6 px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}