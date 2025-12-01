import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, BarChart2, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-serif font-bold tracking-tighter">
                        STYLESENSE.
                    </Link>

                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
                            SHOP
                        </Link>
                        <Link to="/analytics" className="text-sm font-medium hover:text-gray-600 transition-colors flex items-center gap-2">
                            <BarChart2 size={16} />
                            ANALYTICS
                        </Link>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-sm font-medium hidden md:block">Hi, {user.name.split(' ')[0]}</span>
                                    <button onClick={handleLogout} className="hover:text-gray-600 transition-colors" title="Logout">
                                        <LogOut size={20} />
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="hover:text-gray-600 transition-colors">
                                    <User size={20} />
                                </Link>
                            )}
                            <button className="hover:text-gray-600 transition-colors">
                                <ShoppingBag size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
