import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
  { name: 'Orders', href: '/order'},
  { name: 'Cart Page', href: '/cart'},
  { name: 'Check Out', href: '/checkout'}, 
]

const Navbar = () => {

  const [isdropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItems = useSelector(state => state.cart.cartItems);
  const {currentUser,logout} = useAuth();

  const handlelogout = async () => {
    logout();
  }

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6 bg-slate-900/70">
      <nav className='flex justify-between items-center'>

        {/* LEFT SECTION */}
        <div className='flex items-center md:gap-16 gap-4'>

          <Link to="/">
            <HiBars3CenterLeft className='size-6 text-white'/>
          </Link>

          <div className='relative sm:w-72 w-40 space-x-2'>
            <FiSearch className='absolute inline-block left-3 inset-y-2 top-1.5 text-gray-600'/>
            <input
              type="text"
              placeholder='  Search here'
              className='bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none'
            />
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className='relative flex items-center md:space-x-3 space-x-2 gap-3'>

          {/* 🤖 AI MODE BUTTON */}
          <Link to="/ai">
            <button className='bg-sky-400 hover:bg-sky-500 transition-all duration-300
              text-white font-semibold px-4 py-1.5 rounded-md shadow-md'>
              🤖 AI Mode
            </button>
          </Link>

          {/* USER PROFILE */}
          <div>
            {
              currentUser ? (
                <>
                  <button onClick={()=>setIsDropdownOpen(!isdropdownOpen)}>
                    <img
                      src={avatarImg}
                      alt="avatar"
                      className={`size-7 rounded-full 
                      ${currentUser ? 'ring-2 ring-blue-100':''}`}
                    />
                  </button>

                  {
                    isdropdownOpen && (
                      <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40'>
                        <ul className='py-2'>
                          {
                            navigation.map((item)=>(
                              <li key={item.name}
                                  onClick={()=> setIsDropdownOpen(false)}>
                                <Link
                                  to={item.href}
                                  className='block px-4 py-2 text-sm hover:bg-gray-100'>
                                  {item.name}
                                </Link>
                              </li>
                            ))
                          }

                          <li>
                            <button
                              onClick={handlelogout}
                              className='block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left'>
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )
                  }
                </>
              )
              :
              <Link to="/login">
                <FaUserCircle className='size-8 text-blue-400'/>
              </Link>
            }
          </div>

          {/* WISHLIST */}
          <button className='hidden sm:block'>
            <CiHeart className='size-8 text-white'/>
          </button>

          {/* CART */}
          <Link to="/cart"
            className='bg-blue-400 p-1 sm:px-6 px-2 flex items-center rounded-sm'>
            <MdOutlineShoppingCart />

            <span className='text-sm font-semibold sm:ml-1'>
              {cartItems.length}
            </span>

          </Link>

        </div>
      </nav>
    </header>
  )
}

export default Navbar;