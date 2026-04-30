import React from 'react'
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/bookApi';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import { FiBook, FiEdit, FiTrash2 } from 'react-icons/fi';

const ManageBooks = () => {
    const navigate = useNavigate();
    const { data: books, isLoading, refetch } = useFetchAllBooksQuery();
    const [deleteBook] = useDeleteBookMutation();

    const handleDeleteBook = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                background: '#1e293b',
                color: '#fff',
            });

            if (result.isConfirmed) {
                await deleteBook(id).unwrap();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Book has been deleted.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff',
                });
                refetch();
            }
        } catch (error) {
            console.error('Failed to delete book:', error.message);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete book. Please try again.',
                icon: 'error',
                background: '#1e293b',
                color: '#fff',
            });
        }
    };

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loading /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-sky-400 mb-2">
                        <FiBook size={20} />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Inventory</h2>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white">Manage Books</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg text-slate-300 text-sm font-medium">
                        Total Books: <span className="text-white font-bold">{books?.length || 0}</span>
                    </div>
                    <Link to="/dashboard/add-new-book" className="bg-sky-500 hover:bg-sky-400 text-white active:bg-sky-600 text-sm font-bold px-4 py-2 rounded-lg outline-none transition-all duration-150 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                        + Add New
                    </Link>
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/50 text-slate-300 uppercase text-xs font-semibold border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-xl w-16 text-center">#</th>
                                <th className="px-6 py-4">Book Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-center rounded-tr-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {!books || books.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <FiBook size={48} className="mb-4 opacity-50" />
                                            <p className="text-lg">No books found in inventory.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                books.map((book, index) => (
                                    <tr key={book._id || index} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-center font-mono text-slate-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium line-clamp-1" title={book.title}>{book.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs border border-slate-600">
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-green-400 font-bold">${book.newPrice}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link to={`/dashboard/edit-book/${book._id}`} className="p-2 text-sky-400 hover:text-white hover:bg-sky-500/20 rounded-lg transition-colors border border-transparent hover:border-sky-500/30" title="Edit">
                                                    <FiEdit size={16} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr> 
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManageBooks;