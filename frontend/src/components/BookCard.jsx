export default function BookCard({ book }) {
  return (
    <div className="bg-red-500 overflow-hidden shadow-md 
                    hover:scale-105 hover:shadow-xl transition duration-300 cursor-pointer">

      {/* Book Image */}
      <div className="h-60 overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Book Info */}
      <div className="p-4 text-center">
        <h2 className="text-white font-semibold text-lg">
          {book.title}
        </h2>
      </div>

    </div>
  );
}