import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <section className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-center">Contact Us</h1>
                    <p className="text-xl text-purple-200 text-center mb-16">We'd love to hear from you</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-6">Send us a message</h2>
                            
                            {submitted && (
                                <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg backdrop-blur-sm">
                                    <p className="text-green-100 font-medium">✅ Message sent successfully! We'll get back to you soon.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">Subject *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-200 text-sm font-semibold mb-2">Message *</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm resize-none"
                                        placeholder="Tell us more..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                                <div className="text-4xl mb-4">📧</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Email</h3>
                                <a href="mailto:support@codeservir.com" className="text-purple-300 hover:text-purple-200">
                                    support@codeservir.com
                                </a>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                                <div className="text-4xl mb-4">💬</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Live Chat</h3>
                                <p className="text-purple-200">Available Monday-Friday, 9AM-6PM EST</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                                <div className="text-4xl mb-4">📚</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Documentation</h3>
                                <p className="text-purple-200">Check our comprehensive guides and tutorials</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                                <div className="text-4xl mb-4">🌐</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Social Media</h3>
                                <div className="flex gap-4 mt-4">
                                    <a href="#" className="text-purple-300 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                                    </a>
                                    <a href="#" className="text-purple-300 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                    </a>
                                    <a href="#" className="text-purple-300 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
            `}</style>
        </div>
    );
};

export default ContactPage;
