import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, AlertTriangle, Package, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'];

const AnalyticsDashboard = () => {
    const [predictData, setPredictData] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [predictRes, statsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/analytics/predict`),
                    axios.get(`${API_BASE_URL}/api/analytics/stats`)
                ]);
                setPredictData(predictRes.data);
                setStatsData(statsRes.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                setError(error.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <AlertTriangle size={48} className="mb-4" />
                <h3 className="text-xl font-medium">Error Loading Dashboard</h3>
                <p>{error}</p>
                <p className="text-sm text-gray-500 mt-2">Make sure the backend server is running and updated.</p>
            </div>
        );
    }

    if (!predictData || !statsData) return <div>No data available</div>;

    const { predictions, trendAlert, stockRisks } = predictData;
    const { totalUsers, totalOrders, totalRevenue, averageOrderValue, salesByCategory, topProducts } = statsData;

    return (
        <div className="space-y-12">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={`LKR ${totalRevenue.toLocaleString()}`} icon={DollarSign} />
                <KpiCard title="Total Orders" value={totalOrders} icon={ShoppingBag} />
                <KpiCard title="Avg. Order Value" value={`LKR ${averageOrderValue}`} icon={TrendingUp} />
                <KpiCard title="Total Customers" value={totalUsers} icon={Users} />
            </div>

            {/* Charts Section 1: Forecast & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Forecast */}
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
                    <h3 className="text-lg font-medium mb-6">Revenue Forecast (Next 7 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={predictions}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', border: 'none' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line type="monotone" dataKey="predictedRevenue" stroke="#000" strokeWidth={2} dot={{ r: 4, fill: '#000' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
                    <h3 className="text-lg font-medium mb-6">Sales by Category</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={salesByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {salesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products & Stock Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
                    <h3 className="text-lg font-medium mb-6">Top Selling Products</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topProducts} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="sales" fill="#000" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stock Risks */}
                <div className="bg-red-50 p-6 border border-red-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="text-red-500" size={20} />
                        <h3 className="text-lg font-medium text-red-700">Stockout Risks</h3>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {stockRisks.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm flex gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" onError={handleImageError} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
                                    <div className="flex justify-between mt-1 text-xs">
                                        <span className="text-gray-500">Stock: <span className="text-red-600 font-medium">{item.stock}</span></span>
                                        <span className="text-gray-500">Predicted: {item.predictedSales}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stockRisks.length === 0 && <p className="text-sm text-gray-500 italic">No inventory risks detected.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Component
const KpiCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
            <Icon size={20} className="text-gray-700" />
        </div>
    </div>
);

export default AnalyticsDashboard;
