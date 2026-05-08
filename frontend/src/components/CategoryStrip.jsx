import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

const categories = [
    { name: "Fiction", emoji: "📚" },
    { name: "Nonfiction", emoji: "🔍" },
    { name: "History", emoji: "🏛️" },
    { name: "Fantasy", emoji: "🦄" },
    { name: "Romance", emoji: "💖" },
    { name: "Science", emoji: "🔬" },
    { name: "Biography", emoji: "👤" },
    { name: "Horror", emoji: "👻" },
    { name: "Adventure", emoji: "🗺️" },
    { name: "Mystery", emoji: "🕵️" },
    { name: "Literature", emoji: "✍️" },
    { name: "Children", emoji: "👶" },
    { name: "Business", emoji: "💼" },
];

const CategoryStrip = () => {
    const { name: activeName } = useParams();
    const containerRef = useRef(null);
    const activeItemRef = useRef(null);

    // Smoothly scroll active category into view/center
    useEffect(() => {
        if (activeItemRef.current && containerRef.current) {
            const container = containerRef.current;
            const item = activeItemRef.current;
            const scrollLeft = item.offsetLeft - (container.clientWidth / 2) + (item.clientWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [activeName]);

    return (
        <div className="relative bg-slate-900/40 dark:bg-slate-950/20 py-4 border-b border-white/5 dark:border-white/5 shadow-inner">
            {/* Soft edge gradients for indicating overflow scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none z-10 hidden md:block light-gradient-left" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none z-10 hidden md:block light-gradient-right" />

            <div className="max-w-screen-2xl mx-auto px-4 flex items-center">
                <span className="text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider text-xs mr-4 shrink-0 select-none flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                    Explore:
                </span>

                <div 
                    ref={containerRef}
                    className="flex items-center space-x-3 overflow-x-auto whitespace-nowrap category-scrollbar py-2.5 px-1 scroll-smooth w-full"
                >
                    {categories.map((category) => {
                        const isActive = activeName?.toLowerCase() === category.name.toLowerCase();
                        return (
                            <Link
                                key={category.name}
                                ref={isActive ? activeItemRef : null}
                                to={`/categories/${category.name.toLowerCase()}`}
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shrink-0 flex items-center gap-2 cursor-pointer relative group
                                    ${isActive
                                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105 border border-sky-400/40'
                                        : 'text-gray-400 dark:text-gray-300 bg-white/5 border border-white/5 hover:text-white hover:bg-slate-800/80 hover:border-white/10 hover:scale-105 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-sm transition-transform duration-300 group-hover:rotate-12">{category.emoji}</span>
                                <span>{category.name}</span>
                                
                                {/* Micro active-dot element */}
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Custom styled edge gradients adjustments for light mode */}
            <style dangerouslySetInnerHTML={{ __html: `
                .light-theme .light-gradient-left {
                    background: linear-gradient(to right, #f8fafc, transparent) !important;
                }
                .light-theme .light-gradient-right {
                    background: linear-gradient(to left, #f8fafc, transparent) !important;
                }
                
                /* Custom Category Scrollbar */
                .category-scrollbar::-webkit-scrollbar {
                    height: 5px;
                }
                .category-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                }
                .category-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(56, 189, 248, 0.2);
                    border-radius: 10px;
                    transition: background 0.3s ease;
                }
                .category-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(56, 189, 248, 0.5) !important;
                }
                
                .light-theme .category-scrollbar::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.02);
                }
                .light-theme .category-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(14, 165, 233, 0.2);
                }
                .light-theme .category-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(14, 165, 233, 0.4) !important;
                }
                
                /* Keep standard scrollbars hidden on non-webkit browsers */
                .category-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(56, 189, 248, 0.2) transparent;
                }
                .light-theme .category-scrollbar {
                    scrollbar-color: rgba(14, 165, 233, 0.2) transparent;
                }
            `}} />
        </div>
    );
};

export default CategoryStrip;
