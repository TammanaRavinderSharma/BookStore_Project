import React, { useState } from 'react'
import { FiShoppingCart } from "react-icons/fi"
import { useParams } from "react-router-dom"
import axios from 'axios';

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/bookApi';
import { toggleWishlist } from '../../redux/features/wishlist/wishlistSlice';
import { FaHeart } from 'react-icons/fa';
import getBaseUrl from '../../utils/baseURL';
import Loading from '../../components/Loading';

const SingleBook = () => {
    const { id } = useParams();
    const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
    const dispatch = useDispatch();

    const [aiSummary, setAiSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
    const isFavorite = wishlistItems.some(item => item._id === id);

    const handleToggleWishlist = () => {
        if (book) {
            dispatch(toggleWishlist(book));
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }

    const generateAISummary = async () => {
        if (!book) return;
        setIsGenerating(true);
        try {
            const response = await axios.post(`${getBaseUrl()}/api/ai/summarize`, {
                title: book.title,
                description: book.description
            });
            setAiSummary(response.data.summary);
        } catch (error) {
            console.error("Error generating AI summary:", error);
            setAiSummary("Sorry, the AI is currently resting. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>
    if (isError) return <div className="text-center text-red-500 mt-10">Error loading book info</div>

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fade-in">
            <h1 className="text-3xl font-extrabold mb-6 text-slate-800">{book.title}</h1>

            <div className="bg-gradient-to-br from-[#0f0f0f] via-[#111827] to-[#1f2937] rounded-2xl p-8 shadow-2xl shadow-black/40 text-white">

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Image */}
                    <div className="flex-shrink-0 w-full md:w-1/3">
                        <img
                            src={`${getImgUrl(book.coverImage)}`}
                            alt={book.title}
                            className="w-full rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-slate-700 hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Right: Details */}
                    <div className="flex-grow flex flex-col justify-between">
                        <div>
                            <p className="text-slate-300 mb-2"><strong>Author:</strong> <span className="text-white">{book.author || 'Admin'}</span></p>
                            <p className="text-slate-300 mb-2">
                                <strong>Published:</strong> <span className="text-white">{new Date(book?.createdAt).toLocaleDateString()}</span>
                            </p>
                            <p className="text-slate-300 mb-6 capitalize">
                                <strong>Category:</strong> <span className="px-3 py-1 bg-slate-800 rounded-full text-sky-400 text-xs ml-2">{book?.category}</span>
                            </p>

                            {/* AI Summary Box */}
                            {aiSummary && (
                                <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-sky-900/40 to-indigo-900/40 border border-sky-500/30 backdrop-blur-sm relative overflow-hidden animate-fade-in">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-sky-400"></div>
                                    <h3 className="text-sky-300 font-bold mb-3 flex items-center gap-2">
                                        ✨ AI Quick Summary
                                    </h3>
                                    <div className="text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none">
                                        {/* Render Markdown cleanly if Gemini returns markdown bullet points */}
                                        <p className="whitespace-pre-line">{aiSummary}</p>
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{book.description}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button 
                                onClick={handleToggleWishlist} 
                                className={`px-5 py-3.5 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer
                                    ${isFavorite 
                                        ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                        : 'bg-white/5 border-white/10 text-white hover:text-red-400 hover:border-red-400/40'
                                    }`}
                                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                            >
                                <FaHeart size={20} className={isFavorite ? 'scale-110' : ''} />
                            </button>

                            <button onClick={() => handleAddToCart(book)} className="flex-grow flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold py-3 px-6 rounded-xl shadow-lg transition-colors">
                                <FiShoppingCart className="w-5 h-5" />
                                <span>Add to Cart - ${book.newPrice}</span>
                            </button>

                            <button 
                                onClick={generateAISummary} 
                                disabled={isGenerating || !!aiSummary}
                                className="flex-1 flex items-center justify-center gap-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/50 font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
                                        <span>Reading...</span>
                                    </>
                                ) : aiSummary ? (
                                    <>
                                        <span>✨ Summary Generated</span>
                                    </>
                                ) : (
                                    <>
                                        <span>✨ AI Quick Summary</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleBook;