import React from 'react';
import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FiStar, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import { useFetchRecommendationsQuery } from '../../redux/features/books/bookApi';
import { useAuth } from '../../context/AuthContext';

// Skeleton loader for loading state
const SkeletonSlide = () => (
    <div className="animate-pulse rounded-xl overflow-hidden bg-white/5 border border-white/10">
        <div className="h-52 bg-white/10" />
        <div className="p-3 space-y-2">
            <div className="h-3 bg-white/10 rounded w-4/5" />
            <div className="h-2 bg-white/10 rounded w-3/5" />
            <div className="h-8 bg-white/10 rounded mt-3" />
        </div>
    </div>
);

const Recommended = () => {
    const { currentUser } = useAuth();
    const userEmail = currentUser?.email || null;

    // Always call the hook — pass email if logged in, null for guest (fallback to top-rated)
    const { data, isLoading, isError } = useFetchRecommendationsQuery(userEmail);

    const books = data?.books || [];
    const isPersonalized = data?.personalized === true;

    return (
        <div className="py-16 px-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-transparent" />
                <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-screen-2xl mx-auto relative z-10">
                {/* Section header */}
                <div className="flex items-center gap-2 text-sky-400 text-sm font-bold uppercase tracking-widest mb-2">
                    <FiStar size={14} />
                    <span>Just For You</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-4xl font-extrabold text-white">Recommended for You</h2>
                        {/* Dynamic sub-label based on personalisation */}
                        <div className="flex items-center gap-2 mt-2">
                            {isLoading ? (
                                <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
                            ) : isPersonalized ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-full">
                                    <FiShoppingBag size={11} />
                                    Based on your purchases
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/5 text-gray-400 border border-white/10 px-3 py-1 rounded-full">
                                    <FiTrendingUp size={11} />
                                    {currentUser ? 'Top picks — order something to personalise' : 'Popular picks'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {isError ? (
                    <div className="text-center py-16 text-gray-600">
                        <p className="text-4xl mb-3">📚</p>
                        <p>Could not load recommendations right now.</p>
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {Array.from({ length: 5 }).map((_, i) => <SkeletonSlide key={i} />)}
                    </div>
                ) : books.length > 0 ? (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={24}
                        navigation={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        loop={books.length > 3}
                        breakpoints={{
                            480:  { slidesPerView: 2, spaceBetween: 20 },
                            768:  { slidesPerView: 3, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                            1280: { slidesPerView: 5, spaceBetween: 24 },
                        }}
                        modules={[Pagination, Navigation, Autoplay]}
                        className="recommendedSwiper !pb-2"
                    >
                        {books.map((book, index) => (
                            <SwiperSlide key={book._id || index}>
                                <BookCard book={{
                                    ...book,
                                    // NewBook uses 'img'; BookCard expects 'coverImage'
                                    coverImage: book.coverImage || book.img,
                                    // NewBook uses 'desc'; BookCard expects 'description'
                                    description: book.description || book.desc,
                                }} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center py-16 text-gray-600">
                        <p className="text-4xl mb-3">📚</p>
                        <p>No recommendations yet.</p>
                    </div>
                )}
            </div>

            {/* Swiper nav styles */}
            <style>{`
                .recommendedSwiper .swiper-button-next,
                .recommendedSwiper .swiper-button-prev {
                    color: #38bdf8;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    backdrop-filter: blur(8px);
                    transition: all 0.2s;
                }
                .recommendedSwiper .swiper-button-next:hover,
                .recommendedSwiper .swiper-button-prev:hover {
                    background: rgba(56,189,248,0.2);
                    border-color: #38bdf8;
                }
                .recommendedSwiper .swiper-button-next::after,
                .recommendedSwiper .swiper-button-prev::after {
                    font-size: 14px;
                    font-weight: 900;
                }
            `}</style>
        </div>
    );
};

export default Recommended;
