import React, { useState } from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiBox, FiMapPin } from 'react-icons/fi';
import Loading from '../../components/Loading';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];

// Component for the tracking progress bar
const TrackingTimeline = ({ currentStatus }) => {
    const currentIndex = ORDER_STATUSES.indexOf(currentStatus || 'Pending');

    return (
        <div className="relative flex justify-between items-center w-full my-8 px-4">
            {/* Connecting line background */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full z-0" />
            
            {/* Connecting line filled */}
            <div 
                className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-sky-500 rounded-full z-0 transition-all duration-1000 ease-out" 
                style={{ width: `calc(${(currentIndex / 3) * 100}% - 4rem)` }} 
            />

            {/* Steps */}
            {[
                { label: 'Pending', icon: <FiClock size={18} /> },
                { label: 'Processing', icon: <FiBox size={18} /> },
                { label: 'Shipped', icon: <FiTruck size={18} /> },
                { label: 'Delivered', icon: <FiCheckCircle size={18} /> },
            ].map((step, idx) => {
                const isCompleted = idx <= currentIndex;
                const isActive = idx === currentIndex;

                return (
                    <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                            ${isCompleted ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]' : 'bg-gray-800 border-white/20 text-gray-500'}
                            ${isActive ? 'scale-110 ring-4 ring-sky-500/20' : ''}
                        `}>
                            {step.icon}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-sky-400' : 'text-gray-500'}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const OrderPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' or 'history'

    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email, {
        // Automatically refetch when this page is visited
        refetchOnMountOrArgChange: true,
    });

    if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loading /></div>;
    if (isError) return <div className="text-center text-red-400 py-20">Error retrieving your orders. Please try again.</div>;

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="max-w-screen-xl mx-auto py-12 px-4 min-h-[70vh]">
            {/* Header */}
            <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex justify-center sm:justify-start items-center gap-2 text-sky-400 text-sm font-bold uppercase tracking-widest mb-2">
                        <FiPackage size={16} />
                        <span>My Account</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white">Your Orders</h1>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-sm">
                    <button 
                        onClick={() => setActiveTab('tracking')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'tracking' ? 'bg-sky-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Order Tracking
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'history' ? 'bg-sky-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Order History
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                    <div className="w-24 h-24 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiPackage size={48} className="text-sky-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
                    <p className="text-gray-500">When you place an order, it will show up here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sortedOrders.map((order) => (
                        <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:border-sky-500/30">
                            
                            {/* Card Header */}
                            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                                        <p className="text-white font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                                        <p className="text-green-400 font-bold">₹{order.totalPrice.toFixed(0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Items</p>
                                        <p className="text-white font-medium">{order.productIds?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking ID</p>
                                    <p className="text-sky-400 font-mono text-sm bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 inline-block">
                                        {order.trackingId || `TRK-${order._id.substring(0, 8).toUpperCase()}`}
                                    </p>
                                </div>
                            </div>

                            {/* Card Body based on Tab */}
                            <div className="p-6">
                                {activeTab === 'tracking' ? (
                                    <div className="py-4">
                                        <h3 className="text-lg font-bold text-white mb-8 text-center sm:text-left">
                                            Status: <span className="text-sky-400">{order.status || 'Pending'}</span>
                                        </h3>
                                        <TrackingTimeline currentStatus={order.status || 'Pending'} />
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Shipping Info */}
                                        <div className="bg-gray-900/50 rounded-xl p-5 border border-white/5">
                                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                                <FiMapPin className="text-sky-400" /> Shipping Address
                                            </h3>
                                            <p className="text-gray-300 font-medium mb-1">{order.name}</p>
                                            <p className="text-gray-500 text-sm">{order.email}</p>
                                            <p className="text-gray-500 text-sm mb-3">{order.phone}</p>
                                            <p className="text-gray-400 text-sm">
                                                {order.address?.street}<br />
                                                {order.address?.city}, {order.address?.state} {order.address?.zipcode}<br />
                                                {order.address?.country}
                                            </p>
                                        </div>

                                        {/* Order Details */}
                                        <div className="bg-gray-900/50 rounded-xl p-5 border border-white/5">
                                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                                <FiBox className="text-sky-400" /> Order Summary
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-2">
                                                Order ID: <span className="text-gray-300 font-mono">{order._id}</span>
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <div className="flex justify-between items-center text-sm mb-2">
                                                    <span className="text-gray-400">Subtotal ({order.productIds?.length || 0} items)</span>
                                                    <span className="text-white">₹{order.totalPrice.toFixed(0)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm mb-4">
                                                    <span className="text-gray-400">Shipping</span>
                                                    <span className="text-green-400">Free</span>
                                                </div>
                                                <div className="flex justify-between items-center font-bold text-lg">
                                                    <span className="text-white">Total</span>
                                                    <span className="text-green-400">₹{order.totalPrice.toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;