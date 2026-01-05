import React from 'react';
import { Link } from 'react-router-dom';

const ShippingPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-20">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Shipping & Delivery Policy</h1>
                    <p className="text-purple-200 mb-8">Last updated: January 5, 2026</p>

                    <div className="space-y-8 text-purple-100">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Digital Delivery</h2>
                            <p className="leading-relaxed">
                                CodeServir is a Software as a Service (SaaS) platform. We do not sell physical products, and therefore, no physical shipping is involved. All services are delivered digitally over the internet.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Account Activation</h2>
                            <p className="leading-relaxed">
                                Upon successful signup and/or payment (if applicable), your account gets activated immediately. You will receive a confirmation email with your account details. You can access the platform instantly using your login credentials.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Accessing Services</h2>
                            <p className="leading-relaxed">
                                You can access our services from anywhere with an internet connection by visiting <a href="https://codeservir.com" className="text-purple-400 hover:text-purple-300">https://codeservir.com</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Support</h2>
                            <p className="leading-relaxed">
                                If you experience any issues accessing your account or purchased services, please contact our support team immediately.
                            </p>
                            <div className="bg-white/5 rounded-lg p-4 mt-4">
                                <p><strong>Email:</strong> <a href="mailto:support@codeservir.com" className="text-purple-400 hover:text-purple-300">support@codeservir.com</a></p>
                                <p><strong>Phone:</strong> +91 9519202809</p>
                            </div>
                        </section>

                        <div className="mt-12 pt-8 border-t border-white/20">
                            <Link to="/" className="text-purple-400 hover:text-purple-300">← Back to Home</Link>
                        </div>
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
            `}</style>
        </div>
    );
};

export default ShippingPolicyPage;
