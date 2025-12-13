import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-serif font-medium text-gray-900 mb-4">Shop All</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">Explore our latest collection of premium clothing, designed for style and comfort.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
                        {products.map((product) => (
                            <Link key={product._id} to={`/product/${product._id}`} className="group">
                                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                                    {product.image ? (
                                        <img
                                            src={`http://localhost:5001${product.image}`}
                                            alt={product.name}
                                            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                    {product.stock === 0 && (
                                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-semibold text-gray-900 rounded-full">
                                            Sold Out
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 group-hover:underline underline-offset-4 decoration-1">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm text-gray-500">{product.category}</p>
                                    <p className="text-sm font-medium text-gray-900">LKR {product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
