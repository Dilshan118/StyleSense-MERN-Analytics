import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');
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
                // Filter out cancelled orders from the main view
                const activeOrders = response.data.filter(order => order.status !== 'Cancelled');
                setOrders(activeOrders);
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

    const updateStatus = async (id, status, reason = null) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };
            const payload = { status };
            if (reason) {
                payload.cancellationReason = reason;
            }

            await axios.put(`http://localhost:5001/api/orders/${id}/status`, payload, config);

            await axios.put(`http://localhost:5001/api/orders/${id}/status`, payload, config);

            // Optimistic update: Remove order if cancelled, otherwise update status
            if (status === 'Cancelled') {
                setOrders(orders.filter(order => order._id !== id));
            } else {
                setOrders(orders.map(order =>
                    order._id === id ? { ...order, status: status, cancellationReason: reason } : order
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setDeleteReason('');
    };

    const confirmDelete = () => {
        if (orderToDelete.status === 'Pending' && !deleteReason.trim()) {
            alert('Please provide a reason for cancellation.');
            return;
        }
        updateStatus(orderToDelete._id, 'Cancelled', deleteReason);
        setOrderToDelete(null);
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
                                <th className="p-4 font-medium text-right">Actions</th>
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
                                            {new Date(order.date).toLocaleDateString()}
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
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(order)}
                                                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center">
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

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                                <p className="text-sm text-gray-500">#{selectedOrder._id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer</h3>
                                    <div className="font-medium">{selectedOrder.user?.name || 'Guest'}</div>
                                    <div className="text-sm text-gray-500">{selectedOrder.user?.email}</div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Info</h3>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Date:</span>
                                        <span className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Total:</span>
                                        <span className="font-medium">LKR {selectedOrder.total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Status:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder.shippingAddress && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Details</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg text-sm border border-gray-100">
                                        <div className="font-medium text-gray-900">{selectedOrder.shippingAddress.address}</div>
                                        <div className="text-gray-600">
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                                        </div>
                                        <div className="text-gray-600">{selectedOrder.shippingAddress.country}</div>
                                    </div>
                                </div>
                            )}

                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Items ({selectedOrder.items.length})</h3>
                            <div className="space-y-4">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100">
                                        <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `http://localhost:5001${item.product.image.startsWith('/') ? '' : '/'}${item.product.image}`) : '/placeholder.png'}
                                                alt={item.product?.name || 'Product'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{item.product?.name || 'Item Removed'}</h4>
                                            <div className="text-sm text-gray-500 mt-1 space-y-1">
                                                <div className="flex gap-4">
                                                    <span>Size: <span className="text-black font-medium">{item.size}</span></span>
                                                    <span>Color: <span className="text-black font-medium">{item.color}</span></span>
                                                </div>
                                                <div>Qty: <span className="text-black font-medium">{item.quantity}</span></div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">LKR {(item.price * item.quantity).toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">{item.quantity} x {item.price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel/Delete Order Modal */}
            {orderToDelete && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">
                                {orderToDelete.status === 'Pending' ? 'Cancel Order' : 'Delete Order'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Are you sure you want to cancel order #{orderToDelete._id.slice(-6).toUpperCase()}?
                            </p>
                        </div>

                        <div className="p-6">
                            {orderToDelete.status === 'Pending' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for Cancellation <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={deleteReason}
                                        onChange={(e) => setDeleteReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                        rows="3"
                                        placeholder="e.g. Out of stock, Customer request..."
                                    ></textarea>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setOrderToDelete(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
