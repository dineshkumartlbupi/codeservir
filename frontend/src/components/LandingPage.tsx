import React, { useState } from 'react';

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
// test
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
        primaryColor: '#0ea5e9',
        secondaryColor: '#22c55e',
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
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
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
            <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-scale-in">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
                            🎉 Chatbot Created Successfully!
                        </h1>
                        <p className="text-center text-gray-600 text-lg mb-8">
                            {chatbotResponse.message}
                        </p>

                        {/* Chatbot Details */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Chatbot Details</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-700 min-w-[140px]">Chatbot ID:</span>
                                    <code className="bg-white px-4 py-2 rounded-lg text-blue-600 font-mono text-sm border border-blue-200">
                                        {chatbotResponse.chatbot.id}
                                    </code>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-700 min-w-[140px]">Business Name:</span>
                                    <span className="text-gray-800">{chatbotResponse.chatbot.businessName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Embed Code */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span>📋</span> Embed Code
                            </h2>
                            <p className="text-gray-600 mb-4">Copy and paste this code into your website's HTML:</p>
                            <div className="relative bg-gray-900 rounded-xl p-6 overflow-hidden">
                                <pre className="text-green-400 text-sm overflow-x-auto font-mono whitespace-pre-wrap break-words">
                                    {chatbotResponse.embedCode}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(chatbotResponse.embedCode)}
                                    className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                                >
                                    Copy Code
                                </button>
                            </div>
                        </div>

                        {/* Mobile Integration */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span>📱</span> Mobile App Integration
                            </h2>
                            <p className="text-gray-600 mb-4">Use this URL in your mobile app's WebView:</p>
                            <div className="relative bg-gray-900 rounded-xl p-6">
                                <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                                    {`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/embed/${chatbotResponse.chatbot.id}`}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/embed/${chatbotResponse.chatbot.id}`)}
                                    className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                                >
                                    Copy URL
                                </button>
                            </div>
                        </div>

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
                                    primaryColor: '#0ea5e9',
                                    secondaryColor: '#22c55e',
                                });
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                            Create Another Chatbot
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500">
            {/* Header */}
            <header className="text-white py-12 px-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-6xl">💬</span>
                    <h1 className="text-5xl md:text-6xl font-bold">CodeServir</h1>
                </div>
                <p className="text-xl md:text-2xl font-light opacity-95">
                    AI Chatbot Generator for Any Website
                </p>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 pb-16">
                {/* Hero Section */}
                <div className="text-center text-white mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Create Your AI Chatbot in Seconds
                    </h2>
                    <p className="text-lg md:text-xl opacity-90">
                        No login required • Instant setup • Works everywhere
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
                    {/* Business Information */}
                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                            Business Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="ownerName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Owner Name *
                                </label>
                                <input
                                    type="text"
                                    id="ownerName"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Business Name *
                                </label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Acme Corporation"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="websiteUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                                Website URL *
                            </label>
                            <input
                                type="url"
                                id="websiteUrl"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                required
                                placeholder="https://example.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact Email *
                                </label>
                                <input
                                    type="email"
                                    id="contactEmail"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    required
                                    placeholder="contact@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="businessAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                                Business Address
                            </label>
                            <input
                                type="text"
                                id="businessAddress"
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleChange}
                                placeholder="123 Main St, City, Country"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="businessDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                                Business Description *
                            </label>
                            <textarea
                                id="businessDescription"
                                name="businessDescription"
                                value={formData.businessDescription}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Describe your business, products, and services..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Chatbot Customization */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                            Chatbot Customization
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="primaryColor" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Primary Color
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        id="primaryColor"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="w-16 h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.primaryColor}
                                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                        placeholder="#0ea5e9"
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="secondaryColor" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Secondary Color
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        id="secondaryColor"
                                        name="secondaryColor"
                                        value={formData.secondaryColor}
                                        onChange={handleChange}
                                        className="w-16 h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.secondaryColor}
                                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                        placeholder="#22c55e"
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg text-lg flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Chatbot...
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                Generate Chatbot
                            </>
                        )}
                    </button>
                </form>

                {/* Features Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">
                        Why Choose CodeServir?
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                            <div className="text-5xl mb-4">⚡</div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Instant Setup</h4>
                            <p className="text-gray-600 text-sm">Create your chatbot in seconds with no technical knowledge required</p>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                            <div className="text-5xl mb-4">🤖</div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">AI-Powered</h4>
                            <p className="text-gray-600 text-sm">Advanced AI trained on your website content and business information</p>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                            <div className="text-5xl mb-4">🌐</div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Works Everywhere</h4>
                            <p className="text-gray-600 text-sm">Embed on any website or integrate into mobile apps seamlessly</p>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                            <div className="text-5xl mb-4">💰</div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Free to Start</h4>
                            <p className="text-gray-600 text-sm">1000 free chats, then upgrade to affordable plans as you grow</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-white py-8 px-4 opacity-80">
                <p>© 2024 CodeServir. All rights reserved.</p>
            </footer>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
