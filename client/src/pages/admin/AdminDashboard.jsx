import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { LayoutDashboard, Package, Users, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex pt-24">
                {/* Sidebar */}
                <aside className="w-64 bg-white min-h-[calc(100vh-64px)] border-r border-gray-200 hidden md:block">
                    <div className="p-6">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Management
                        </h2>
                        <nav className="space-y-1">
                            <Link
                                to="/admin/products"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/admin/products')}`}
                            >
                                <Package size={20} />
                                Products
                            </Link>
                            {/* Future: Users, Orders etc */}
                            <Link
                                to="/admin/users"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/admin/users')}`}
                            >
                                <Users size={20} />
                                Users
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
