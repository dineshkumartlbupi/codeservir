import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface FormData {
    name: string;
    description: string;
    website: string;
    email: string;
    phone: string;
    primaryColor: string;
    secondaryColor: string;
}

const CreateChatbotPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        website: '',
        email: '',
        phone: '',
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [chatbotId, setChatbotId] = useState('');

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
            const token = await user?.getIdToken();
            const response = await api.createChatbot(formData, token) as any;

            if (response.success) {
                setSuccess(true);
                setChatbotId(response.chatbotId || response.chatbot?.id);
                // Redirect to chatbots page after 2 seconds
                setTimeout(() => {
                    navigate('/my-chatbots');
                }, 2000);
            } else {
                setError(response.message || 'Failed to create chatbot');
            }
        } catch (err: any) {
            console.error('Error creating chatbot:', err);
            setError(err.message || 'Failed to create chatbot. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 flex items-center justify-center px-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 max-w-2xl text-center">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-4xl font-bold text-white mb-4">Chatbot Created Successfully!</h1>
                    <p className="text-purple-200 mb-6">
                        Your chatbot has been created and is ready to use.
                    </p>
                    <p className="text-purple-300 text-sm mb-8">
                        Redirecting to My Chatbots...
                    </p>
                    <button
                        onClick={() => navigate('/my-chatbots')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all hover:scale-105"
                    >
                        View My Chatbots
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">Create Your AI Chatbot 🤖</h1>
                    <p className="text-xl text-purple-200">Fill in the details to create your intelligent chatbot</p>
                </div>

                {/* Form */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-xl">
                            <p className="text-red-200 text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Chatbot Name */}
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                Chatbot Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Support Bot"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Describe what your chatbot does..."
                            />
                        </div>

                        {/* Website URL */}
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                Website URL *
                            </label>
                            <input
                                type="url"
                                name="website"
                                required
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                    Contact Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="contact@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                    Primary Color
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="w-16 h-12 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.primaryColor}
                                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="#6366f1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                    Secondary Color
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        name="secondaryColor"
                                        value={formData.secondaryColor}
                                        onChange={handleChange}
                                        className="w-16 h-12 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.secondaryColor}
                                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="#8b5cf6"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/my-chatbots')}
                                className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Creating...' : 'Create Chatbot 🚀'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-purple-500/10 backdrop-blur-xl rounded-2xl border border-purple-400/20 p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">💡 What happens next?</h3>
                    <ul className="text-purple-200 space-y-2 text-sm">
                        <li>✅ Your chatbot will be created instantly</li>
                        <li>✅ You can train it with your business data</li>
                        <li>✅ Get the embed code to add to your website</li>
                        <li>✅ Start receiving and managing conversations</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateChatbotPage;
