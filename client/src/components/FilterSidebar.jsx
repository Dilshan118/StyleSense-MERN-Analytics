import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-t border-gray-100 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left font-medium text-base hover:text-gray-600 transition-colors"
            >
                {title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && (
                <div className="mt-4 space-y-2 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};

const FilterSidebar = ({ filter, setFilter, isOpen, onClose }) => {
    const categories = ['Men', 'Women', 'Kids'];
    const subCategories = ['T-Shirts', 'Jeans', 'Jackets', 'Dresses'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['White', 'Black', 'Grey', 'Blue', 'Red', 'Pink', 'Yellow', 'Green'];

    const handleCategoryChange = (category) => {
        setFilter(prev => ({
            ...prev,
            category: prev.category === category ? '' : category
        }));
    };

    const handleSubCategoryChange = (subCategory) => {
        setFilter(prev => ({
            ...prev,
            subCategory: prev.subCategory === subCategory ? '' : subCategory
        }));
    };

    const handleSizeChange = (size) => {
        setFilter(prev => {
            const currentSizes = prev.sizes || [];
            const newSizes = currentSizes.includes(size)
                ? currentSizes.filter(s => s !== size)
                : [...currentSizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const handleColorChange = (color) => {
        setFilter(prev => {
            const currentColors = prev.colors || [];
            const newColors = currentColors.includes(color)
                ? currentColors.filter(c => c !== color)
                : [...currentColors, color];
            return { ...prev, colors: newColors };
        });
    };

    return (
        <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            lg:relative lg:transform-none lg:shadow-none lg:w-full lg:block
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            <div className="p-6 lg:p-0 h-full overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-1">
                    {/* Gender Section */}
                    <FilterSection title="Gender" defaultOpen={true}>
                        {categories.map((category) => (
                            <label key={category} className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filter.category === category}
                                    onChange={() => handleCategoryChange(category)}
                                    className="mr-3 h-4 w-4 rounded border-gray-300 text-black focus:ring-black transition-all"
                                />
                                <span className="text-sm group-hover:text-gray-600 transition-colors">{category}</span>
                            </label>
                        ))}
                    </FilterSection>

                    {/* Product Type Section */}
                    <FilterSection title="Product Type" defaultOpen={true}>
                        {subCategories.map((sub) => (
                            <label key={sub} className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filter.subCategory === sub}
                                    onChange={() => handleSubCategoryChange(sub)}
                                    className="mr-3 h-4 w-4 rounded border-gray-300 text-black focus:ring-black transition-all"
                                />
                                <span className="text-sm group-hover:text-gray-600 transition-colors">{sub}</span>
                            </label>
                        ))}
                    </FilterSection>

                    {/* Size Section */}
                    <FilterSection title="Size" defaultOpen={true}>
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    className={`
                                        py-2 text-sm border rounded-md transition-all
                                        ${(filter.sizes || []).includes(size)
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'}
                                    `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Color Section */}
                    <FilterSection title="Color" defaultOpen={true}>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    className={`
                                        w-8 h-8 rounded-full border transition-all relative
                                        ${(filter.colors || []).includes(color) ? 'ring-2 ring-offset-2 ring-black' : 'hover:scale-110'}
                                    `}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                >
                                    {color === 'White' && <span className="sr-only">White</span>}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Price Range Section */}
                    <FilterSection title="Shop By Price" defaultOpen={true}>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filter.minPrice}
                                        onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:border-black focus:ring-black"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">LKR</span>
                                </div>
                                <span className="text-gray-400">to</span>
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filter.maxPrice}
                                        onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:border-black focus:ring-black"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">LKR</span>
                                </div>
                            </div>
                        </div>
                    </FilterSection>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
