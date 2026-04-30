import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useFetchBooksByMoodQuery } from '../../redux/features/books/bookApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { FiShoppingCart, FiStar, FiArrowRight, FiHeart } from 'react-icons/fi';

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
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-sky-500/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            <div className="relative h-44 overflow-hidden bg-gray-800/60 flex items-center justify-center flex-shrink-0">
                <Link to={`/explore-books/${book._id}`} className="w-full h-full">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={book.title}
                            loading="lazy"
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        // Premium fallback: gradient + first letter
                        <div className="h-full w-full bg-gradient-to-br from-sky-900 to-indigo-900 flex items-center justify-center">
                            <span className="text-white text-4xl font-black opacity-30 select-none">
                                {book.title?.charAt(0) || '?'}
                            </span>
                        </div>
                    )}
                </Link>
                {book.rating && (
                    <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                        <FiStar className="fill-yellow-400" size={10} />
                        {book.rating.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="p-3 flex flex-col flex-1">
                <Link to={`/explore-books/${book._id}`}>
                    <h3 className="text-white font-semibold text-xs leading-tight mb-1 line-clamp-2 hover:text-sky-400 transition-colors">
                        {book.title}
                    </h3>
                </Link>
                <p className="text-gray-500 text-xs mb-2 truncate">{book.author}</p>
                <div className="flex items-center gap-1.5 mb-2 mt-auto">
                    <span className="text-green-400 font-bold text-xs">${newPrice}</span>
                    <span className="text-gray-600 line-through text-xs">${oldPrice}</span>
                </div>
                <button
                    onClick={() => dispatch(addToCart({ ...book, newPrice, oldPrice }))}
                    className="w-full bg-sky-600/80 hover:bg-sky-500 text-white text-xs px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                    <FiShoppingCart size={11} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-pulse">
        <div className="h-44 bg-white/10" />
        <div className="p-3 space-y-2">
            <div className="h-3 bg-white/10 rounded w-4/5" />
            <div className="h-2 bg-white/10 rounded w-3/5" />
            <div className="h-7 bg-white/10 rounded mt-3" />
        </div>
    </div>
);

const ACCENT_BORDERS = {
    happy:      'border-yellow-500',
    calm:       'border-cyan-500',
    thoughtful: 'border-fuchsia-500',
    sad:        'border-purple-500',
    motivated:  'border-red-500',
    relaxed:    'border-emerald-500',
};

const MoodSection = ({ moodType, label, emoji, accentColor }) => {
    const { data, isLoading, isError } = useFetchBooksByMoodQuery(
        { moodType, limit: 12, page: 1 },
        { skip: !moodType }
    );

    const books = data?.books || [];
    const totalBooks = data?.totalBooks || 0;
    const swiperId = `moodSwiper-${moodType}`;
    const accentBorder = ACCENT_BORDERS[moodType] || 'border-sky-500';

    return (
        <div className="py-5">
            {/* Row header with left accent border */}
            <div className={`flex items-end justify-between mb-5 pl-4 border-l-4 ${accentBorder}`}>
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">
                            {label} <span className={`${accentColor}`}>Reads</span>
                        </h2>
                        {totalBooks > 0 && (
                            <p className="text-gray-500 text-xs mt-0.5">
                                {totalBooks.toLocaleString()} books
                            </p>
                        )}
                    </div>
                </div>
                <Link
                    to={`/mood/${moodType}`}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${accentColor} hover:opacity-75 transition-opacity`}
                >
                    See All <FiArrowRight size={12} />
                </Link>
            </div>

            {isError ? (
                <p className="text-gray-600 text-sm px-4">Could not load books.</p>
            ) : isLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : books.length === 0 ? (
                <div className="text-gray-600 text-sm py-6 text-center border border-white/5 rounded-xl">
                    No books found for this mood yet.
                </div>
            ) : (
                <Swiper
                    slidesPerView={2}
                    spaceBetween={14}
                    navigation={true}
                    loop={books.length > 5}
                    autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    breakpoints={{
                        480:  { slidesPerView: 3,  spaceBetween: 14 },
                        768:  { slidesPerView: 4,  spaceBetween: 14 },
                        1024: { slidesPerView: 5,  spaceBetween: 14 },
                        1280: { slidesPerView: 6,  spaceBetween: 14 },
                    }}
                    modules={[Navigation, Autoplay]}
                    className={`${swiperId} !pb-1`}
                >
                    {books.map((book) => (
                        <SwiperSlide key={book._id}>
                            <MoodBookCard book={book} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            <style>{`
                .${swiperId} .swiper-button-next,
                .${swiperId} .swiper-button-prev {
                    color: #38bdf8;
                    background: rgba(0,0,0,0.6);
                    border: 1px solid rgba(255,255,255,0.1);
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    backdrop-filter: blur(8px);
                    transition: all 0.2s;
                }
                .${swiperId} .swiper-button-next:hover,
                .${swiperId} .swiper-button-prev:hover {
                    background: rgba(56,189,248,0.2);
                    border-color: #38bdf8;
                }
                .${swiperId} .swiper-button-next::after,
                .${swiperId} .swiper-button-prev::after {
                    font-size: 10px;
                    font-weight: 900;
                }
            `}</style>
        </div>
    );
};

export default MoodSection;
