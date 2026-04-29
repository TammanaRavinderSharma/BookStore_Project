import { useParams } from "react-router-dom";
import BookCard from "../../components/BookCard.jsx";



export default function MoodBooks() {
  const { moodType } = useParams();

  const books = booksData[moodType] || [];

  return (
    <div className="text-white px-6">
      
      {/* Title */}
      <h1 className="text-3xl font-bold mb-10 capitalize text-center">
        Books for {moodType} mood
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <div 
            key={index}
            className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:scale-105 transition"
          >
            <img 
              src={book.image} 
              alt={book.title}
              className="w-full h-60 object-cover"
            />
            <h2 className="p-3 text-center font-semibold">
              {book.title}
            </h2>
          </div>
        ))}
      </div>

    </div>
  );
}