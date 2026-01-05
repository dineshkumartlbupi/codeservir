import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface ChatbotData {
    id: string;
    ownerName: string;
    businessName: string;
    websiteUrl: string;
    contactNumber: string;
    contactEmail: string;
    businessAddress: string;
    businessDescription: string;
    primaryColor: string;
    secondaryColor: string;
    status: string;
}

interface ChatMessage {
    id: number;
    chatbot_id: string;
    session_id: string;
    user_message: string;
    bot_response: string;
    created_at: string;
}

const ChatbotDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [chatbot, setChatbot] = useState<ChatbotData | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'history'>('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);

    const fetchData = async (chatbotId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Fetch Chatbot Details
            const botJson = await api.getChatbot(chatbotId, token);

            if (botJson.success && botJson.chatbot) {
                setChatbot(botJson.chatbot);
                setFormData({
                    businessName: botJson.chatbot.businessName,
                    websiteUrl: botJson.chatbot.websiteUrl,
                    contactNumber: botJson.chatbot.contactNumber,
                    contactEmail: botJson.chatbot.contactEmail,
                    businessAddress: botJson.chatbot.businessAddress,
                    businessDescription: botJson.chatbot.businessDescription,
                    primaryColor: botJson.chatbot.primaryColor,
                    secondaryColor: botJson.chatbot.secondaryColor,
                });

                // Fetch History
                fetchHistory(chatbotId, token);
            } else {
                setError('Chatbot not found');
            }
        } catch (err: any) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (chatbotId: string, token: string | null) => {
        try {
            const json = await api.getChatHistory(chatbotId, 100, token);
            if (json.success) {
                setHistory(json.history);
            }
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        try {
            const token = localStorage.getItem('token');
            await api.updateChatbot(id!, formData, token);
            setSuccessMessage('Updated successfully!');
            setChatbot({ ...chatbot, ...formData } as any);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            alert('Failed to update: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Group history by session
    const sessions = history.reduce((acc: any, msg) => {
        if (!acc[msg.session_id]) {
            acc[msg.session_id] = [];
        }
        acc[msg.session_id].push(msg);
        return acc;
    }, {});

    const sortedSessions = Object.keys(sessions).sort((a, b) => {
        // Sort by most recent message in session
        const lastA = new Date(sessions[a][sessions[a].length - 1].created_at).getTime();
        const lastB = new Date(sessions[b][sessions[b].length - 1].created_at).getTime();
        return lastB - lastA;
    });

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
    if (!chatbot) return <div className="min-h-screen bg-slate-900 text-white p-20">Chatbot not found</div>;

    const embedCode = `<script>
(function () {
  var s = document.createElement("script");
  s.src = "https://codeservir-api.vercel.app/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "${chatbot.id}");
  (document.head || document.documentElement).appendChild(s);
})();
</script>`;

    const mobileUrl = `https://codeservir-api.vercel.app/embed/${chatbot.id}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{chatbot.businessName}</h1>
                        <p className="text-purple-200">Manage your chatbot details and history</p>
                    </div>
                    <button onClick={() => navigate('/my-chatbots')} className="text-purple-300 hover:text-white transition-colors group flex items-center gap-2">
                        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to List
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-2 mb-6 border-b border-white/10 no-scrollbar gap-2 sm:gap-4">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`whitespace-nowrap px-4 py-2 font-medium transition-colors rounded-t-lg ${activeTab === 'overview' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-purple-300 hover:text-white hover:bg-white/5'}`}
                    >
                        Overview & Embed
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`whitespace-nowrap px-4 py-2 font-medium transition-colors rounded-t-lg ${activeTab === 'settings' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-purple-300 hover:text-white hover:bg-white/5'}`}
                    >
                        Settings & Design
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`whitespace-nowrap px-4 py-2 font-medium transition-colors rounded-t-lg ${activeTab === 'history' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-purple-300 hover:text-white hover:bg-white/5'}`}
                    >
                        Conversations ({sortedSessions.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 min-h-[500px]">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-black/20 p-6 rounded-xl">
                                    <h3 className="text-xl font-bold text-white mb-4">Web Embed Code</h3>
                                    <p className="text-gray-300 text-sm mb-4">Copy and paste this code into your website's HTML before the closing &lt;/body&gt; tag.</p>
                                    <div className="relative">
                                        <pre className="bg-slate-950 p-4 rounded-lg text-green-400 text-xs overflow-x-auto whitespace-pre-wrap">
                                            {embedCode}
                                        </pre>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(embedCode)}
                                            className="absolute top-2 right-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-black/20 p-6 rounded-xl">
                                    <h3 className="text-xl font-bold text-white mb-4">Mobile App Integration</h3>
                                    <p className="text-gray-300 text-sm mb-4">Use this URL in your mobile app's WebView or IFrame.</p>
                                    <div className="flex items-center gap-2 bg-slate-950 p-4 rounded-lg mb-4">
                                        <code className="text-blue-400 text-sm truncate flex-1">{mobileUrl}</code>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(mobileUrl)}
                                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                        <p className="text-purple-200 text-sm">💡 Tip: You can customize the look and feel in the Settings tab, and changes will reflect instantly!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl mx-auto">
                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-center">
                                    {successMessage}
                                </div>
                            )}
                            <form onSubmit={handleUpdate} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">Business Name</label>
                                        <input type="text" value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">Website URL</label>
                                        <input type="url" value={formData.websiteUrl} onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">Description</label>
                                    <textarea rows={3} value={formData.businessDescription} onChange={e => setFormData({ ...formData, businessDescription: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">Primary Color</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={formData.primaryColor} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                                            <input type="text" value={formData.primaryColor} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">Secondary Color</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={formData.secondaryColor} onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })} className="h-10 w-10 rounded cursor-pointer" />
                                            <input type="text" value={formData.secondaryColor} onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg mt-4 disabled:opacity-50">
                                    {submitting ? 'Saving Changes...' : 'Save Updates'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div>
                            {sortedSessions.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-4xl mb-4">💬</div>
                                    <p className="text-xl text-white font-semibold">No Conversations Yet</p>
                                    <p className="text-purple-300">Share your embed code to start chatting!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sortedSessions.map(sessionId => {
                                        const msgs = sessions[sessionId];
                                        const firstMsg = msgs[0]; // Oldest message since we pushed in order? Wait, getChatbotHistory order is DESC.
                                        // If order is DESC, msgs[0] is the NEWEST.
                                        // Let's check `getChatbotHistory` again.
                                        // It says "ORDER BY created_at DESC".
                                        // So first item in array is the LATEST message.
                                        // The "First Message" (to title the chat) should be the LAST item in the array for that session.

                                        const firstUserMsg = msgs[msgs.length - 1];

                                        return (
                                            <div key={sessionId} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
                                                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                                                    <div>
                                                        <p className="text-sm text-purple-300 font-mono mb-1">Session: {sessionId.slice(0, 8)}...</p>
                                                        <h4 className="text-white font-semibold truncate max-w-md">
                                                            {firstUserMsg?.user_message || 'New Conversation'}
                                                        </h4>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(msgs[0].created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="p-4 bg-slate-900/50 max-h-60 overflow-y-auto space-y-3">
                                                    {/* We want to show messages chronologically, so we reverse the DESC list */}
                                                    {[...msgs].reverse().map((msg: ChatMessage) => (
                                                        <div key={msg.id} className="space-y-2">
                                                            <div className="flex justify-end">
                                                                <div className="bg-purple-600/20 text-purple-100 px-3 py-2 rounded-lg rounded-tr-none text-sm max-w-[80%] border border-purple-500/30">
                                                                    {msg.user_message}
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-start">
                                                                <div className="bg-slate-700/50 text-gray-200 px-3 py-2 rounded-lg rounded-tl-none text-sm max-w-[80%] border border-white/5">
                                                                    {msg.bot_response}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatbotDetailsPage;
