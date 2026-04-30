import React from 'react'
import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FiStar } from 'react-icons/fi';
import { useFetchAllBooksQuery } from '../../redux/features/books/bookApi';

const Recommended = () => {
    const { data: books = [] } = useFetchAllBooksQuery();
    const slicedBooks = books.slice(0, 18);

    return (
        <div className="py-16 px-4 relative overflow-hidden">
            {/* Subtle background gradient — no more repeated bg1.jpg */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-transparent" />
                <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-screen-2xl mx-auto relative z-10">
                {/* Section header — matches TopSellers & MoodShelf pattern */}
                <div className="flex items-center gap-2 text-sky-400 text-sm font-bold uppercase tracking-widest mb-2">
                    <FiStar size={14} />
                    <span>Just For You</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <h2 className="text-4xl font-extrabold text-white">Recommended for You</h2>
                    <p className="text-gray-500 text-sm">Hand-picked from our curated collection</p>
                </div>

                {slicedBooks.length > 0 ? (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={24}
                        navigation={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        loop={slicedBooks.length > 3}
                        breakpoints={{
                            480: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 3, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                            1280: { slidesPerView: 5, spaceBetween: 24 },
                        }}
                        modules={[Pagination, Navigation, Autoplay]}
                        className="recommendedSwiper !pb-2"
                    >
                        {slicedBooks.map((book, index) => (
                            <SwiperSlide key={index}>
                                <BookCard book={book} />
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
