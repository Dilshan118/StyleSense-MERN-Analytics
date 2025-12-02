import React from 'react';
import Navbar from '../components/Navbar';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Analytics = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24">
                <div className="max-w-full mx-auto px-6 lg:px-12 py-12">
                    <h1 className="text-4xl font-medium mb-4">Analytics & Insights</h1>
                    <p className="text-gray-500 mb-8">AI-powered predictions for inventory and sales trends.</p>
                </div>
                <AnalyticsDashboard />
            </div>
        </div>
    );
};

export default Analytics;
