import React, { useState } from 'react'
import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/bookApi.js';
import { FiTrendingUp } from 'react-icons/fi';

const categories = [
    { label: "All", value: "choose a genre" },
    { label: "Business", value: "Business" },
    { label: "Fiction", value: "Fiction" },
    { label: "Horror", value: "Horror" },
    { label: "Adventure", value: "Adventure" },
]

const TopSellers = () => {
    const [selectedCategory, setSelectedCategory] = useState("choose a genre");
    const { data: books = [] } = useFetchAllBooksQuery();

    const filteredBooks = selectedCategory === "choose a genre"
        ? books
        : books.filter(book => book.category === selectedCategory.toLowerCase());

    return (
        <div className="py-16 px-4 relative overflow-hidden">

            {/* Background radial glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-screen-2xl mx-auto relative z-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-sky-400 text-sm font-bold uppercase tracking-widest mb-2">
                            <FiTrendingUp />
                            <span>Curated Selection</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white">Top Sellers</h2>
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                                    ${selectedCategory === cat.value
                                        ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Swiper Slider */}
                <Swiper
                    slidesPerView={1}
                    spaceBetween={24}
                    navigation={true}
                    autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    loop={filteredBooks.length > 4}
                    breakpoints={{
                        480: { slidesPerView: 2, spaceBetween: 20 },
                        768: { slidesPerView: 3, spaceBetween: 24 },
                        1024: { slidesPerView: 4, spaceBetween: 24 },
                        1280: { slidesPerView: 5, spaceBetween: 24 },
                    }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="topSellersSwiper !pb-2"
                >
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book, index) => (
                            <SwiperSlide key={index}>
                                <BookCard book={book} />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <div className="text-center py-16 text-gray-600">
                                <p className="text-4xl mb-3">📭</p>
                                <p>No books in this category yet.</p>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>

            </div>

            {/* Custom Swiper Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                .topSellersSwiper .swiper-button-next,
                .topSellersSwiper .swiper-button-prev {
                    color: #38bdf8;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    backdrop-filter: blur(8px);
                    transition: all 0.2s;
                }
                .topSellersSwiper .swiper-button-next:hover,
                .topSellersSwiper .swiper-button-prev:hover {
                    background: rgba(56,189,248,0.2);
                    border-color: #38bdf8;
                }
                .topSellersSwiper .swiper-button-next::after,
                .topSellersSwiper .swiper-button-prev::after {
                    font-size: 14px;
                    font-weight: 900;
                }
                .topSellersSwiper .swiper-pagination-bullet {
                    background: rgba(255,255,255,0.2);
                }
                .topSellersSwiper .swiper-pagination-bullet-active {
                    background: #38bdf8;
                }
            ` }} />
        </div>
    )
}

export default TopSellers
