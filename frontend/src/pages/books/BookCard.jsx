import React from 'react'
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi'
import { getImgUrl } from '../../utils/getImgUrl'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'

const BookCard = ({ book }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }

    return (
        <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden
                        hover:border-sky-500/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)]
                        transition-all duration-400 ease-out hover:-translate-y-2 w-56 mx-auto flex flex-col">

            {/* Trending Badge */}
            {book?.trending && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-orange-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                    TRENDING
                </div>
            )}

            {/* Cover Image */}
            <div className="relative h-56 overflow-hidden bg-gray-900 flex items-center justify-center">
                <Link to={`/books/${book._id}`} className="w-full h-full">
                    <img
                        src={
                            book?.coverImage?.startsWith('http')
                                ? book.coverImage
                                : `${getImgUrl(book?.coverImage)}`
                        }
                        alt={book?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
                {/* Hover overlay with quick actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link to={`/books/${book._id}`}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white p-2.5 rounded-full hover:bg-sky-500/80 transition-colors"
                        title="View Details">
                        <FiEye size={16} />
                    </Link>
                    <button
                        onClick={() => handleAddToCart(book)}
                        className="bg-sky-500/80 backdrop-blur-sm border border-sky-400/30 text-white p-2.5 rounded-full hover:bg-sky-400 transition-colors"
                        title="Add to Cart">
                        <FiShoppingCart size={16} />
                    </button>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex flex-col flex-1">
                {/* Category Tag */}
                {book?.category && (
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">
                        {book.category}
                    </span>
                )}

                <Link to={`/books/${book._id}`}>
                    <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-sky-300 transition-colors">
                        {book?.title}
                    </h3>
                </Link>

                <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">
                    {book?.description?.length > 60 ? `${book.description.slice(0, 60)}...` : book?.description}
                </p>

                {/* Rating */}
                {book?.rating && (
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                size={11}
                                className={i < Math.round(book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                            />
                        ))}
                        <span className="text-gray-500 text-[10px] ml-1">({book.rating})</span>
                    </div>
                )}

                {/* Price & Cart */}
                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <span className="text-green-400 font-black text-base">${book?.newPrice}</span>
                        {book?.oldPrice && (
                            <span className="text-gray-600 line-through text-xs ml-1">${book?.oldPrice}</span>
                        )}
                    </div>
                    <button
                        onClick={() => handleAddToCart(book)}
                        className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95">
                        <FiShoppingCart size={12} />
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookCard