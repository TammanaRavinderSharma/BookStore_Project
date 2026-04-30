import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FiExternalLink, FiBookOpen } from 'react-icons/fi';

import news1 from "../../assets/news/news-1.png";
import news2 from "../../assets/news/news-2.png";
import news3 from "../../assets/news/news-3.png";
import news4 from "../../assets/news/news-4.png";

const news = [
    {
        id: 1,
        tag: "📰 Publishing",
        date: "Apr 2025",
        title: "Global Literary Awards Announce 2025 Shortlist",
        description: "The world's most prestigious literary prizes have revealed their shortlists, featuring debut authors and celebrated veterans from over 30 countries.",
        image: news1,
    },
    {
        id: 2,
        tag: "🤖 AI & Books",
        date: "Apr 2025",
        title: "AI Reading Assistants Are Reshaping How We Discover Books",
        description: "New research shows readers who use AI-powered recommendation engines read 40% more books and report higher satisfaction with their choices.",
        image: news2,
    },
    {
        id: 3,
        tag: "🚀 Sci-Fi",
        date: "Mar 2025",
        title: "Science Fiction Sales Hit a Decade High",
        description: "Driven by cultural interest in space exploration and AI, science fiction has become the fastest-growing book genre globally for the third year running.",
        image: news3,
    },
    {
        id: 4,
        tag: "📈 Market",
        date: "Mar 2025",
        title: "E-Book Revenue Surges Amid Subscription Growth",
        description: "Digital book subscription services have reported record revenue as more readers embrace the convenience of unlimited reading for a monthly fee.",
        image: news4,
    },
    {
        id: 5,
        tag: "✍️ Authors",
        date: "Feb 2025",
        title: "Record Number of Debut Novels Published in 2024",
        description: "Publishers report an unprecedented surge in first-time authors, with diverse voices from underrepresented communities leading the wave.",
        image: news2,
    },
];

const NewsCard = ({ item }) => (
    <div className="group flex flex-col sm:flex-row gap-5 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:border-sky-500/40 hover:bg-white/8 transition-all duration-300 h-full">
        {/* Text */}
        <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">
                    {item.tag}
                </span>
                <span className="text-xs text-gray-600">{item.date}</span>
            </div>
            <h3 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-sky-300 transition-colors line-clamp-2">
                {item.title}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">
                {item.description}
            </p>
            <button className="mt-4 flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-xs font-semibold transition-colors self-start">
                Read more <FiExternalLink size={11} />
            </button>
        </div>

        {/* Image */}
        <div className="flex-shrink-0 w-full sm:w-32 h-28 sm:h-auto rounded-xl overflow-hidden bg-gray-800">
            <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </div>
    </div>
);

const News = () => {
    return (
        <div className="py-16 px-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-1/4 w-96 h-64 bg-sky-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-screen-2xl mx-auto relative z-10">
                {/* Header — matches TopSellers pattern */}
                <div className="flex items-center gap-2 text-sky-400 text-sm font-bold uppercase tracking-widest mb-2">
                    <FiBookOpen size={14} />
                    <span>Trending Reads</span>
                </div>
                <div className="flex items-end justify-between gap-4 mb-8">
                    <h2 className="text-4xl font-extrabold text-white">Latest in Books</h2>
                    <p className="text-gray-500 text-sm hidden sm:block">Stories shaping the reading world</p>
                </div>

                <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    navigation={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    loop={true}
                    breakpoints={{
                        768:  { slidesPerView: 2, spaceBetween: 20 },
                        1280: { slidesPerView: 2, spaceBetween: 24 },
                    }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="newsSwiper"
                >
                    {news.map((item) => (
                        <SwiperSlide key={item.id} className="h-auto">
                            <NewsCard item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style>{`
                .newsSwiper .swiper-button-next,
                .newsSwiper .swiper-button-prev {
                    color: #38bdf8;
                    background: rgba(0,0,0,0.5);
                    border: 1px solid rgba(255,255,255,0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    backdrop-filter: blur(8px);
                    transition: all 0.2s;
                    top: -48px;
                }
                .newsSwiper .swiper-button-next { right: 0; }
                .newsSwiper .swiper-button-prev { right: 48px; left: auto; }
                .newsSwiper .swiper-button-next:hover,
                .newsSwiper .swiper-button-prev:hover {
                    background: rgba(56,189,248,0.2);
                    border-color: #38bdf8;
                }
                .newsSwiper .swiper-button-next::after,
                .newsSwiper .swiper-button-prev::after {
                    font-size: 12px;
                    font-weight: 900;
                }
            `}</style>
        </div>
    );
};

export default News;
