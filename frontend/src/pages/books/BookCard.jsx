import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { getImgUrl } from '../../utils/getImgUrl'

import { Link } from'react-router-dom'

import { useDispatch } from'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'

const BookCard = ({book}) => {
    const dispatch =  useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }
    return (
        <div className="  bg-white/0 backdrop-blur-xl  w-64 rounded-lg transition-shadow duration-300 mx-auto justify-center py-20 m-20 border border-white/20  ">
            <div
                className="   flex flex-col items-center sm:h-72  sm:justify-center gap-4 "
            >
                <div className="sm:h-42  rounded-md ">
                    <Link to={`/books/${book._id}`}>
                        <img
                            src={`${getImgUrl(book?.coverImage)}`}
                            alt=""
                            className="w-full h-48 bg-cover p-2 rounded-t-xl mb-4 cursor-pointer hover:scale-105 transition-all duration-200"
                        />
                    </Link>
                </div>

                <div>
                    <Link to={`/books/${book._id}`}>
                        <h3 className="text-xl font-semibold hover:text-blue-500 mb-3 px-4">
                       {book?.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 mb-5 p-4">{book?.description.length > 40 ? `${book.description.slice(0, 40)}...` : book?.description}</p>
                    <p className="font-medium mb-5 px-4  ">
                        ${book?.newPrice} <span className="line-through font-normal ml-2">$ {book?.oldPrice}</span>
                    </p>
                    <button 
                    onClick={() => handleAddToCart(book)}
                    className="bmt-2 bg-gray-900/80 hover:bg-gray-900 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition ">
                        <FiShoppingCart className="" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookCard