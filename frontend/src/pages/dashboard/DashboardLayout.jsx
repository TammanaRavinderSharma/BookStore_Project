import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiViewGridAdd } from "react-icons/hi";
import { MdOutlineManageHistory, MdOutlineDashboard, MdLogout } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdOutlineDashboard className="w-5 h-5" /> },
    { name: 'Add New Book', path: '/dashboard/add-new-book', icon: <HiViewGridAdd className="w-5 h-5" /> },
    { name: 'Manage Books', path: '/dashboard/manage-books', icon: <MdOutlineManageHistory className="w-5 h-5" /> },
    { name: 'Manage Orders', path: '/dashboard/manage-orders', icon: <FiPackage className="w-5 h-5" /> },
  ];

  return (
    <section className="flex bg-[#0f172a] min-h-screen overflow-hidden text-white font-sans">
      
      {/* Sidebar */}
      <aside className="hidden sm:flex sm:flex-col w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800">
        <div className="flex items-center justify-center h-20 border-b border-slate-800 bg-slate-900/50">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-white transition-all duration-300">
              Lit<span className="text-sky-400">sense</span>
            </span>
          </Link>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <nav className="flex flex-col mx-4 my-6 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4">Menu</div>
            
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`inline-flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-sky-400' : 'text-slate-500'}`}>{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="mx-4 mb-6">
            <button 
              onClick={handleLogout}
              className="w-full inline-flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
            >
              <MdLogout className="mr-3 w-5 h-5" />
              <span className="font-medium text-sm">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between h-20 px-6 sm:px-10 bg-slate-900/30 backdrop-blur-md border-b border-slate-800 z-10">
          <div className="flex items-center gap-4">
            <button className="block sm:hidden text-slate-400 hover:text-white transition-colors">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <div className="hidden sm:block text-sm font-medium text-slate-400 uppercase tracking-widest">
              Admin Portal
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-3">
              <span className="text-sm font-bold text-white">Admin User</span>
              <span className="text-xs text-sky-400">Superadmin</span>
            </div>
            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 ring-2 ring-slate-800">
              <FaUserCircle className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Outlet Area */}
        <main className="flex-grow p-6 sm:p-10 overflow-y-auto z-10 custom-scrollbar">
          <Outlet/>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.4); }
      `}} />
    </section>
  )
}

export default DashboardLayout;