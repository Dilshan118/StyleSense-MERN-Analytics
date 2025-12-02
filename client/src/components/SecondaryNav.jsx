import React from 'react';

const SecondaryNav = ({ filter, setFilter }) => {
    const categories = [
        { label: 'All', value: '' },
        { label: 'Men', value: 'Men' },
        { label: 'Women', value: 'Women' },
        { label: 'Kids', value: 'Kids' },
        { label: 'Sale', value: 'Sale' } // Assuming you might have a 'Sale' category or logic later
    ];

    return (
        <div className="w-full bg-[#f5f5f5] py-6 mb-8 transition-all">
            <div className="max-w-full mx-auto px-6 lg:px-12 flex justify-center items-center space-x-8 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat.label}
                        onClick={() => setFilter({ ...filter, category: cat.value })}
                        className={`text-base font-medium whitespace-nowrap transition-colors ${filter.category === cat.value
                            ? 'text-black border-b-2 border-black pb-1'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SecondaryNav;
