import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24">
                <Hero />
                <ProductGrid />
            </div>
        </div>
    );
};

export default Home;
