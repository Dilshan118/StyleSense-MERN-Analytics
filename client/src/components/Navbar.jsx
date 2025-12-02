import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, BarChart2, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Logo from './Logo';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="max-w-full mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-24">
                    <Link to="/" className="flex items-center">
                        <Logo className="h-12 w-auto" />
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
                            <Link to="/cart" className="hover:text-gray-600 transition-colors relative">
                                <ShoppingBag size={20} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
