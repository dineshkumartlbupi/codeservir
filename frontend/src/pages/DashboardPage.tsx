import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Chatbots', value: '3', icon: '🤖', color: 'from-purple-600 to-pink-600' },
        { label: 'Total Conversations', value: '1,234', icon: '💬', color: 'from-blue-600 to-cyan-600' },
        { label: 'Active Users', value: '456', icon: '👥', color: 'from-green-600 to-emerald-600' },
        { label: 'Response Rate', value: '98%', icon: '⚡', color: 'from-orange-600 to-yellow-600' },
    ];

    const recentChats = [
        { id: 1, chatbot: 'Support Bot', user: 'John Doe', message: 'How do I reset my password?', time: '5 min ago' },
        { id: 2, chatbot: 'Sales Bot', user: 'Jane Smith', message: 'What are your pricing plans?', time: '12 min ago' },
        { id: 3, chatbot: 'Support Bot', user: 'Mike Johnson', message: 'I need help with integration', time: '1 hour ago' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome back, {user?.displayName || 'User'}! 👋
                    </h1>
                    <p className="text-purple-200">Here's what's happening with your chatbots today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4`}>
                                {stat.icon}
                            </div>
                            <p className="text-purple-200 text-sm mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/create"
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105"
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
                            to="/analytics"
                            className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                        >
                            <span className="text-2xl">📊</span>
                            <div>
                                <p className="text-white font-semibold">View Analytics</p>
                                <p className="text-purple-200 text-sm">Track performance</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white">Recent Conversations</h2>
                        <Link to="/conversations" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentChats.map((chat) => (
                            <div key={chat.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                                    {chat.user.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-white font-semibold">{chat.user}</p>
                                        <span className="text-purple-300 text-xs">{chat.time}</span>
                                    </div>
                                    <p className="text-purple-400 text-sm mb-1">{chat.chatbot}</p>
                                    <p className="text-purple-200 text-sm">{chat.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
