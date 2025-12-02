import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Cart = () => {
    const { cart, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    price: item.price
                })),
                total: getCartTotal()
            };

            await axios.post('http://localhost:5001/api/orders', orderData, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            clearCart();
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            console.error('Checkout error:', error);
            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 max-w-full mx-auto px-6 lg:px-12">
                <h1 className="text-3xl font-bold mb-8 tracking-tight">YOUR CART</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Your cart is empty.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-black underline font-medium hover:text-gray-600"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            {cart.map((item, index) => (
                                <div key={`${item._id}-${index}`} className="flex gap-4 border-b border-gray-100 py-6">
                                    <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Color: {item.color}</p>
                                                <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">${item.price * item.quantity}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id, item.size, item.color)}
                                            className="text-gray-400 hover:text-red-500 mt-4 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-[#f5f5f5] p-8 rounded-xl">
                                <h2 className="text-lg font-bold mb-4">ORDER SUMMARY</h2>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg mb-6">
                                    <span>Total</span>
                                    <span>${getCartTotal()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors"
                                >
                                    CHECKOUT
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
