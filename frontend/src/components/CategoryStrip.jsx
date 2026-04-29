import React from 'react'
import { Link } from 'react-router-dom'

const categories = ["Business", "Fiction", "Horror", "Adventure", "Romance", "Science", "Biography"]

const CategoryStrip = () => {
  return (
    <div className='bg-slate-900/80 py-3 border-b border-gray-700'>
        <div className='max-w-screen-2xl mx-auto px-4 flex items-center justify-center space-x-6 overflow-x-auto whitespace-nowrap'>
            <span className='text-gray-400 font-semibold uppercase tracking-wider text-sm mr-2'>Categories:</span>
            {
                categories.map((category) => (
                    <Link 
                        key={category} 
                        to={`/categories/${category.toLowerCase()}`}
                        className='text-white hover:text-sky-400 transition-colors duration-200 px-3 py-1 rounded-md text-md font-medium hover:bg-slate-800'
                    >
                        {category}
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default CategoryStrip
