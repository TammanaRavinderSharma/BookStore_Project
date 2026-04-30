import React, { useState } from 'react'
import InputField from './InputField'
import SelectField from './SelectField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/bookApi';
import Swal from 'sweetalert2';

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [imageFile, setimageFile] = useState(null);
    const [addBook, {isLoading, isError}] = useAddBookMutation()
    const [imageFileName, setimageFileName] = useState('')
    const onSubmit = async (data) => {
 
        const newBookData = {
            ...data,
            coverImage: imageFileName
        }
        try {
            await addBook(newBookData).unwrap();
            Swal.fire({
                title: "Book added",
                text: "Your book is uploaded successfully!",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, It's Okay!"
              });
              reset();
              setimageFileName('')
              setimageFile(null);
        } catch (error) {
            console.error(error);
            alert("Failed to add book. Please try again.")   
        }
      
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setimageFile(file);
            setimageFileName(file.name);
        }
    }
  return (
    <div className="max-w-lg mx-auto md:p-8 p-6 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Add New Book</h2>

      {/* Form starts here */}
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        {/* Reusable Input Field for Title */}
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        {/* Reusable Textarea for Description */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}

        />

        {/* Reusable Select Field for Category */}
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

        {/* Trending Checkbox */}
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
          {/* Old Price */}
          <InputField
            label="Old Price"
            name="oldPrice"
            type="number"
            placeholder="0.00"
            register={register}
          
          />

          {/* New Price */}
          <InputField
            label="New Price"
            name="newPrice"
            type="number"
            placeholder="0.00"
            register={register}
            
          />
        </div>

        {/* Cover Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Cover Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20 cursor-pointer" 
          />
          {imageFileName && <p className="text-xs text-slate-500 mt-2">Selected: {imageFileName}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
         {
            isLoading ? <span className="">Adding Book... </span> : <span>+ Add Book</span>
          }
        </button>
      </form>
    </div>
  )
}

export default AddBook