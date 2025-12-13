import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                };
                const response = await axios.get('http://localhost:5001/api/orders', config);
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        if (currentUser && currentUser.token) {
            fetchOrders();
        }
    }, [currentUser]);

    const updateStatus = async (id, status) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };
            await axios.put(`http://localhost:5001/api/orders/${id}/status`, { status }, config);

            // Optimistic update
            setOrders(orders.map(order =>
                order._id === id ? { ...order, status: status } : order
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={14} className="mr-1" />;
            case 'Shipped': return <Truck size={14} className="mr-1" />;
            case 'Processing': return <Clock size={14} className="mr-1" />;
            case 'Cancelled': return <AlertCircle size={14} className="mr-1" />;
            default: return <Package size={14} className="mr-1" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Order Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Process and track customer orders</p>
                </div>
                <div className="bg-white p-2 rounded-full border border-gray-200 shadow-sm text-sm font-medium px-4">
                    Total Orders: {orders.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Items</th>
                                <th className="p-4 font-medium">Total</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-gray-500 text-xs">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{order.user?.name || 'Guest'}</div>
                                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {order.items.length} items
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            LKR {order.total}
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black ${getStatusColor(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="flex flex-col items-center text-gray-400">
                                            <ShoppingBag size={48} strokeWidth={1} className="mb-4" />
                                            <p className="text-lg font-medium text-gray-900">No orders yet</p>
                                            <p className="text-sm">New orders will appear here automatically.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
