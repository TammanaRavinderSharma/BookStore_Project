import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bannerImg from '../../assets/book.jpg';
import bg from '../../assets/bg1.jpg';
import { FiCompass, FiCpu, FiBookOpen, FiStar, FiSmile } from 'react-icons/fi';

const stats = [
  { icon: <FiBookOpen size={15} />, value: "100,000+", label: "Books" },
  { icon: <FiSmile size={15} />,   value: "6",        label: "Moods" },
  { icon: <FiStar size={15} />,    value: "Top",      label: "Rated Picks" },
];

const Banner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="relative bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12"
    >
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />

      {/* Book image */}
      <div className="relative md:w-1/2 w-full flex items-center md:justify-end md:mr-16 z-10">
        <img
          src={bannerImg}
          alt="Book"
          className={`h-[340px] md:h-[420px] w-auto drop-shadow-2xl transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        />
      </div>

      {/* Text + CTAs */}
      <div className={`relative md:w-1/2 w-full px-8 z-10 transition-all duration-700 delay-100 ease-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm
          text-sky-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
          <FiCpu size={12} /> AI-Powered Book Discovery
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Books for <span className="text-sky-400">Every Mood</span>
        </h1>

        <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm">
          Carefully curated reading recommendations, aligned with your emotional
          preferences — making book discovery simple and personal.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            to="/categories/fiction"
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white
              font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-sky-500/25
              transition-all duration-200 hover:scale-105 text-sm"
          >
            <FiCompass size={15} /> Explore Books
          </Link>
          <Link
            to="/ai"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20
              text-white font-semibold px-6 py-2.5 rounded-xl backdrop-blur-sm
              transition-all duration-200 hover:scale-105 text-sm"
          >
            <FiCpu size={15} /> Try AI Mode
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-white/70">
              <span className="text-sky-400">{s.icon}</span>
              <span className="font-bold text-white">{s.value}</span>
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
