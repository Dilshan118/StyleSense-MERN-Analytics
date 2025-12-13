import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Calendar } from 'lucide-react';

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/analytics/predict');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!data) return <div>Error loading data</div>;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    };

    return (
        <div className="max-w-full mx-auto px-6 lg:px-12 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-[#f5f5f5] p-8 transition-transform duration-300 hover:scale-[1.02]">
                    <div className="flex items-center space-x-2 mb-4 text-gray-500">
                        <TrendingUp size={20} />
                        <span className="text-sm font-medium tracking-wider">TREND ALERT</span>
                    </div>
                    <h3 className="text-4xl font-medium mb-2">{data.trendAlert}</h3>
                    <p className="text-gray-500 text-sm">Most popular category this week</p>
                </div>

                <div className="bg-[#f5f5f5] p-8 md:col-span-2 transition-transform duration-300 hover:scale-[1.01]">
                    <div className="flex items-center space-x-2 mb-4 text-gray-500">
                        <Calendar size={20} />
                        <span className="text-sm font-medium tracking-wider">REVENUE FORECAST (NEXT 7 DAYS)</span>
                    </div>
                    <div className="h-64 w-full flex items-center justify-center bg-gray-100 text-gray-400">
                        {/* Chart Disabled due to Library Incompatibility */}
                        <p>Revenue Prediction Chart Unavailable</p>
                    </div>
                </div>
            </div>

            {/* Stockout Risk Alert - NEW SECTION */}
            <div className="bg-red-50 p-8 border border-red-100 rounded-lg">
                <div className="flex items-center space-x-2 mb-6 text-red-700">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold tracking-wider uppercase">Stockout Risk Alerts (High Priority)</span>
                </div>

                {data.stockRisks && data.stockRisks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.stockRisks.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded border border-red-200 shadow-sm flex items-center space-x-4">
                                <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <img src={`http://localhost:5001${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Current Stock:</span>
                                            <span className="font-medium text-red-600">{item.stock} units</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Predicted Demand:</span>
                                            <span className="font-medium">{item.predictedSales} units</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No immediate stockout risks detected based on current analysis.</p>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
