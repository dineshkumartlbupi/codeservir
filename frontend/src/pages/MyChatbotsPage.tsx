import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Chatbot {
    id: string;
    name: string;
    description: string;
    website: string;
    status: 'active' | 'inactive';
    conversations: number;
    lastActive: string;
    color: string;
}

const MyChatbotsPage: React.FC = () => {
    const { user } = useAuth();
    const [chatbots, setChatbots] = useState<Chatbot[]>([
        {
            id: '1',
            name: 'Support Bot',
            description: 'Customer support chatbot for main website',
            website: 'example.com',
            status: 'active',
            conversations: 1234,
            lastActive: '2 min ago',
            color: 'from-purple-600 to-pink-600'
        },
        {
            id: '2',
            name: 'Sales Bot',
            description: 'Lead generation and sales assistant',
            website: 'shop.example.com',
            status: 'active',
            conversations: 567,
            lastActive: '1 hour ago',
            color: 'from-blue-600 to-cyan-600'
        },
        {
            id: '3',
            name: 'FAQ Bot',
            description: 'Answers frequently asked questions',
            website: 'help.example.com',
            status: 'inactive',
            conversations: 89,
            lastActive: '3 days ago',
            color: 'from-green-600 to-emerald-600'
        },
    ]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this chatbot?')) {
            setChatbots(chatbots.filter(bot => bot.id !== id));
        }
    };

    const toggleStatus = (id: string) => {
        setChatbots(chatbots.map(bot =>
            bot.id === id ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' } : bot
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">My Chatbots 🤖</h1>
                        <p className="text-purple-200">Manage and configure your AI chatbots</p>
                    </div>
                    <Link
                        to="/create"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                    >
                        ➕ Create New Chatbot
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <p className="text-purple-200 text-sm mb-1">Total Chatbots</p>
                        <p className="text-3xl font-bold text-white">{chatbots.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <p className="text-purple-200 text-sm mb-1">Active Chatbots</p>
                        <p className="text-3xl font-bold text-white">
                            {chatbots.filter(bot => bot.status === 'active').length}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                        <p className="text-purple-200 text-sm mb-1">Total Conversations</p>
                        <p className="text-3xl font-bold text-white">
                            {chatbots.reduce((sum, bot) => sum + bot.conversations, 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Chatbots Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {chatbots.map((chatbot) => (
                        <div key={chatbot.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${chatbot.color} flex items-center justify-center text-2xl`}>
                                        🤖
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{chatbot.name}</h3>
                                        <p className="text-purple-300 text-sm">{chatbot.website}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${chatbot.status === 'active'
                                        ? 'bg-green-500/20 text-green-300'
                                        : 'bg-gray-500/20 text-gray-300'
                                    }`}>
                                    {chatbot.status === 'active' ? '● Active' : '○ Inactive'}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-purple-200 text-sm mb-4">{chatbot.description}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-purple-300 text-xs mb-1">Conversations</p>
                                    <p className="text-white font-semibold">{chatbot.conversations.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-purple-300 text-xs mb-1">Last Active</p>
                                    <p className="text-white font-semibold">{chatbot.lastActive}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link
                                    to={`/chatbot/${chatbot.id}/edit`}
                                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-center"
                                >
                                    ✏️ Edit
                                </Link>
                                <Link
                                    to={`/chatbot/${chatbot.id}/analytics`}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center"
                                >
                                    📊 Analytics
                                </Link>
                                <button
                                    onClick={() => toggleStatus(chatbot.id)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                                    title={chatbot.status === 'active' ? 'Deactivate' : 'Activate'}
                                >
                                    {chatbot.status === 'active' ? '⏸️' : '▶️'}
                                </button>
                                <button
                                    onClick={() => handleDelete(chatbot.id)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {chatbots.length === 0 && (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
                        <div className="text-6xl mb-4">🤖</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Chatbots Yet</h3>
                        <p className="text-purple-200 mb-6">Create your first chatbot to get started!</p>
                        <Link
                            to="/create"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                        >
                            ➕ Create Your First Chatbot
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyChatbotsPage;
