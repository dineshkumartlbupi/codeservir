import React, { useState } from 'react';

interface QAPair {
    question: string;
    answer: string;
}

interface TrainChatbotProps {
    chatbotId: string;
    businessName: string;
}

const TrainChatbot: React.FC<TrainChatbotProps> = ({ chatbotId, businessName }) => {
    const [qaPairs, setQaPairs] = useState<QAPair[]>([{ question: '', answer: '' }]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const addQAPair = () => {
        setQaPairs([...qaPairs, { question: '', answer: '' }]);
    };

    const removeQAPair = (index: number) => {
        if (qaPairs.length > 1) {
            setQaPairs(qaPairs.filter((_, i) => i !== index));
        }
    };

    const updateQAPair = (index: number, field: 'question' | 'answer', value: string) => {
        const updated = [...qaPairs];
        updated[index][field] = value;
        setQaPairs(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Filter out empty pairs
        const validPairs = qaPairs.filter(pair => pair.question.trim() && pair.answer.trim());

        if (validPairs.length === 0) {
            setError('Please add at least one question and answer pair');
            setLoading(false);
            return;
        }

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'https://codeservir-api.vercel.app';

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/chatbot/${chatbotId}/train`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ trainingData: validPairs }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
                setQaPairs([{ question: '', answer: '' }]); // Reset form
                setTimeout(() => setSuccess(false), 5000); // Hide success message after 5s
            } else {
                setError(data.error || 'Failed to train chatbot');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mt-8 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Train Your Chatbot</h2>
                    <p className="text-purple-200 text-sm">Add custom Q&A pairs for {businessName}</p>
                </div>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center gap-3 backdrop-blur-sm">
                    <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-100 font-medium">Successfully trained! Your chatbot now knows these answers.</span>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center gap-3 backdrop-blur-sm">
                    <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-100">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                    {qaPairs.map((pair, index) => (
                        <div key={index} className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 relative">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-purple-200">Q&A Pair #{index + 1}</span>
                                {qaPairs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQAPair(index)}
                                        className="text-red-300 hover:text-red-100 transition-colors"
                                        title="Remove this pair"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-purple-200 mb-1">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        value={pair.question}
                                        onChange={(e) => updateQAPair(index, 'question', e.target.value)}
                                        placeholder="e.g., What are your business hours?"
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-purple-200 mb-1">
                                        Answer
                                    </label>
                                    <textarea
                                        value={pair.answer}
                                        onChange={(e) => updateQAPair(index, 'answer', e.target.value)}
                                        placeholder="e.g., We're open Monday to Friday, 9 AM to 5 PM"
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={addQAPair}
                        className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 border border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Another Q&A
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Training...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Train Chatbot
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg backdrop-blur-sm">
                <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-100">
                        <p className="font-semibold mb-1">Training Tips:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-200">
                            <li>Add common questions your customers ask</li>
                            <li>Be specific and clear in your answers</li>
                            <li>You can train your chatbot multiple times</li>
                            <li>New training data is added to existing knowledge</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainChatbot;
