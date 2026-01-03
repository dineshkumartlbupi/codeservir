import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface FormData {
    businessName: string;
    websiteUrl: string;
    contactNumber: string;
    contactEmail: string;
    businessAddress: string;
    businessDescription: string;
    primaryColor: string;
    secondaryColor: string;
}

const EditChatbotPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        businessName: '',
        websiteUrl: '',
        contactNumber: '',
        contactEmail: '',
        businessAddress: '',
        businessDescription: '',
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (id) {
            fetchChatbotDetails(id);
        }
    }, [id]);

    const fetchChatbotDetails = async (chatbotId: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const data = await api.getChatbotStats(chatbotId, token); // Using stats endpoint wrapper or getChatbot if available?
            // api.ts has getChatbot (singular) wrapper? NO.
            // It has listChatbots.
            // But controller has getChatbot. Let's add getChatbot to api.ts or use the list and find?
            // "api.ts" -> getChatbotStats gets stats.
            // We need details.
            // Ideally add getChatbot to api.ts.
            // For now, let's use list and find, or implement getChatbot in api.ts quickly.
            // WAIT, Step 667 ChatbotController has `getChatbot`.
            // I should verify/add `getChatbot` to `api.ts`.

            // Re-reading api.ts from Step 655/657:
            // It has getChatbots, getChatbotsByEmail, create, update, delete, stats.
            // It DOES NOT have `getChatbot(id)`.
            // But `updateChatbot` exists.

            // I will implement fetching via direct fetch here if needed, or better, add to api.ts.
            // I'll assume I can add it or just use fetch here.

            const API_URL = process.env.REACT_APP_API_URL || 'https://codeservir-api.vercel.app';
            const res = await fetch(`${API_URL}/api/chatbot/${chatbotId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();

            if (json.success && json.chatbot) {
                const bot = json.chatbot;
                setFormData({
                    businessName: bot.businessName || '',
                    websiteUrl: bot.websiteUrl || bot.website || '',
                    contactNumber: bot.contactNumber || '',
                    contactEmail: bot.contactEmail || '',
                    businessAddress: bot.businessAddress || '',
                    businessDescription: bot.businessDescription || '',
                    primaryColor: bot.primaryColor || '#6366f1',
                    secondaryColor: bot.secondaryColor || '#8b5cf6',
                });
            } else {
                setError('Chatbot not found');
            }
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            if (!id) return;

            await api.updateChatbot(id, formData, token);
            setSuccessMessage('Chatbot updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update chatbot');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-white">
                            Edit Chatbot
                        </h2>
                        <button onClick={() => navigate('/my-chatbots')} className="text-purple-300 hover:text-white">
                            &larr; Back
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
                            <p className="text-red-200 text-center font-medium">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl backdrop-blur-sm">
                            <p className="text-green-200 text-center font-medium">{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Business Name */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Business Name
                            </label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                            />
                        </div>

                        {/* Website URL */}
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Website URL
                            </label>
                            <input
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                            />
                        </div>

                        {/* Description */}
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

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {submitting ? 'Updating...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditChatbotPage;
