import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiBars3CenterLeft } from "react-icons/hi2";
import { FiSearch, FiSun, FiMoon, FiTrash2, FiShoppingCart, FiHeart, FiMic, FiMicOff } from "react-icons/fi";
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import avatarImg from "../assets/avatar.png";
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { removeFromWishlist } from '../redux/features/wishlist/wishlistSlice';
import { addToCart } from '../redux/features/cart/cartSlice';
import { getImgUrl } from '../utils/getImgUrl';

const navigation = [
  { name: 'Dashboard', href: '/dashboard'},
  { name: 'Orders', href: '/orders'},
  { name: 'Cart Page', href: '/cart'},
  { name: 'Check Out', href: '/checkout'}, 
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isdropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const cartItems = useSelector(state => state.cart.cartItems);
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const dropdownRef = useRef(null);
  const favoritesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (favoritesRef.current && !favoritesRef.current.contains(event.target)) {
        setIsFavoritesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, favoritesRef]);

  const handlelogout = async () => {
    logout();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setSearchQuery(speechToText);
      navigate(`/search?q=${encodeURIComponent(speechToText.trim())}`);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error: ", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleQuickAddToCart = (book) => {
    dispatch(addToCart(book));
    setIsFavoritesOpen(false);
  };

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-8 bg-slate-900/70 relative z-50">
      <nav className='flex justify-between items-center gap-4'>

        {/* LEFT SECTION: LOGO */}
        <div className='flex-shrink-0'>
          <Link to="/" className="flex items-center gap-2 group">
            <HiBars3CenterLeft className='size-6 text-white group-hover:text-sky-400 transition-colors'/>
            <span className="text-2xl font-black tracking-tighter text-white transition-all duration-300">
              Lit<span className="text-sky-400">sense</span>
            </span>
          </Link>
        </div>

        {/* CENTER SECTION: SEARCH BAR */}
        <div className='flex-1 max-w-xl mx-4'>
          <div className='relative w-full'>
            <FiSearch className='absolute inline-block left-3 inset-y-2 top-1.5 text-gray-400 z-10'/>
            <input
              type="text"
              placeholder='Search books or authors...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className='bg-[#EAEAEA] w-full py-1.5 md:pl-10 md:pr-10 pl-8 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all text-sm text-slate-900 font-medium'
            />
            {/* Voice Search Microphone Button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-3.5 top-1.5 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer z-10 flex items-center justify-center
                ${isListening ? 'text-red-500 animate-pulse scale-110' : 'text-gray-400 hover:text-sky-500'}`}
              title={isListening ? "Listening... Speak now" : "Search by voice"}
            >
              {isListening ? <FiMicOff className="size-4" /> : <FiMic className="size-4" />}
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: ACTIONS */}
        <div className='flex-shrink-0 flex items-center md:space-x-3 space-x-2 gap-3'>

          {/* 🤖 AI MODE BUTTON */}
          <Link to={currentUser ? "/ai" : "/login"} className='hidden md:block'>
            <button className={`${currentUser ? 'bg-sky-400 hover:bg-sky-500' : 'bg-slate-700 hover:bg-slate-600'} transition-all duration-300
              text-white font-semibold px-4 py-1.5 rounded-md shadow-md text-sm whitespace-nowrap cursor-pointer`}>
              {currentUser ? '🤖 AI Mode' : '🔒 Login for AI Mode'}
            </button>
          </Link>

          {/* USER PROFILE / LOGIN */}
          <div className='relative z-50' ref={dropdownRef}>
            {
              currentUser ? (
                <div className='flex items-center gap-3'>
                  <button onClick={() => setIsDropdownOpen(!isdropdownOpen)} className='flex items-center cursor-pointer'>
                    <img
                      src={avatarImg}
                      alt="avatar"
                      className={`size-8 rounded-full ring-2 ring-sky-400 p-0.5`}
                    />
                  </button>
                  <span className='hidden lg:block text-white text-xs font-medium'>
                    {currentUser.email?.split('@')[0]}
                  </span>

                  {
                    isdropdownOpen && (
                      <div className='absolute right-0 mt-8 top-full w-48 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-md z-[9999] overflow-hidden'>
                        <div className='px-4 py-2 bg-gray-50 border-b border-gray-100'>
                          <p className='text-xs text-gray-500 truncate'>{currentUser.email}</p>
                        </div>
                        <ul className='py-1'>
                          {
                            navigation.map((item)=>(
                              <li key={item.name}
                                  onClick={() => setIsDropdownOpen(false)}>
                                <Link
                                  to={item.href}
                                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors'>
                                  {item.name}
                                </Link>
                              </li>
                            ))
                          }

                          <li className='border-t border-gray-100'>
                            <button
                              onClick={handlelogout}
                              className='block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors cursor-pointer'>
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )
                  }
                </div>
              )
              :
              <Link to="/login" className='flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-sky-500/20 transition-all active:scale-95'>
                <FaUserCircle className='size-5'/>
                <span>Login</span>
              </Link>
            }
          </div>

          {/* WISHLIST BUTTON & DROPDOWN */}
          <div className='relative' ref={favoritesRef}>
            <button 
              onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
              className='relative p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 flex items-center justify-center cursor-pointer'
              title="Favorites"
            >
              {wishlistItems.length > 0 ? (
                <FaHeart className='size-6 text-red-500 hover:scale-110 transition-transform duration-300' />
              ) : (
                <FiHeart className='size-6 text-white hover:text-red-400 hover:scale-110 transition-transform duration-300' />
              )}
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* WISHLIST DROPDOWN */}
            {isFavoritesOpen && (
              <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-white/10 shadow-2xl rounded-2xl p-4 z-[9999] overflow-hidden light-favorites-dropdown animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <span className="text-white font-bold text-sm flex items-center gap-1.5">
                    <FaHeart className="text-red-500" /> Favorites ({wishlistItems.length})
                  </span>
                  <button 
                    onClick={() => setIsFavoritesOpen(false)}
                    className="text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    <p className="text-2xl mb-1">❤️</p>
                    <p>Your favorites list is empty.</p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {wishlistItems.map((book) => {
                      const coverImage = book.coverImage || book.img;
                      return (
                        <div key={book._id} className="flex gap-3 items-center border-b border-white/5 pb-2 last:border-none">
                          <img 
                            src={coverImage?.startsWith('http') ? coverImage : `${getImgUrl(coverImage)}`}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-xs font-bold truncate hover:text-sky-400">
                              <Link to={book.img ? `/explore-books/${book._id}` : `/books/${book._id}`} onClick={() => setIsFavoritesOpen(false)}>
                                {book.title}
                              </Link>
                            </h4>
                            <p className="text-gray-500 text-[10px] truncate">by {book.author}</p>
                            <span className="text-green-400 font-bold text-xs">₹{((book.newPrice || 10.99) * 83).toFixed(0)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => handleQuickAddToCart(book)}
                              className="p-1.5 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Add to Cart"
                            >
                              <FiShoppingCart size={13} />
                            </button>
                            <button 
                              onClick={() => dispatch(removeFromWishlist(book))}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <FiSun className="size-5 text-yellow-400 hover:scale-110 transition-transform duration-300" />
            ) : (
              <FiMoon className="size-5 text-slate-700 dark:text-slate-300 hover:scale-110 transition-transform duration-300" />
            )}
          </button>

          {/* YOUR ORDERS (VISIBLE WHEN LOGGED IN) */}
          {currentUser && (
            <Link to="/orders" className='hidden sm:flex items-center gap-1 bg-white/5 hover:bg-white/10 text-sky-400 px-3 py-1.5 rounded-md font-medium text-sm border border-sky-400/20 transition-all'>
              Orders
            </Link>
          )}

          {/* CART */}
          <Link to="/cart"
            className='bg-blue-400 p-1.5 sm:px-6 px-3 flex items-center rounded-full hover:bg-blue-500 transition-colors'>
            <MdOutlineShoppingCart className='text-white'/>
            <span className='text-sm font-bold text-white sm:ml-2'>
              {cartItems.length}
            </span>
          </Link>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;