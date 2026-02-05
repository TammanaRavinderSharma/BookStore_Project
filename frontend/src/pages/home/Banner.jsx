import React from "react";
import {useEffect , useState} from 'react';
import bannerImg from '../../assets/book.jpg';
import bg from '../../assets/bg1.jpg';
const Banner = () => {
  const [visible , setvisible] = useState(false);
  useEffect(() => {setvisible(true);},[]);
  return (
    <div style={{backgroundImage: `url(${bg})`}}
    className="bg-blue-200 bg-cover bg-center bg-no-repeat rounded-3xl flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12">

            <div className="md:w-1/2 w-full flex items-center md:justify-end md:mr-20">
          <img src={bannerImg} alt="" className={`h-140  w-auto transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0":"opacity-0 translate-y-6 "}`} />
      </div>
      <div className="md:w-1/2 w-full ">
        <h1 className=" m-8 md:text-5xl text-2xl font-medium mb-7 text-white">Books for every Mood</h1>
        <p className="mb-10 m-8 text-white">Carefully curated reading recommendations. <br />
        Aligned with individual emotional preferences. <br/>
        Designed to support informed reading choices. <br />
        Making book discovery simple and personalised.</p>
<button type="button"
  className="
    bg-gradient-to-tr from-slate-900/70 to-slate-900/70
    px-12 py-2
    m-7
    rounded-md
    text-base font-secondary font-bold text-white
    shadow-md
    hover:from-slate-500 hover:to-white-400
    hover:shadow-lg
    transition-all duration-300
    cursor-pointer
  "
>
  Subscribe
</button>
      </div>

    </div>
  );
};

export default Banner;
