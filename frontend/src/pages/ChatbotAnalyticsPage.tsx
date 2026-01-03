import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ChatbotAnalyticsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchStats(id);
        }
    }, [id]);

    const fetchStats = async (chatbotId: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const data = await api.getChatbotStats(chatbotId, token);
            if (data && data.success) {
                setStats(data.stats);
            } else {
                setError('Failed to load stats');
            }
        } catch (err: any) {
            console.error(err);
            setError('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-xl text-red-400 mb-4">{error || 'No data available'}</p>
                    <Link to="/my-chatbots" className="text-purple-400 hover:text-purple-300">
                        &larr; Back to Chatbots
                    </Link>
                </div>
            </div>
        );
    }

    // Chart Data (Mocking history if backend doesn't provide yet, currently backend only gives totals)
    // We will use the total as a "Current" bar vs "Limit"
    const chartData = {
        labels: ['Conversations'],
        datasets: [
            {
                label: 'Used',
                data: [stats.totalConversations || stats.chatCount || 0],
                backgroundColor: 'rgba(147, 51, 234, 0.8)', // Purple
            },
            {
                label: 'Limit',
                data: [stats.chatLimit || stats.activeUsers || 0],
                backgroundColor: 'rgba(75, 85, 99, 0.5)', // Gray
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: 'white' }
            },
            title: {
                display: true,
                text: 'Usage vs Limit',
                color: 'white',
                font: { size: 16 }
            },
        },
        scales: {
            y: {
                ticks: { color: '#e9d5ff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#e9d5ff' },
                grid: { display: false }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
                        <p className="text-purple-200">Performance metrics for your chatbot</p>
                    </div>
                    <Link to="/my-chatbots" className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
                        &larr; Back
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <p className="text-purple-200 text-sm mb-1">Total Conversations</p>
                        <p className="text-3xl font-bold text-white">
                            {(stats.totalConversations || stats.chatCount || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <p className="text-purple-200 text-sm mb-1">Remaining Limit</p>
                        <p className="text-3xl font-bold text-white">
                            {Math.max(0, (stats.chatLimit || 0) - (stats.chatCount || 0)).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <p className="text-purple-200 text-sm mb-1">Current Plan</p>
                        <p className="text-3xl font-bold text-white capitalize">
                            {stats.planType || 'Free'}
                        </p>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <Bar data={chartData} options={options} />
                    </div>

                    {/* Placeholder for more detailed analytics */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-6xl mb-4">✨</p>
                            <h3 className="text-xl font-bold text-white mb-2">Detailed Insights Coming Soon</h3>
                            <p className="text-purple-200">
                                We are tracking more metrics like user sentiment, popular topics, and engagement time.
                                Upgrade to Pro for early access!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotAnalyticsPage;
