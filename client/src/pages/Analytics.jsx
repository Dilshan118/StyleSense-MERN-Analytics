import React from 'react';
import Navbar from '../components/Navbar';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Analytics = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-serif font-bold mb-4">Analytics & Insights</h1>
                    <p className="text-gray-600 mb-8">AI-powered predictions for inventory and sales trends.</p>
                </div>
                <AnalyticsDashboard />
            </div>
        </div>
    );
};

export default Analytics;
