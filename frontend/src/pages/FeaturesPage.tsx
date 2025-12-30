import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage: React.FC = () => {
    const features = [
        {
            icon: '⚡',
            title: 'Instant Setup',
            description: 'Create and deploy your chatbot in under 2 minutes. No technical knowledge required.',
            details: ['Simple form-based creation', 'One-click deployment', 'Instant embed code generation']
        },
        {
            icon: '🎨',
            title: 'Full Customization',
            description: 'Match your brand perfectly with customizable colors, styles, and messaging.',
            details: ['Custom brand colors', 'Personalized greetings', 'Flexible styling options']
        },
        {
            icon: '🤖',
            title: 'AI-Powered Responses',
            description: 'Advanced AI understands context and provides intelligent, relevant answers.',
            details: ['Natural language processing', 'Context-aware responses', 'Continuous learning']
        },
        {
            icon: '📱',
            title: 'Mobile Responsive',
            description: 'Perfect experience on all devices - desktop, tablet, and mobile.',
            details: ['Touch-optimized interface', 'Adaptive layouts', 'Mobile app integration']
        },
        {
            icon: '🎓',
            title: 'Easy Training',
            description: 'Train your chatbot with custom Q&A pairs through an intuitive interface.',
            details: ['Simple Q&A management', 'Bulk training support', 'Real-time updates']
        },
        {
            icon: '🌐',
            title: 'Website Integration',
            description: 'Automatically learns from your website content for better responses.',
            details: ['Automatic content scraping', 'Smart content indexing', 'Continuous updates']
        },
        {
            icon: '💬',
            title: 'Multi-Channel Support',
            description: 'Deploy your chatbot on websites, mobile apps, and more.',
            details: ['Website widget', 'Mobile WebView', 'API access']
        },
        {
            icon: '📊',
            title: 'Analytics & Insights',
            description: 'Track conversations and understand your customers better.',
            details: ['Conversation tracking', 'User analytics', 'Performance metrics']
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            description: 'Enterprise-grade security with data encryption and privacy controls.',
            details: ['Data encryption', 'GDPR compliant', 'Secure hosting']
        },
        {
            icon: '⚙️',
            title: 'Advanced Configuration',
            description: 'Fine-tune every aspect of your chatbot\'s behavior and appearance.',
            details: ['Custom workflows', 'API integration', 'Webhook support']
        },
        {
            icon: '🚀',
            title: 'High Performance',
            description: 'Lightning-fast responses with 99.9% uptime guarantee.',
            details: ['< 1s response time', 'CDN delivery', 'Auto-scaling']
        },
        {
            icon: '🌍',
            title: 'Multi-Language',
            description: 'Support for multiple languages to serve global audiences.',
            details: ['20+ languages', 'Auto-translation', 'Localization support']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Powerful Features
                    </h1>
                    <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                        Everything you need to create intelligent, engaging chatbots that delight your customers
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative py-12 px-4 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all hover:shadow-2xl"
                            >
                                <div className="text-6xl mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-purple-200 mb-4">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-purple-300 text-sm">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Experience These Features?
                        </h2>
                        <p className="text-xl text-purple-200 mb-8">
                            Create your chatbot now and see the difference
                        </p>
                        <Link
                            to="/create"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-2xl"
                        >
                            <span className="text-3xl">🚀</span>
                            Get Started Free
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
            `}</style>
        </div>
    );
};

export default FeaturesPage;
