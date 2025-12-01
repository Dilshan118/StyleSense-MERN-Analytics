import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/products/${id}`);
                setProduct(response.data);
                // Default selections if available
                if (response.data.sizes?.length > 0) setSelectedSize(response.data.sizes[0]);
                if (response.data.colors?.length > 0) setSelectedColor(response.data.colors[0]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select a size and color');
            return;
        }
        addToCart(product, selectedSize, selectedColor);
        // Optional: Open cart drawer or show notification
        alert('Added to Bag');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!product) {
        return <div className="min-h-screen bg-white flex justify-center items-center">Product not found</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-16 lg:pt-0 flex flex-col lg:flex-row min-h-screen">
                {/* Left: Image Section */}
                <div className="lg:w-2/3 bg-[#f5f5f5] relative flex items-center justify-center min-h-[50vh] lg:min-h-screen">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover lg:object-contain max-h-[80vh] mix-blend-multiply"
                    />
                    {product.isTrending && (
                        <div className="absolute top-8 left-8 bg-white px-3 py-1 text-xs font-bold tracking-wider">
                            TRENDING
                        </div>
                    )}
                </div>

                {/* Right: Details Section */}
                <div className="lg:w-1/3 px-6 py-8 lg:px-12 lg:py-24 overflow-y-auto h-full">
                    <div className="max-w-md mx-auto lg:mx-0">
                        <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-2 tracking-tight">
                            {product.name}
                        </h1>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-gray-500 font-medium">{product.category}</p>
                                <p className="text-gray-400 text-sm">{product.subCategory}</p>
                            </div>
                            <p className="text-xl font-medium">${product.price}</p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-sm">Select Size</span>
                                <span className="text-gray-400 text-sm cursor-pointer hover:text-black">Size Guide</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {product.sizes && product.sizes.length > 0 ? (
                                    product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 border rounded-md text-sm font-medium transition-all ${selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-200 hover:border-black text-gray-900'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))
                                ) : (
                                    // Fallback if no sizes defined
                                    ['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 border rounded-md text-sm font-medium transition-all ${selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-200 hover:border-black text-gray-900'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Color Selector */}
                        <div className="mb-10">
                            <span className="font-medium text-sm block mb-3">Select Color</span>
                            <div className="flex space-x-3">
                                {product.colors && product.colors.length > 0 ? (
                                    product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? 'border-black' : 'border-transparent'
                                                }`}
                                        >
                                            <div
                                                className="h-6 w-6 rounded-full border border-gray-200"
                                                style={{ backgroundColor: color.toLowerCase() }}
                                                title={color}
                                            ></div>
                                        </button>
                                    ))
                                ) : (
                                    // Fallback
                                    <button
                                        onClick={() => setSelectedColor('Black')}
                                        className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${selectedColor === 'Black' ? 'border-black' : 'border-transparent'
                                            }`}
                                    >
                                        <div className="h-6 w-6 rounded-full bg-black"></div>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-transform active:scale-95 mb-6"
                        >
                            Add to Bag
                        </button>

                        {/* Description */}
                        <div className="prose prose-sm text-gray-600 mt-8">
                            <p>
                                Experience premium comfort and style with the {product.name}.
                                Designed for the modern individual, this piece combines timeless aesthetics with contemporary functionality.
                            </p>
                            <ul className="list-disc pl-4 mt-4 space-y-1">
                                <li>Premium materials</li>
                                <li>Modern fit</li>
                                <li>Versatile design</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
