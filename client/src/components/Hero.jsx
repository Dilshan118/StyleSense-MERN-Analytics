import React from 'react';

const Hero = () => {
    return (
        <div className="relative h-[70vh] w-full bg-gray-50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                    alt="Fashion Hero"
                    className="w-full h-full object-cover grayscale opacity-20"
                />
            </div>
            <div className="relative z-10 text-center space-y-6 max-w-3xl px-4">
                <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">
                    ELEVATE YOUR STYLE
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-light tracking-wide">
                    CURATED FASHION FOR THE MODERN INDIVIDUAL
                </p>
                <button className="bg-black text-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors">
                    EXPLORE COLLECTION
                </button>
            </div>
        </div>
    );
};

export default Hero;
