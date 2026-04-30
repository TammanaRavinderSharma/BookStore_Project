import React, { useEffect } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/bookApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';

const UpdateBook = () => {
  const { id } = useParams();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  // console.log(bookData)
  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();
  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title);
      setValue('description', bookData.description);
      setValue('category', bookData?.category);
      setValue('trending', bookData.trending);
      setValue('oldPrice', bookData.oldPrice);
      setValue('newPrice', bookData.newPrice);
      setValue('coverImage', bookData.coverImage)
    }
  }, [bookData, setValue])

  const onSubmit = async (data) => {
    const updateBookData = {
      title: data.title,
      description: data.description,
      category: data.category,
      trending: data.trending,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: data.coverImage || bookData.coverImage,
    };
    try {
      await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, updateBookData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!"
      });
      await refetch()
    } catch (error) {
      console.log("Failed to update book.");
      alert("Failed to update book.");
    }
  }
  if (isLoading) return <Loading />
  if (isError) return <div>Error fetching book data</div>
  return (
    <div className="max-w-lg mx-auto md:p-8 p-6 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        <SelectField
          label="Category"
          name="category"
          options={[
            { value: '', label: 'Choose A Category' },
            { value: 'business', label: 'Business' },
            { value: 'technology', label: 'Technology' },
            { value: 'fiction', label: 'Fiction' },
            { value: 'horror', label: 'Horror' },
            { value: 'adventure', label: 'Adventure' },
            { value: 'romance', label: 'Romance' },
            { value: 'science', label: 'Science' },
            { value: 'biography', label: 'Biography' },
          ]}
          register={register}
        />
        
        <div className="mb-4 bg-slate-900/30 p-3 rounded-lg border border-slate-700/50">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('trending')}
              className="w-4 h-4 rounded text-sky-500 bg-slate-800 border-slate-600 focus:ring-sky-500/50 focus:ring-2"
            />
            <span className="ml-2 text-sm font-semibold text-slate-300">Mark as Trending</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Old Price"
            name="oldPrice"
            type="number"
            placeholder="0.00"
            register={register}
          />

          <InputField
            label="New Price"
            name="newPrice"
            type="number"
            placeholder="0.00"
            register={register}
          />
        </div>

        <InputField
          label="Cover Image URL"
          name="coverImage"
          type="text"
          placeholder="Cover Image URL"
          register={register}
        />

        <button type="submit" className="w-full py-3 mt-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          Update Book
        </button>
      </form>
    </div>
  )
}

export default UpdateBook