import React from 'react'
import { Link, useParams } from 'react-router-dom'

const categories = [
    "Fiction",
    "Nonfiction",
    "History",
    "Fantasy",
    "Romance",
    "Science",
    "Biography",
    "Horror",
    "Adventure",
    "Mystery",
    "Literature",
    "Children",
    "Business",
]

const CategoryStrip = () => {
    const { name: activeName } = useParams();

    return (
        <div className='bg-slate-900/80 py-3 border-b border-gray-700'>
            <div className='max-w-screen-2xl mx-auto px-4 flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none'>
                <span className='text-gray-400 font-semibold uppercase tracking-wider text-sm mr-2 shrink-0'>Categories:</span>
                {
                    categories.map((category) => {
                        const isActive = activeName?.toLowerCase() === category.toLowerCase();
                        return (
                            <Link
                                key={category}
                                to={`/categories/${category.toLowerCase()}`}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 shrink-0
                                    ${isActive
                                        ? 'bg-sky-500 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                {category}
                            </Link>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default CategoryStrip
