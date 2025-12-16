import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { AuthContext } from '../context/AuthContext';

const Analytics = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            }
        }
    }, [user, loading, navigate]);

    if (loading) return null; // or a spinner
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 mb-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
                        <div>
                            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2 block">Admin Console</span>
                            <h1 className="text-3xl font-serif text-gray-900">Dashboard Overview</h1>
                            <p className="text-gray-500 mt-2 text-sm">Real-time performance metrics and AI predictions.</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium self-start md:self-auto">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            System Live
                        </div>
                    </div>
                </div>
                <AnalyticsDashboard />
            </div>
        </div>
    );
};

export default Analytics;
