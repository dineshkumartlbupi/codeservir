import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, DashboardStats, Chatbot } from '../services/api';
import TrainChatbot from '../components/TrainChatbot';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalChatbots: 0,
        totalConversations: 0,
        activeUsers: 0,
        responseRate: '0%'
    });
    const [chatbots, setChatbots] = useState<Chatbot[]>([]);
    const [selectedChatbotId, setSelectedChatbotId] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState('');
    const [recentConversations, setRecentConversations] = useState<any[]>([]);

    useEffect(() => {
        fetchInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedChatbotId === 'all') {
            fetchAggregateStats();
            setRecentConversations([]);
        } else {
            fetchChatbotStats(selectedChatbotId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChatbotId]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const chatbotsData: any = await api.getChatbots(token);
            const list = Array.isArray(chatbotsData) ? chatbotsData : (chatbotsData.chatbots || []);
            setChatbots(list);

            await fetchAggregateStats();
        } catch (err: any) {
            console.error('Failed to fetch initial data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAggregateStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const data = await api.getDashboardStats(token, user?.email || undefined);
            if (data) {
                setStats({
                    totalChatbots: data.totalChatbots !== undefined ? data.totalChatbots : (data.activeChatbots || 0),
                    totalConversations: data.totalConversations || 0,
                    activeUsers: data.activeUsers || 0,
                    responseRate: data.responseRate || data.planType || '0%'
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchChatbotStats = async (id: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const data = await api.getChatbotStats(id, token);

            if (data && data.success && data.stats) {
                const s = data.stats;
                setStats({
                    totalChatbots: 1,
                    totalConversations: s.chatCount || 0,
                    activeUsers: s.chatLimit || 0,
                    responseRate: s.planType || 'Free'
                });
            }

            // Fetch Recent History
            try {
                const historyData = await api.getChatHistory(id, 5, token);
                if (historyData?.success && historyData.history) {
                    setRecentConversations(historyData.history);
                } else {
                    setRecentConversations([]);
                }
            } catch (ignore) {
                console.warn("Failed to fetch history for dashboard");
                setRecentConversations([]);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const selectedChatbot = chatbots.find(c => c.id === selectedChatbotId);

    // Dynamic Display Cards
    const statsDisplay = selectedChatbotId === 'all'
        ? [
            { label: 'Total Chatbots', value: (stats?.totalChatbots || 0).toString(), icon: '🤖', color: 'from-purple-600 to-pink-600' },
            { label: 'Total Conversations', value: (stats?.totalConversations || 0).toLocaleString(), icon: '💬', color: 'from-blue-600 to-cyan-600' },
            { label: 'Active Users', value: (stats?.activeUsers || 0).toString(), icon: '👥', color: 'from-green-600 to-emerald-600' },
            { label: 'Avg Response Rate', value: stats?.responseRate || '0%', icon: '⚡', color: 'from-orange-600 to-yellow-600' },
        ]
        : [
            { label: 'Messages Used', value: `${stats?.totalConversations} / ${stats?.activeUsers}`, icon: '📊', color: 'from-purple-600 to-pink-600' },
            { label: 'Current Plan', value: (stats?.responseRate || 'Free').toUpperCase(), icon: '💎', color: 'from-blue-600 to-cyan-600' },
            { label: 'Status', value: 'Active', icon: '✅', color: 'from-green-600 to-emerald-600' },
            { label: 'Last Active', value: 'Just now', icon: '🕒', color: 'from-orange-600 to-yellow-600' },
        ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header with Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Dashboard
                        </h1>
                        <p className="text-purple-200">
                            {selectedChatbotId === 'all'
                                ? `Welcome back, ${user?.displayName || 'User'}! Here's your overview.`
                                : `Managing chatbot: ${selectedChatbot?.businessName}`}
                        </p>
                    </div>

                    <div className="w-full md:w-64">
                        <label className="block text-sm font-medium text-purple-200 mb-1">Select Chatbot</label>
                        <select
                            value={selectedChatbotId}
                            onChange={(e) => setSelectedChatbotId(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm cursor-pointer"
                        >
                            <option value="all" className="bg-slate-800 text-white">All Chatbots</option>
                            {chatbots.map(bot => (
                                <option key={bot.id} value={bot.id} className="bg-slate-800 text-white">
                                    {bot.businessName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {loading && stats?.totalChatbots === 0 ? (
                        <div className="col-span-full text-center text-purple-200 py-8">Loading stats...</div>
                    ) : (
                        statsDisplay.map((stat, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                                    {stat.icon}
                                </div>
                                <p className="text-purple-200 text-sm mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-white truncate">{stat.value}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Content Area: Either Training or Quick Actions */}
                {selectedChatbot && selectedChatbotId !== 'all' ? (
                    <div className="animate-fade-in">
                        <TrainChatbot
                            chatbotId={selectedChatbot.id}
                            businessName={selectedChatbot.businessName}
                        />

                        <div className="mt-8 flex justify-end">
                            <Link to={`/chatbot/${selectedChatbot.id}/details`} className="text-purple-300 hover:text-white underline">
                                Go to Dashboard & Details &rarr;
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Quick Actions (General) */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link
                                    to="/create"
                                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 shadow-lg"
                                >
                                    <span className="text-2xl">➕</span>
                                    <div>
                                        <p className="text-white font-semibold">Create New Chatbot</p>
                                        <p className="text-purple-100 text-sm">Start building in minutes</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/my-chatbots"
                                    className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                                >
                                    <span className="text-2xl">🤖</span>
                                    <div>
                                        <p className="text-white font-semibold">Manage Chatbots</p>
                                        <p className="text-purple-200 text-sm">Edit and configure</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/pricing"
                                    className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                                >
                                    <span className="text-2xl">💎</span>
                                    <div>
                                        <p className="text-white font-semibold">Upgrade Plan</p>
                                        <p className="text-purple-200 text-sm">Get more features</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">Recent Conversations</h2>
                                <span className="text-purple-400 text-sm">Real-time updates</span>
                            </div>
                            <div className="space-y-4">
                                {recentConversations.length === 0 ? (
                                    <div className="text-purple-300 text-center py-4">
                                        {selectedChatbotId === 'all' ? 'Select a chatbot to view recent conversations.' : 'No recent conversations found.'}
                                    </div>
                                ) : (
                                    recentConversations.map((chat) => (
                                        <div key={chat.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-md">
                                                👤
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-white font-semibold">User</p>
                                                    <span className="text-purple-300 text-xs">
                                                        {new Date(chat.created_at).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <p className="text-purple-400 text-sm mb-1">{selectedChatbot?.businessName}</p>
                                                <p className="text-purple-200 text-sm opacity-80 line-clamp-2">{chat.user_message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;
