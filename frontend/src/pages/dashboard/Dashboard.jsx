import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md'
import RevenueChart from './RevenueChart';
import { FiBookOpen, FiDollarSign, FiTrendingUp, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =  await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if(loading) return <div className="h-full flex items-center justify-center"><Loading/></div>

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-1">Dashboard Overview</h1>
                    <p className="text-slate-400 text-sm">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/dashboard/manage-books" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg border border-slate-700 transition-all shadow-lg">
                        Manage Books
                    </Link>
                    <Link to="/dashboard/add-new-book" className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all">
                        + Add Book
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* Products */}
                <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <FiBookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Total Books</p>
                        <h3 className="text-2xl font-bold text-white">{data?.totalBooks || 0}</h3>
                    </div>
                </div>

                {/* Sales */}
                <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                        <FiDollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Total Sales</p>
                        <h3 className="text-2xl font-bold text-white">${data?.totalSales || 0}</h3>
                    </div>
                </div>

                {/* Trending */}
                <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                        <FiTrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Trending Books</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-white">{data?.trendingBooks || 0}</h3>
                            <span className="text-xs text-green-400 font-medium">+13%</span>
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                        <FiShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Total Orders</p>
                        <h3 className="text-2xl font-bold text-white">{data?.totalOrders || 0}</h3>
                    </div>
                </div>

            </section>

            {/* Main Content Grid */}
            <section className="grid lg:grid-cols-3 gap-6">
                
                {/* Revenue Chart Section */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
                        <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1 outline-none">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-xl border border-slate-700/50 p-2">
                         {/* Ensure RevenueChart handles dark mode if it's a generic component */}
                         <div className="opacity-90 grayscale-[0.2]">
                             <RevenueChart />
                         </div>
                    </div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
                    
                    <div className="space-y-4 flex-grow">
                        <Link to="/dashboard/manage-orders" className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg"><FiShoppingBag /></div>
                                <div>
                                    <p className="text-white font-medium text-sm">Process Orders</p>
                                    <p className="text-slate-500 text-xs">Update shipping statuses</p>
                                </div>
                            </div>
                            <FiArrowRight className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link to="/dashboard/manage-books" className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><FiBookOpen /></div>
                                <div>
                                    <p className="text-white font-medium text-sm">Inventory Check</p>
                                    <p className="text-slate-500 text-xs">Edit book details</p>
                                </div>
                            </div>
                            <FiArrowRight className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <p className="text-slate-400 text-sm">System operating normally</p>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default Dashboard;