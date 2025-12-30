import React, { useState } from 'react';
import TrainChatbot from './TrainChatbot';

interface FormData {
    ownerName: string;
    businessName: string;
    websiteUrl: string;
    contactNumber: string;
    contactEmail: string;
    businessAddress: string;
    businessDescription: string;
    primaryColor: string;
    secondaryColor: string;
}

interface ChatbotResponse {
    success: boolean;
    chatbot: {
        id: string;
        businessName: string;
        createdAt: string;
    };
    embedCode: string;
    message: string;
}

const LandingPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        ownerName: '',
        businessName: '',
        websiteUrl: '',
        contactNumber: '',
        contactEmail: '',
        businessAddress: '',
        businessDescription: '',
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
    });

    const [loading, setLoading] = useState(false);
    const [chatbotResponse, setChatbotResponse] = useState<ChatbotResponse | null>(null);
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'https://codeservir-api.vercel.app';

            const response = await fetch(`${API_URL}/api/chatbot/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setChatbotResponse(data);
            } else {
                setError(data.error || 'Failed to create chatbot');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    if (chatbotResponse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 py-12">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 animate-bounce-slow">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                🎉 Chatbot Created Successfully!
                            </h1>
                            <p className="text-xl text-purple-200">
                                {chatbotResponse.message}
                            </p>
                        </div>

                        {/* Chatbot Details Card */}
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-300/30">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-3xl">🤖</span>
                                Your Chatbot Details
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="font-semibold text-purple-200 min-w-[140px]">Chatbot ID:</span>
                                    <code className="bg-black/30 px-4 py-2 rounded-lg text-purple-300 font-mono text-sm border border-purple-400/30 flex-1">
                                        {chatbotResponse.chatbot.id}
                                    </code>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-purple-200 min-w-[140px]">Business Name:</span>
                                    <span className="text-white text-lg">{chatbotResponse.chatbot.businessName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Embed Code Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                                <span className="text-3xl">📋</span>
                                Embed Code
                            </h2>
                            <p className="text-purple-200 mb-4">Copy and paste this code into your website's HTML:</p>
                            <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 overflow-hidden">
                                <pre className="text-green-400 text-sm overflow-x-auto font-mono whitespace-pre-wrap break-words">
                                    {chatbotResponse.embedCode}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(chatbotResponse.embedCode)}
                                    className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                                >
                                    📋 Copy Code
                                </button>
                            </div>
                        </div>

                        {/* Mobile Integration */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                                <span className="text-3xl">📱</span>
                                Mobile App Integration
                            </h2>
                            <p className="text-purple-200 mb-4">Use this URL in your mobile app's WebView:</p>
                            <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
                                <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                                    {`${process.env.REACT_APP_API_URL || 'https://codeservir-api.vercel.app'}/embed/${chatbotResponse.chatbot.id}`}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(`${process.env.REACT_APP_API_URL || 'https://codeservir-api.vercel.app'}/embed/${chatbotResponse.chatbot.id}`)}
                                    className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                                >
                                    📋 Copy URL
                                </button>
                            </div>
                        </div>

                        {/* Training Section */}
                        <TrainChatbot
                            chatbotId={chatbotResponse.chatbot.id}
                            businessName={chatbotResponse.chatbot.businessName}
                        />

                        {/* Create Another Button */}
                        <button
                            onClick={() => {
                                setChatbotResponse(null);
                                setFormData({
                                    ownerName: '',
                                    businessName: '',
                                    websiteUrl: '',
                                    contactNumber: '',
                                    contactEmail: '',
                                    businessAddress: '',
                                    businessDescription: '',
                                    primaryColor: '#6366f1',
                                    secondaryColor: '#8b5cf6',
                                });
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg mt-8"
                        >
                            ✨ Create Another Chatbot
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes blob {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                    .animate-bounce-slow {
                        animation: bounce 2s infinite;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <header className="relative text-white py-20 px-4 text-center">
                <div className="max-w-5xl mx-auto">
                    {/* Logo/Icon */}
                    <div className="inline-flex items-center justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-2xl">
                                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                        CodeServir
                    </h1>
                    <p className="text-2xl md:text-3xl font-light mb-4 text-purple-200">
                        AI-Powered Chatbot Platform
                    </p>
                    <p className="text-lg md:text-xl text-purple-300 max-w-2xl mx-auto">
                        Create intelligent chatbots for your website in minutes. No coding required.
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                            ⚡ Instant Setup
                        </span>
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                            🎨 Customizable Design
                        </span>
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                            🤖 AI-Powered
                        </span>
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                            📱 Mobile Ready
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Form Section */}
            <div className="relative max-w-4xl mx-auto px-4 pb-20">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Create Your Chatbot
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
                            <p className="text-red-200 text-center font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Owner Name */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Owner Name *
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Business Name */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Business Name *
                            </label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                                placeholder="My Awesome Business"
                            />
                        </div>

                        {/* Website URL */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Website URL *
                            </label>
                            <input
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Contact Email */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Contact Email *
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                                placeholder="contact@example.com"
                            />
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        {/* Business Address */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Business Address
                            </label>
                            <input
                                type="text"
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                                placeholder="123 Main St, City, Country"
                            />
                        </div>

                        {/* Business Description */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Business Description
                            </label>
                            <textarea
                                name="businessDescription"
                                value={formData.businessDescription}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all resize-none"
                                placeholder="Describe your business and what you do..."
                            />
                        </div>

                        {/* Color Pickers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-purple-200 text-sm font-semibold mb-2">
                                    Primary Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                                    />
                                    <input
                                        type="text"
                                        value={formData.primaryColor}
                                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-purple-200 text-sm font-semibold mb-2">
                                    Secondary Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="secondaryColor"
                                        value={formData.secondaryColor}
                                        onChange={handleChange}
                                        className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                                    />
                                    <input
                                        type="text"
                                        value={formData.secondaryColor}
                                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Your Chatbot...
                                </>
                            ) : (
                                <>
                                    <span className="text-2xl">🚀</span>
                                    Create Chatbot
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Features Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform">
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
                        <p className="text-purple-200">Deploy your chatbot in under 2 minutes</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform">
                        <div className="text-4xl mb-3">🎨</div>
                        <h3 className="text-xl font-bold text-white mb-2">Fully Customizable</h3>
                        <p className="text-purple-200">Match your brand colors and style</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform">
                        <div className="text-4xl mb-3">🤖</div>
                        <h3 className="text-xl font-bold text-white mb-2">AI-Powered</h3>
                        <p className="text-purple-200">Smart responses using advanced AI</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
