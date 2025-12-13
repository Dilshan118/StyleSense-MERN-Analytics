import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, Lock, Save, ShieldCheck, AlertCircle, CheckCircle2, Package, Clock, XCircle, ChevronRight, LogOut, CreditCard } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user, updateProfile, changePassword, logout } = useContext(AuthContext);

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

    // Active Tab State for Mobile/Desktop Switching
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'security', 'orders'

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

    const navItems = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'orders', label: 'My Orders', icon: Package },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
                        <p className="text-gray-500 mt-1">Manage your details and view your orders</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full border border-gray-200 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="mr-2">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">Member</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <nav className="space-y-1 bg-white p-2 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-black text-white shadow-md shadow-black/10'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                    {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
                                </button>
                            ))}
                            <div className="pt-2 mt-2 border-t border-gray-100">
                                <button
                                    onClick={() => logout && logout()}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Profile Section */}
                        {activeTab === 'profile' && (
                            <div className="grid gap-6 animate-fade-in">
                                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                            <p className="text-sm text-gray-500 mt-1">Update your personal details here.</p>
                                        </div>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <FeedbackMessage message={profileMessage} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup
                                                icon={User}
                                                label="Full Name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="Your full name"
                                            />
                                            <InputGroup
                                                icon={Phone}
                                                label="Phone Number"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            <div className="md:col-span-2">
                                                <InputGroup
                                                    icon={Mail}
                                                    label="Email Address"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                                <button
                                                    type="submit"
                                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
                                                >
                                                    <Save size={16} />
                                                    Save Changes
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-2.5 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Security Section */}
                        {activeTab === 'security' && (
                            <div className="grid gap-6 animate-fade-in">
                                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">Login & Security</h2>
                                        <p className="text-sm text-gray-500 mt-1">Manage your password and security preferences.</p>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                                        <FeedbackMessage message={passwordMessage} />

                                        <div className="space-y-4">
                                            <InputGroup
                                                icon={Lock}
                                                label="Current Password"
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <InputGroup
                                                    icon={Lock}
                                                    label="New Password"
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="New password"
                                                />
                                                <InputGroup
                                                    icon={CheckCircle2}
                                                    label="Confirm Password"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
                                            >
                                                <ShieldCheck size={16} />
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Orders Section */}
                        {activeTab === 'orders' && (
                            <div className="animate-fade-in">
                                <OrderHistory />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // In a real app, user.token comes from auth state
                // Assuming it's there or axios interceptor handles it
                if (!user?.token) {
                    setLoading(false);
                    return;
                }

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

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (loading) return (
        <div className="flex items-center justify-center h-64 bg-white rounded-3xl border border-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                <p className="text-sm text-gray-500 mt-1">You have {orders.length} total orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Package size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start shopping to fill your wardrobe!</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {orders.map((order) => (
                        <div key={order._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="text-sm text-gray-500">
                                            Payment Date: {new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-mono hidden sm:block">ID: {order._id}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <OrderStatusBadge status={order.status} />
                                    <span className="text-lg font-bold text-gray-900">LKR {order.total.toLocaleString()}</span>
                                </div>
                            </div>

                            {order.status === 'Cancelled' && order.cancellationReason && (
                                <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100">
                                    <p className="text-sm text-red-700">
                                        <span className="font-bold">Cancellation Reason:</span> {order.cancellationReason}
                                    </p>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.product?.name || 'Product Item'}</p>
                                                <p className="text-xs text-gray-500">Size: {item.size} • Color: {item.color}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">LKR {(item.price * item.quantity).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} x LKR {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                    }
                </div >
            )}
        </div >
    );
};

const OrderStatusBadge = ({ status }) => {
    const styles = {
        Delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
        Shipped: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Package },
        Processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
        Cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };

    const style = styles[status] || styles.Processing;
    const Icon = style.icon;

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
            <Icon size={14} />
            {status}
        </div>
    );
};

const FeedbackMessage = ({ message }) => {
    if (!message.text) return null;
    const isSuccess = message.type === 'success';
    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl text-sm font-medium animate-in slide-in-from-top-2 fade-in duration-300 ${isSuccess ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
            {isSuccess ? <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />}
            <div>
                <p className={isSuccess ? 'text-green-800' : 'text-red-800'}>{message.text}</p>
            </div>
        </div>
    );
};

const InputGroup = ({ icon: Icon, label, disabled, ...props }) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-900 uppercase tracking-wide ml-1">
            {label}
        </label>
        <div className={`relative group transition-all duration-200 ${disabled ? 'opacity-60 grayscale' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                <Icon size={18} />
            </div>
            <input
                className={`block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/10 focus:bg-white 
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition-all duration-200 sm:text-sm`}
                disabled={disabled}
                {...props}
            />
        </div>
    </div>
);

export default Profile;
