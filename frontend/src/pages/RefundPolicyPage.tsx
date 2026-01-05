import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-20">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cancellation & Refund Policy</h1>
                    <p className="text-purple-200 mb-8">Last updated: January 5, 2026</p>

                    <div className="space-y-8 text-purple-100">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Cancellation Policy</h2>
                            <p className="leading-relaxed">
                                You may cancel your subscription at any time. Cancellation is effective immediately, but you will retain access to the premium features until the end of your current billing cycle.
                            </p>
                            <p className="leading-relaxed mt-4">
                                To cancel your subscription:
                                <ul className="list-disc list-inside mt-2 ml-4">
                                    <li>Log in to your account.</li>
                                    <li>Navigate to the settings or billing section.</li>
                                    <li>Click on "Cancel Subscription".</li>
                                </ul>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Refund Policy</h2>
                            <p className="leading-relaxed">
                                <strong>14-Day Money-Back Guarantee:</strong> We offer a 14-day money-back guarantee for all new subscriptions. If you are not satisfied with our service, you can request a full refund within 14 days of your initial purchase.
                            </p>
                            <p className="leading-relaxed mt-4">
                                <strong>After 14 Days:</strong> Refunds are generally not provided for cancellations made after the 14-day window. However, exceptions may be made in cases of technical failures attributable to our platform that prevent you from using the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Processing Refunds</h2>
                            <p className="leading-relaxed">
                                Once approved, refunds are processed within 5-7 business days. The amount will be credited back to your original payment method. The time it takes for the refund to appear in your account may vary depending on your bank or credit card provider.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Contact Us for Refunds</h2>
                            <p className="leading-relaxed">
                                To request a refund or for any billing-related inquiries, please contact our support team:
                            </p>
                            <div className="bg-white/5 rounded-lg p-4 mt-4">
                                <p><strong>Email:</strong> <a href="mailto:billing@codeservir.com" className="text-purple-400 hover:text-purple-300">billing@codeservir.com</a></p>
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

export default RefundPolicyPage;
