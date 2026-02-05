import React  from 'react';
import {useState} from "react";
import bgVideo from '../assets/bg-video.mp4';
import { Link } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [message, setMessage] = useState(" ")
  const {loginUser,signInWithGoogle} = useAuth();
  const navigate = useNavigate();
    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const onSubmit = async (data) => {
    try{
      await loginUser(data.email, data.password);
      alert("user logged in successfully");
      navigate("/");
    }catch(error){
      setMessage("Please provide valid email and password");
      console.error(error)
    }
  }
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Login with Google successful");
      navigate("/");  
    } catch (error) {
      alert("Google login failed");
      console.error(error);
    }
  }
  return (
   <div className="relative w-full h-screen overflow-hidden">
  
  {/* Background video */}
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    src={bgVideo}
    autoPlay
    loop
    muted
    playsInline
  />

  {/* Overlay (optional, for darkening) */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content on top */}
  <div className='h-[calc(100vh-120px)] flex justify-center items-center '>
     <div className="w-full max-w-sm mx-auto bg-white/10 border-white/30 backdrop-blur-sm shadow-lg rounded-lg px-8 relative  pt-6 pb-8 mb-4">
    <h2 className="text-xl font-semibold mb-4 text-white">Login</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
            <label className='block text-white text-sm font-bold mb-2 ' htmlFor="email">email</label>
            <input 
            {...register("email", { required: true })}
            type="email"name='email' id='email' placeholder='Email Address'
            className='shadow appearance-none border rounded w-full py-2 px-3 
            leading-tight focus:outline-none focus:shadow-blue-500 '  />
        </div>
        <div className='mb-4'>
            <label className='block text-white text-sm font-bold mb-2 ' htmlFor="password">Password</label>
            <input 
            {...register("password", { required: true })}
            type="password"name='password' id='password' placeholder='Password'
            className='shadow appearance-none border rounded w-full py-2 px-3 
            leading-tight focus:outline-none focus:shadow-blue-500 '  />
        </div>
        {
          message && <p className='text-red-500 text-xc italic mb-3'>{message}</p>
        }
        <div >
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl focus:outline-black  '>Login</button>
        </div>
    </form>
    <p className='text-white align-baseline mt-4 text-sm'>Don't have an account ? <Link to="/Register" className='text-blue-500 hover:text-blue-600'>Register here </Link></p>
       <div>
        <button 
        onClick={handleGoogleSignIn}
        className='w-full flex flex-wrap gap-1 items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none mt-4'>
        <FaGoogle className='mr-2' />
        Sign in with Google
        </button>
       </div>
       <p className='mt-5 text-center text-gray-500 text-xs '>©2026 BookStore . All rights reserved</p>
  </div>
  </div>
</div>
  )
}

export default Login
