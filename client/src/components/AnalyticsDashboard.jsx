import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.predictions}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#000' }}
                                    itemStyle={{ color: '#000' }}
                                    labelStyle={{ color: '#9CA3AF' }}
                                    formatter={(value) => [`LKR ${value}`, 'Revenue']}
                                    labelFormatter={formatDate}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="predictedRevenue"
                                    stroke="#000"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#000' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
