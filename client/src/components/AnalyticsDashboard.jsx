import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, AlertTriangle, Package, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const COLORS = ['#111827', '#374151', '#6B7280', '#9CA3AF', '#E5E7EB'];

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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12 space-y-8">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={`LKR ${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+12.5%" />
                <KpiCard title="Total Orders" value={totalOrders} icon={ShoppingBag} trend="+4.2%" />
                <KpiCard title="Avg. Order Value" value={`LKR ${averageOrderValue}`} icon={TrendingUp} trend="-1.0%" />
                <KpiCard title="Total Customers" value={totalUsers} icon={Users} trend="+8.4%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Forecast - Takes up 2/3 */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Revenue Forecast</h3>
                            <p className="text-xs text-gray-400 mt-1">AI-powered 7-day prediction</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <TrendingUp size={16} className="text-gray-900" />
                        </div>
                    </div>
                    <div className="h-72">
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
                                    contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: '8px', border: 'none' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line type="monotone" dataKey="predictedRevenue" stroke="#111827" strokeWidth={2} dot={{ r: 4, fill: '#111827' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Distribution</h3>
                    <p className="text-xs text-gray-400 mb-6">By product category</p>
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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Top Selling Products</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topProducts} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="sales" fill="#111827" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stock Risks */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Inventory Alerts</h3>
                            <p className="text-xs text-gray-400 mt-1">AI detected risks</p>
                        </div>
                        {stockRisks.length > 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">
                                {stockRisks.length} Critical
                            </span>
                        )}
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {stockRisks.map(item => (
                            <div key={item.id} className="group bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-4 hover:border-red-200 transition-colors">
                                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" onError={handleImageError} />
                                    <div className="absolute inset-0 bg-red-500/10 hidden group-hover:block"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 truncate text-sm group-hover:text-red-600 transition-colors">{item.name}</h4>
                                    <div className="flex justify-between mt-2 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            <span className="text-gray-500">Only <span className="text-gray-900 font-semibold">{item.stock}</span> left</span>
                                        </div>
                                        <span className="text-gray-400">Predicted demand: {item.predictedSales}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stockRisks.length === 0 && <p className="text-sm text-gray-500 italic text-center py-8">No inventory risks detected.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Component
const KpiCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Icon size={20} className="text-gray-900 group-hover:text-white" />
            </div>
            {trend && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {trend}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">{value}</h3>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">{title}</p>
        </div>
    </div>
);

export default AnalyticsDashboard;
