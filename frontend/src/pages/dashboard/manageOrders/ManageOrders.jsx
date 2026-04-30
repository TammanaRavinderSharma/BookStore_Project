import React from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/features/orders/ordersApi';
import Loading from '../../../components/Loading';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiBox } from 'react-icons/fi';
import Swal from 'sweetalert2';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'Pending':
            return <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/20"><FiClock /> Pending</span>;
        case 'Processing':
            return <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20"><FiBox /> Processing</span>;
        case 'Shipped':
            return <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20"><FiTruck /> Shipped</span>;
        case 'Delivered':
            return <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20"><FiCheckCircle /> Delivered</span>;
        default:
            return <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-gray-500/10 text-gray-400 rounded-lg border border-gray-500/20">{status || 'Unknown'}</span>;
    }
};

const ManageOrders = () => {
    const { data: orders = [], isLoading, refetch } = useGetAllOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    
    const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
            Swal.fire({
                title: "Status Updated",
                text: `Order is now ${newStatus}`,
                icon: "success",
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                background: '#1e293b',
                color: '#fff',
            });
            refetch();
        } catch (error) {
            console.error("Failed to update status", error);
            Swal.fire({
                title: "Error",
                text: "Failed to update order status.",
                icon: "error",
                background: '#1e293b',
                color: '#fff',
            });
        }
    };

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loading /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-sky-400 mb-2">
                        <FiPackage size={20} />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Order Management</h2>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white">All Orders</h1>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg text-slate-300 text-sm font-medium">
                    Total Orders: <span className="text-white font-bold">{orders.length}</span>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/50 text-slate-300 uppercase text-xs font-semibold border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-xl">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Current Status</th>
                                <th className="px-6 py-4 text-center rounded-tr-xl">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <FiPackage size={48} className="mb-4 opacity-50" />
                                            <p className="text-lg">No orders found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-sky-400 mb-1">{order.trackingId || `TRK-${order._id.substring(0, 8).toUpperCase()}`}</span>
                                                <span className="text-xs text-slate-500">ID: {order._id}</span>
                                                <span className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{order.name}</span>
                                                <span className="text-xs text-slate-400">{order.email}</span>
                                                <span className="text-xs text-slate-500 mt-1 truncate max-w-[200px]" title={`${order.address.city}, ${order.address.state}`}>
                                                    {order.address.city}, {order.address.state}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-green-400 font-bold">${order.totalPrice.toFixed(2)}</span>
                                                <span className="text-xs text-slate-500">{order.productIds.length} items</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status || 'Pending'} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select
                                                value={order.status || 'Pending'}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                disabled={isUpdating}
                                                className="bg-slate-900 border border-slate-600 text-slate-200 text-xs rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2 outline-none cursor-pointer hover:border-sky-500/50 transition-colors disabled:opacity-50"
                                            >
                                                {STATUS_OPTIONS.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;
