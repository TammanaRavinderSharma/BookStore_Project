import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetchAllBooksQuery } from '../../redux/features/books/bookApi'
import BookCard from './BookCard'
import Loading from '../../components/Loading'

const CategoryPage = () => {
    const { name } = useParams();
    const { data: books = [], isLoading, isError } = useFetchAllBooksQuery(name);

    if (isLoading) return <Loading />;
    if (isError) return <div className='text-red-500 py-10 text-center'>Error loading books...</div>;

    return (
        <div className='py-8'>
            <h1 className='text-3xl font-bold text-white mb-8 capitalize'>
                {name} Books
            </h1>

            {
                books.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {
                            books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))
                        }
                    </div>
                ) : (
                    <div className='text-gray-400 text-center py-20'>
                        <h2 className='text-xl'>No books found in this category.</h2>
                        <p className='mt-2'>Check back later or explore other sections!</p>
                    </div>
                )
            }
        </div>
    )
}

export default CategoryPage
