import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa"
import { HiBars3CenterLeft } from "react-icons/hi2"

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 text-white">

      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand Column */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <HiBars3CenterLeft className="size-6 text-sky-400" />
            <span className="text-2xl font-black tracking-tighter text-white">
              Lit<span className="text-sky-400">sense</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            An AI-powered bookstore connecting 100,000+ books with the readers who need them.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-sky-400 transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-sky-400 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-sky-400 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-sky-400 transition-colors">
              <FaGithub size={20} />
            </a>
          </div>
        </div>

        {/* Navigate Column */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Navigate</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="text-gray-500 hover:text-white text-sm transition-colors">Home</Link></li>
            <li><Link to="/services" className="text-gray-500 hover:text-white text-sm transition-colors">Services</Link></li>
            <li><Link to="/about" className="text-gray-500 hover:text-white text-sm transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-500 hover:text-white text-sm transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Explore Column */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Explore</h4>
          <ul className="space-y-3">
            <li><Link to="/categories/Fiction" className="text-gray-500 hover:text-white text-sm transition-colors">Fiction</Link></li>
            <li><Link to="/categories/Fantasy" className="text-gray-500 hover:text-white text-sm transition-colors">Fantasy</Link></li>
            <li><Link to="/categories/History" className="text-gray-500 hover:text-white text-sm transition-colors">History</Link></li>
            <li><Link to="/ai" className="text-gray-500 hover:text-white text-sm transition-colors">🤖 AI Mode</Link></li>
            <li><Link to="/search" className="text-gray-500 hover:text-white text-sm transition-colors">Search Books</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Stay Updated</h4>
          <p className="text-gray-500 text-sm mb-4">
            Subscribe for new arrivals, AI features, and curated reading lists.
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-xl text-white bg-white/5 border border-white/10 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
            />
            <button className="w-full bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 px-6 py-5">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Litsense. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer