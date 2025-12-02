import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import FilterSidebar from './FilterSidebar';
import SecondaryNav from './SecondaryNav';

const ProductGrid = () => {
    const { addToCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [filter, setFilter] = useState({
        category: '',
        subCategory: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest'
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = 'http://localhost:5001/api/products';
                const params = new URLSearchParams();

                if (filter.category) params.append('category', filter.category);
                if (filter.subCategory) params.append('subCategory', filter.subCategory);
                if (filter.minPrice) params.append('minPrice', filter.minPrice);
                if (filter.maxPrice) params.append('maxPrice', filter.maxPrice);
                if (filter.sort) params.append('sort', filter.sort);

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
        default: isSidebarOpen ? 3 : 4,
        1280: isSidebarOpen ? 3 : 4,
        1024: isSidebarOpen ? 2 : 3,
        768: 2,
        640: 1
    };

    return (
        <div className="min-h-screen bg-white">
            <SecondaryNav filter={filter} setFilter={setFilter} />

            <div className="max-w-full mx-auto px-6 lg:px-12 pb-12">
                {/* Header / Toolbar */}
                <div className="flex justify-between items-center mb-8 sticky top-32 z-30 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                    <h2 className="text-xl font-medium">
                        {filter.category ? `${filter.category}'s Shoes & Clothing` : 'All Products'}
                        <span className="text-gray-500 ml-2 text-sm">({products.length})</span>
                    </h2>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:flex items-center gap-2 text-base font-medium hover:text-gray-600 transition-colors"
                        >
                            {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
                            <SlidersHorizontal size={18} />
                        </button>

                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="lg:hidden flex items-center gap-2 text-sm font-medium border px-4 py-2 rounded-full hover:bg-gray-50"
                        >
                            Filter <SlidersHorizontal size={16} />
                        </button>

                        <div className="relative group">
                            <button className="flex items-center gap-1 text-base font-medium hover:text-gray-600">
                                Sort By <ChevronDown size={16} />
                            </button>
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <button onClick={() => setFilter({ ...filter, sort: 'newest' })} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Newest</button>
                                <button onClick={() => setFilter({ ...filter, sort: 'price_asc' })} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Price: Low-High</button>
                                <button onClick={() => setFilter({ ...filter, sort: 'price_desc' })} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Price: High-Low</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 relative items-start">
                    {/* Desktop Sidebar */}
                    <div className={`hidden lg:block transition-all duration-300 ease-in-out sticky top-48 h-[calc(100vh-12rem)] overflow-y-auto ${isSidebarOpen ? 'w-60 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                        <FilterSidebar
                            filter={filter}
                            setFilter={setFilter}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    </div>

                    {/* Mobile Sidebar Drawer */}
                    <div className="lg:hidden">
                        <FilterSidebar
                            filter={filter}
                            setFilter={setFilter}
                            isOpen={isMobileFiltersOpen}
                            onClose={() => setIsMobileFiltersOpen(false)}
                        />
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : (
                            products.length === 0 ? (
                                <div className="text-center py-20 w-full">
                                    <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                    <button
                                        onClick={() => setFilter({ category: '', subCategory: '', minPrice: '', maxPrice: '', sort: 'newest' })}
                                        className="mt-4 text-black underline hover:text-gray-600"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="flex w-auto -ml-4"
                                    columnClassName="pl-4 bg-clip-padding"
                                >
                                    {products.map((product) => (
                                        <div key={product._id} className="mb-12 group cursor-pointer">
                                            <Link to={`/product/${product._id}`}>
                                                <div className="relative overflow-hidden bg-[#f5f5f5] aspect-[4/5] mb-4">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                                    />
                                                    {product.isTrending && (
                                                        <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold tracking-wider shadow-sm">
                                                            Just In
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
                                                    <p className="text-sm text-gray-500">{product.category}'s {product.subCategory}</p>
                                                </div>
                                            </Link>
                                            <div className="flex justify-between items-center mt-3">
                                                <p className="text-base font-medium text-gray-900">${product.price}</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToCart(product);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800"
                                                >
                                                    Add to Bag
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </Masonry>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;
