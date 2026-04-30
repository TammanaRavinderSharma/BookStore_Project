import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoryStrip from './components/CategoryStrip';
import Footer from './components/Footer.jsx'
import BackToTop from './components/BackToTop.jsx';
import { AuthProvide } from './context/AuthContext.jsx';
const App = () => {
  return (
    <div className='bg-black'>
      <AuthProvide>
        <Navbar/>
        <CategoryStrip/>
      <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'>
        <Outlet/>
      </main>
      <Footer/>
      <BackToTop/>
     </AuthProvide>
    </div>
  )
}

export default App
