import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiBars3CenterLeft } from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import avatarImg from "../assets/avatar.png";
import { useAuth } from '../context/AuthContext';
import AIChat from '../pages/ai/chatbot';

const navigation = [
  { name: 'Dashboard', href: '/dashboard'},
  { name: 'Orders', href: '/orders'},
  { name: 'Cart Page', href: '/cart'},
  { name: 'Check Out', href: '/checkout'}, 
]

const Navbar = () => {

  const [isdropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useSelector(state => state.cart.cartItems);
  const {currentUser,logout} = useAuth();
  const navigate = useNavigate();

  const handlelogout = async () => {
    logout();
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-8 bg-slate-900/70">
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
              className='bg-[#EAEAEA] w-full py-1.5 md:px-10 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all text-sm'
            />
          </div>
        </div>

        {/* RIGHT SECTION: ACTIONS */}
        <div className='flex-shrink-0 flex items-center md:space-x-3 space-x-2 gap-3'>

          {/* 🤖 AI MODE BUTTON */}
          <Link to={currentUser ? "/ai" : "/login"} className='hidden md:block'>
            <button className={`${currentUser ? 'bg-sky-400 hover:bg-sky-500' : 'bg-slate-700 hover:bg-slate-600'} transition-all duration-300
              text-white font-semibold px-4 py-1.5 rounded-md shadow-md text-sm whitespace-nowrap`}>
              {currentUser ? '🤖 AI Mode' : '🔒 Login for AI Mode'}
            </button>
          </Link>

          {/* USER PROFILE / LOGIN */}
          <div className='relative'>
            {
              currentUser ? (
                <div className='flex items-center gap-3'>
                  <button onClick={()=>setIsDropdownOpen(!isdropdownOpen)} className='flex items-center'>
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
                      <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 overflow-hidden'>
                        <div className='px-4 py-2 bg-gray-50 border-b border-gray-100'>
                          <p className='text-xs text-gray-500 truncate'>{currentUser.email}</p>
                        </div>
                        <ul className='py-1'>
                          {
                            navigation.map((item)=>(
                              <li key={item.name}
                                  onClick={()=> setIsDropdownOpen(false)}>
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
                              className='block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors'>
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

          {/* WISHLIST */}
          <button className='hidden sm:block'>
            <CiHeart className='size-8 text-white hover:text-red-400 transition-colors'/>
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
  )
}

export default Navbar;