import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Logo Icon */}
                    {/* <div className="inline-flex items-center justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl">
                                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>
                    </div> */}

                    {/* <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                        CodeServir
                    </h1> */}
                    <p className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 text-purple-200">
                        AI-Powered Chatbot Platform
                    </p>
                    <p className="text-lg md:text-xl text-purple-300 max-w-3xl mx-auto mb-12">
                        Create intelligent chatbots for your website in minutes. No coding required.
                        Fully customizable, responsive, and powered by advanced AI.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link
                            to="/create"
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-2xl flex items-center gap-2 "
                        >
                            Create Your Chatbot
                        </Link>
                        <Link
                            to="/features"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-2xl font-semibold text-lg transition-all border border-white/20 flex items-center gap-2"
                        >
                            <span className="text-2xl">✨</span>
                            Explore Features
                        </Link>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 text-purple-200">
                            ⚡ Instant Setup
                        </span>
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 text-purple-200">
                            🎨 Fully Customizable
                        </span>
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 text-purple-200">
                            🤖 AI-Powered
                        </span>
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 text-purple-200">
                            📱 Mobile Ready
                        </span>
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 text-purple-200">
                            🔒 Secure & Private
                        </span>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Why Choose CodeServir?
                        </h2>
                        <p className="text-xl text-purple-200">
                            Everything you need to create amazing chatbots
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform hover:shadow-2xl">
                            <div className="text-5xl mb-4">⚡</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
                            <p className="text-purple-200">
                                Deploy your chatbot in under 2 minutes. Simple form, instant results.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform hover:shadow-2xl">
                            <div className="text-5xl mb-4">🎨</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Fully Customizable</h3>
                            <p className="text-purple-200">
                                Match your brand colors, style, and personality perfectly.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform hover:shadow-2xl">
                            <div className="text-5xl mb-4">🤖</div>
                            <h3 className="text-2xl font-bold text-white mb-3">AI-Powered</h3>
                            <p className="text-purple-200">
                                Smart responses using advanced AI and machine learning.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform hover:shadow-2xl">
                            <div className="text-5xl mb-4">📱</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Mobile Ready</h3>
                            <p className="text-purple-200">
                                Perfect on all devices - desktop, tablet, and mobile.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform hover:shadow-2xl">
                            <div className="text-5xl mb-4">🎓</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Easy Training</h3>
                            <p className="text-purple-200">
                                Train your chatbot with custom Q&A pairs in minutes.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform hover:shadow-2xl">
                            <div className="text-5xl mb-4">📊</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Analytics</h3>
                            <p className="text-purple-200">
                                Track conversations and improve your chatbot over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-purple-200">
                            Get started in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 text-white text-3xl font-bold shadow-2xl">
                                1
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Create</h3>
                            <p className="text-purple-200">
                                Fill in your business details and customize your chatbot's appearance
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 text-white text-3xl font-bold shadow-2xl">
                                2
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Train</h3>
                            <p className="text-purple-200">
                                Add custom Q&A pairs to teach your chatbot about your business
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 text-white text-3xl font-bold shadow-2xl">
                                3
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Deploy</h3>
                            <p className="text-purple-200">
                                Copy the embed code and add it to your website - done!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-purple-200 mb-8">
                            Create your first chatbot in less than 2 minutes
                        </p>
                        <Link
                            to="/create"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-2xl"
                        >

                            Create Your Chatbot Now
                        </Link>
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

export default HomePage;
