import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchExploreBookByIdQuery, useSummarizeBookMutation } from '../../redux/features/books/bookApi';
import Loading from '../../components/Loading';
import { FiShoppingCart, FiStar, FiCpu, FiBookOpen, FiInfo } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { toggleWishlist } from '../../redux/features/wishlist/wishlistSlice';
import { FaHeart } from 'react-icons/fa';

const ExploreSingleBook = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data: book, isLoading, isError } = useFetchExploreBookByIdQuery(id);
    const [summarizeBook, { isLoading: isSummarizing }] = useSummarizeBookMutation();
    const [aiSummary, setAiSummary] = useState('');
    const [isBookOpen, setIsBookOpen] = useState(false);

    const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
    const isFavorite = wishlistItems.some(item => item._id === id);

    const handleToggleWishlist = () => {
        if (book) {
            dispatch(toggleWishlist(book));
        }
    };

    if (isLoading) return <Loading />;
    if (isError) return <div className='text-red-500 py-20 text-center'>Error loading book details...</div>;

    const handleSummarize = async () => {
        try {
            const res = await summarizeBook({ title: book.title, description: book.desc || book.description }).unwrap();
            setAiSummary(res.summary);
        } catch (err) {
            console.error("AI Summary failed", err);
        }
    };

    // Generate consistent price from the book's _id (same logic as cards)
    const seed = parseInt(id.slice(-4), 16) % 100;
    const base = 6 + (seed % 15) + Math.floor(((book.rating || 3) - 1) * 1.5);
    const newPrice = parseFloat(base.toFixed(2));
    const oldPrice = parseFloat((newPrice * 1.3).toFixed(2));
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...book, newPrice, oldPrice }));
    };

    const coverImage = book?.img || book?.coverImage;

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#080808]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* 3D Book Container */}
                    <div className="w-full lg:w-1/3 flex justify-center sticky top-24">
                        <div 
                            className={`book-container ${isBookOpen ? 'open' : ''}`}
                            onClick={() => setIsBookOpen(!isBookOpen)}
                        >
                            <div className="book">
                                <img src={coverImage} alt={book.title} className="book-cover" />
                                <div className="book-spine"></div>
                                <div className="book-back"></div>
                                <div className="book-pages">
                                    <div className="page-content p-4 text-gray-800 text-[10px] overflow-hidden">
                                        <h4 className="font-bold border-b border-gray-300 mb-1">{book.title}</h4>
                                        <p>{book.desc || book.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className="px-3 py-1 bg-sky-500/20 text-sky-400 text-xs font-bold rounded-full border border-sky-500/30 uppercase tracking-widest">
                                    {book.genre?.split(',')[0] || 'Book'}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <FiStar className="fill-yellow-400" />
                                    <span className="font-bold">{book.rating?.toFixed(1) || '4.0'}</span>
                                    <span className="text-gray-500 text-sm">({book.totalratings?.toLocaleString() || '0'} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 leading-tight">
                                {book.title}
                            </h1>
                            <p className="text-xl text-gray-400 italic mb-6">by {book.author}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Format</p>
                                    <p className="text-white font-semibold text-sm">{book.bookformat || 'Paperback'}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Pages</p>
                                    <p className="text-white font-semibold text-sm">{book.pages || 'N/A'}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-gray-500 text-xs uppercase mb-1">ISBN</p>
                                    <p className="text-white font-semibold text-sm">{book.isbn || 'N/A'}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Language</p>
                                    <p className="text-white font-semibold text-sm">English</p>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-baseline gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-4xl font-black text-green-400">${newPrice}</span>
                                <span className="text-xl text-gray-500 line-through">${oldPrice}</span>
                                <span className="px-2 py-1 bg-orange-400/20 text-orange-400 text-sm font-bold rounded-lg border border-orange-400/30">
                                    {discount}% OFF
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button 
                                    onClick={handleToggleWishlist} 
                                    className={`p-4 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer
                                        ${isFavorite 
                                            ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                            : 'bg-white/5 border-white/10 text-white hover:text-red-400 hover:border-red-400/40'
                                        }`}
                                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                >
                                    <FaHeart size={20} className={isFavorite ? 'scale-110' : ''} />
                                </button>

                                <button 
                                    onClick={handleAddToCart}
                                    className="flex-grow bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
                                >
                                    <FiShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={handleSummarize}
                                    disabled={isSummarizing}
                                    className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <FiCpu size={20} className={isSummarizing ? 'animate-spin' : ''} />
                                    {isSummarizing ? 'Analyzing...' : 'AI Summary'}
                                </button>
                            </div>

                            {/* AI Summary Section */}
                            {aiSummary && (
                                <div className="mb-8 p-6 rounded-2xl bg-sky-500/10 border border-sky-500/20 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center gap-2 text-sky-400 font-bold mb-3">
                                        <FiCpu />
                                        <span>AI ANALYSIS</span>
                                    </div>
                                    <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                                        {aiSummary}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white font-bold text-lg">
                                    <FiBookOpen className="text-sky-400" />
                                    <span>Synopsis</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {book.desc || book.description}
                                </p>
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <FiInfo className="text-sky-400" />
                                    Genres
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {book.genre?.split(',').map((g, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-lg border border-white/10">
                                            {g.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <FiStar className="text-yellow-400" />
                                    Ratings Distribution
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 w-8">Avg</span>
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-400" style={{ width: `${(book.rating / 5) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs text-white">{book.rating?.toFixed(1)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600">Based on data from Goodreads and global readers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .book-container {
                    perspective: 1200px;
                    width: 280px;
                    height: 420px;
                    cursor: pointer;
                    transition: transform 0.5s ease;
                }
                
                .book {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 20px 20px 60px rgba(0,0,0,0.5);
                }
                
                .book-container.open .book {
                    transform: rotateY(-160deg);
                }
                
                .book-cover, .book-back, .book-pages, .book-spine {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 2px 8px 8px 2px;
                }
                
                .book-cover {
                    background: #222;
                    z-index: 2;
                    transform-origin: left;
                    object-fit: cover;
                }
                
                .book-spine {
                    width: 40px;
                    height: 100%;
                    left: -20px;
                    background: #1a1a1a;
                    transform: rotateY(-90deg);
                    transform-origin: right;
                    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
                }
                
                .book-back {
                    background: #111;
                    transform: rotateY(180deg);
                }
                
                .book-pages {
                    background: #fdfdfd;
                    z-index: 1;
                    transform: translateZ(-2px);
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #ddd;
                }
                
                .page-content {
                    transform: rotateY(180deg);
                    height: 100%;
                    background: linear-gradient(90deg, #f0f0f0 0%, #ffffff 5%, #ffffff 95%, #f0f0f0 100%);
                }
                
                .glass-panel {
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
                }
            ` }} />
        </div>
    );
};

export default ExploreSingleBook;
