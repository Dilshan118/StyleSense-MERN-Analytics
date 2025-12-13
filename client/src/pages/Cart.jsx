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
            <div className="pt-32 max-w-[1100px] mx-auto px-6 lg:px-8 pb-20">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-medium tracking-tight">Bag</h1>
                    {cart.length === 0 && (
                        <p className="text-gray-500 mt-2">There are no items in your bag.</p>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="mt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                        {/* Left: Bag Items */}
                        <div className="flex-1 space-y-8">
                            {cart.map((item, index) => (
                                <div key={`${item._id}-${index}`} className="flex gap-6 border-b border-gray-100 pb-8">
                                    {/* Product Image */}
                                    <div className="w-36 h-36 bg-[#f5f5f5] flex-shrink-0">
                                        <img
                                            src={`http://localhost:5001${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-base text-gray-900">{item.name}</h3>
                                                <p className="text-gray-500 text-sm">{item.category}'s {item.subCategory}</p>
                                                <p className="text-gray-500 text-sm">{item.color}</p>
                                                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                                    <p>Size <span className="text-gray-900">{item.size}</span></p>
                                                    <p>Quantity <span className="text-gray-900">{item.quantity}</span></p>
                                                </div>
                                            </div>
                                            <p className="font-medium text-base">LKR {item.price * item.quantity}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-6 mt-4">
                                            <button className="text-gray-500 hover:text-black transition-colors">
                                                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" strokeWidth="1.5" d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item._id, item.size, item.color)}
                                                className="text-gray-500 hover:text-black transition-colors"
                                            >
                                                <Trash2 size={20} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:w-[350px] flex-shrink-0">
                            <div className="sticky top-32">
                                <h2 className="text-xl font-medium mb-6">Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-base">
                                        <span className="text-gray-900">Subtotal</span>
                                        <span className="font-medium">LKR {getCartTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-gray-900">Estimated Delivery & Handling</span>
                                        <span className="font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-medium">
                                        <span>Total</span>
                                        <span className="font-medium">LKR {getCartTotal()}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">Shipping & taxes calculated at checkout</p>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-black text-white py-4 rounded-full font-bold mt-6 hover:bg-gray-800 transition-colors"
                                    >
                                        Checkout • LKR {getCartTotal()}
                                    </button>
                                    <button className="w-full bg-[#f5f5f5] text-black py-4 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                        PayPal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
