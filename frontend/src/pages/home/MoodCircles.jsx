import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {useEffect , useState} from 'react';
import { User } from "./User";
import { Navigation, Pagination } from "swiper/modules";

const moods = [  
  { label: "happy", gradient: "bg-gradient-to-tr from-white-400 to-blue-400" , image:"/happy.jpeg"},  
  { label: "Calm", gradient: "bg-gradient-to-tr from-white-400 to-cyan-500", image:"/calm.jpeg" },  
  { label: "Sad", gradient: "bg-gradient-to-tr from-white-500 to-purple-600" , image:"/sady.jpg" },  
  { label: "Motivated", gradient: "bg-gradient-to-tr from-white-500 to-red-500", image:"/motivated.jpeg" },  
  { label: "Relaxed", gradient: "bg-gradient-to-tr from-white-400 to-emerald-500" , image:"/relaxed.jpg" },  
  { label: "Thoughtful", gradient: "bg-gradient-to-tr from-white-500 to-fuchsia-500" , image:"/thoughtful.jpeg"},  
];  
  
export default function MoodCircles() { 
    const { ref, inView } = User();
    const [visible , setvisible] = useState(false);
    useEffect(() => {setvisible(true);},[]); 
  return (  
    <div
      ref={ref}
      className={` rounded-3xl p-4 m-20
      transition-all duration-700 ease-out
      ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-50"}`}
    >
      <h1 className="text-2xl mb-8 text-center font-bold">Pick your mood</h1>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="my-12 px-8"
      >
        {moods.map((mood) => (  
          <SwiperSlide key={mood.label}>
            <div className="flex justify-center">
              <button 
                className="flex flex-col items-center group focus:outline-none"
              >  
                {/* Gradient Ring */}  
                <div
                  className={`p-[5px] rounded-lg ${mood.gradient}
                              cursor-pointer
                              transition-all duration-300 ease-out
                              group-hover:scale-110 group-hover:rotate-3
                              shadow-md group-hover:shadow-xl`}
                >  
                  {/* Inner Circle */}  
                  <div  
                    className="w-50 h-50 rounded-full
                              relative overflow-hidden shadow-md
                              group-hover:scale-105
                              flex items-center justify-center
                              text-lg font-semibold tracking-wide text-gray-700
                              transition-all duration-300
                              group-hover:text-gray-900"
                  >  
                    <img
                      src={mood.image}
                      alt={mood.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="absolute mt-4 text-white capitalize text-2xl">
                      {mood.label}
                    </span>
                  </div>  
                </div>  
              </button>  
            </div>
          </SwiperSlide>
        ))}  
      </Swiper>
    </div>
  );  
}