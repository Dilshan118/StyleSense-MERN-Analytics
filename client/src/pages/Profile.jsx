import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, Lock, Save, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile, changePassword } = useContext(AuthContext);

    // Profile State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Feedback State
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileMessage({ type: '', text: '' });

        const result = await updateProfile({ name, email, phone });

        if (result.success) {
            setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
            setIsEditing(false);
            setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
        } else {
            setProfileMessage({ type: 'error', text: result.message });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        const result = await changePassword({ currentPassword, newPassword });

        if (result.success) {
            setPasswordMessage({ type: 'success', text: 'Password changed successfully' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
        } else {
            setPasswordMessage({ type: 'error', text: result.message });
        }
    };

    // Use InputGroup defined outside
    const FeedbackMessage = ({ message }) => {
        if (!message.text) return null;
        const isSuccess = message.type === 'success';
        return (
            <div className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium animate-fade-in ${isSuccess ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl font-serif font-medium text-gray-900 mb-2">
                        Hello, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-gray-500 text-lg">Manage your personal information and security settings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Profile Details */}
                    <div className="lg:col-span-7 space-y-6">
                        <section className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <User size={120} />
                            </div>

                            <div className="flex items-center justify-between mb-8 relative">
                                <div>
                                    <h2 className="text-2xl font-serif font-medium text-gray-900">Personal Details</h2>
                                    <p className="text-gray-500 text-sm mt-1">Update your basic information</p>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
                                    >
                                        Edit Details
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-6 relative">
                                <FeedbackMessage message={profileMessage} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup
                                        icon={User}
                                        label="Full Name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing}
                                    />
                                    <InputGroup
                                        icon={Phone}
                                        label="Phone Number"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Add phone number"
                                        disabled={!isEditing}
                                    />
                                    <div className="md:col-span-2">
                                        <InputGroup
                                            icon={Mail}
                                            label="Email Address"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex items-center gap-4 pt-4 animate-fade-in">
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
                                        >
                                            <Save size={18} />
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </section>
                    </div>

                    {/* Right Column: Security */}
                    <div className="lg:col-span-5 space-y-6">
                        <section className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <ShieldCheck size={120} />
                            </div>

                            <div className="mb-8 relative">
                                <h2 className="text-2xl font-serif font-medium text-gray-900">Security</h2>
                                <p className="text-gray-500 text-sm mt-1">Ensure your account is secure with a strong password</p>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-5 relative">
                                <FeedbackMessage message={passwordMessage} />

                                <InputGroup
                                    icon={Lock}
                                    label="Current Password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <div className="border-t border-gray-100 my-4"></div>
                                <InputGroup
                                    icon={Lock}
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                />
                                <InputGroup
                                    icon={CheckCircle2}
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                />

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-white bg-black hover:bg-gray-800 shadow-lg shadow-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Order History Section */}
                        <OrderHistory />
                    </div>
                </div>
            </div>
        </div>
    );
};

import axios from 'axios';
import { ShoppingBag, Clock, Package, CheckCircle, XCircle } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const { data } = await axios.get('http://localhost:5001/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching my orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.token) {
            fetchOrders();
        }
    }, [user]);

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
            case 'Delivered': return <CheckCircle size={14} className="mr-1.5" />;
            case 'Shipped': return <Package size={14} className="mr-1.5" />;
            case 'Processing': return <Clock size={14} className="mr-1.5" />;
            case 'Cancelled': return <XCircle size={14} className="mr-1.5" />;
            default: return <Clock size={14} className="mr-1.5" />;
        }
    };

    if (loading) return null;

    return (
        <section className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <ShoppingBag size={120} />
            </div>

            <div className="mb-8 relative">
                <h2 className="text-2xl font-serif font-medium text-gray-900">Order History</h2>
                <p className="text-gray-500 text-sm mt-1">Track your recent purchases</p>
            </div>

            <div className="relative space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <ShoppingBag className="mx-auto text-gray-300 mb-2" size={32} />
                        <p className="text-gray-500 text-sm">No orders yet</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all duration-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-mono mb-1">#{order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                            <span className="text-gray-600">
                                                <span className="text-gray-900 font-medium">{item.quantity}x</span> {item.product?.name || 'Product'}
                                                <span className="text-gray-400 ml-1">({item.size}, {item.color})</span>
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">LKR {item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Total Amount</span>
                                <span className="text-base font-bold text-gray-900">LKR {order.total}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

const InputGroup = ({ icon: Icon, label, ...props }) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                <Icon size={18} />
            </div>
            <input
                className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 focus:bg-white transition-all duration-200 sm:text-sm"
                {...props}
            />
        </div>
    </div>
);

export default Profile;
