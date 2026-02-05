import React,{useState , useEffect , useRef} from 'react'
import BookCard from '../books/BookCard';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Pagination , Navigation} from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import bg from '../../assets/bg1.jpg';

import { useFetchAllBooksQuery } from '../../redux/features/books/bookApi.js';
const categories = [ 
  "choose a genre",
  "Business",
  "Fiction",
  "Horror",
  "Adventure",
]

const TopSellers = () => {     
   
    const [ selectedCategory, setSelectedCategory] = useState("choose a genre")
    const {data: books = []} = useFetchAllBooksQuery();
  
    
    const filteredBooks = selectedCategory === "choose a genre" ? books:books.filter(book => book.category === selectedCategory.toLowerCase())
   
  return (
    <div style={{backgroundImage: `url(${bg})`}} className='text-white '>
      <h2 className='text-3xl font-semibold mb-6 '>Top Sellers</h2>
      <div className='mb-8 flex items-center '>
        <select 
        onChange={(e) => setSelectedCategory(e.target.value)}
        name="category" id="" className='border bg-black border-gray-300 rounded-md px-4 py-2 focus:outline-none '>
          {
            categories.map((category , index) => (
              <option key={index} value={category} className='rounded-md bg-gray-800/50  '>{category}</option>
            ) )
          }
        </select>
      </div>
       <Swiper
        slidesPerView={1}
        spaceBetween={30}
       navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination , Navigation]}
        className="mySwiper"
      >
            {
        filteredBooks.length>0 && filteredBooks.map((book,index) => (
          <SwiperSlide key={index} >
            <BookCard book={book}/>
          </SwiperSlide>
          
        ))
      }
        
        
      </Swiper>
  


    </div>
  )
}

export default TopSellers
