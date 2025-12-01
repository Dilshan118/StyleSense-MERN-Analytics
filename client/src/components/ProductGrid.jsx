import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import axios from 'axios';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', subCategory: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = 'http://localhost:5001/api/products';
                const params = new URLSearchParams();
                if (filter.category) params.append('category', filter.category);
                if (filter.subCategory) params.append('subCategory', filter.subCategory);

                if (params.toString()) url += `?${params.toString()}`;

                const response = await axios.get(url);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filter]);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold">LATEST ARRIVALS</h2>
                <div className="flex space-x-4">
                    <select
                        className="border-none bg-transparent text-sm font-medium focus:ring-0 cursor-pointer"
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            ) : (
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto -ml-4"
                    columnClassName="pl-4 bg-clip-padding"
                >
                    {products.map((product) => (
                        <div key={product._id} className="mb-8 group cursor-pointer">
                            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {product.isTrending && (
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold tracking-wider">
                                        TRENDING
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-medium truncate">{product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">${product.price}</p>
                        </div>
                    ))}
                </Masonry>
            )}
        </div>
    );
};

export default ProductGrid;
