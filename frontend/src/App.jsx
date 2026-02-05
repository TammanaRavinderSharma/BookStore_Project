import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx'
import { AuthProvide } from './context/AuthContext.jsx';
const App = () => {
  return (
    <div className='bg-black'>
      <AuthProvide>
        <Navbar/>
      <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'>
        <Outlet/>
      </main>
      <Footer/>
     </AuthProvide>
    </div>
  )
}

export default App
