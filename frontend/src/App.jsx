import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoryStrip from './components/CategoryStrip';
import Footer from './components/Footer.jsx'
import BackToTop from './components/BackToTop.jsx';
import { AuthProvide } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

const App = () => {
  return (
    <ThemeProvider>
      <div className="bg-black min-h-screen transition-colors duration-300">
        <AuthProvide>
          <Navbar/>
          <CategoryStrip/>
          <main className="min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary">
            <Outlet/>
          </main>
          <Footer/>
          <BackToTop/>
        </AuthProvide>
      </div>
    </ThemeProvider>
  )
}

export default App
