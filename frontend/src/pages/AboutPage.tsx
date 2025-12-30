import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <section className="relative py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-center">About CodeServir</h1>
                    <p className="text-xl text-purple-200 text-center mb-16">Empowering businesses with intelligent chatbot solutions</p>

                    <div className="space-y-12">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                            <p className="text-purple-200 text-lg leading-relaxed">
                                At CodeServir, we believe every business deserves intelligent, engaging customer interactions. 
                                Our mission is to make advanced AI chatbot technology accessible to businesses of all sizes, 
                                without requiring technical expertise or large budgets.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-4">What We Do</h2>
                            <p className="text-purple-200 text-lg leading-relaxed mb-6">
                                We provide a powerful, easy-to-use platform for creating AI-powered chatbots that:
                            </p>
                            <ul className="space-y-3 text-purple-200">
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">✨</span>
                                    <span>Engage customers 24/7 with intelligent responses</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">🎯</span>
                                    <span>Understand context and provide relevant information</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">🚀</span>
                                    <span>Deploy in minutes without coding</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">💎</span>
                                    <span>Match your brand perfectly</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">🎯 Simplicity</h3>
                                    <p className="text-purple-200">Making complex technology simple and accessible</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">⚡ Innovation</h3>
                                    <p className="text-purple-200">Constantly improving with cutting-edge AI</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">🤝 Support</h3>
                                    <p className="text-purple-200">Always here to help you succeed</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">🔒 Privacy</h3>
                                    <p className="text-purple-200">Your data security is our priority</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">Join Thousands of Happy Customers</h2>
                            <p className="text-xl text-purple-200 mb-8">
                                Start creating amazing chatbot experiences today
                            </p>
                            <Link
                                to="/create"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-2xl"
                            >
                                <span className="text-3xl">🚀</span>
                                Get Started Now
                            </Link>
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

export default AboutPage;
