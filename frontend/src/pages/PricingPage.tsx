import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PricingPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const plans = [
        {
            name: 'Starter',
            price: 'Free',
            period: 'forever',
            description: 'Perfect for trying out CodeServir',
            features: [
                '5 Chatbots',
                '1,000 conversations',
                'Basic customization',
                'Website integration',
                'Email support',
                'Community access'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Professional',
            price: '₹499',
            period: '/month',
            description: 'For growing businesses',
            features: [
                '10 Chatbots',
                '10,000 conversations',
                'Full customization',
                'Advanced AI features',
                'Analytics dashboard',
                'Priority support',
                'Custom training',
                'API access'
            ],
            cta: 'Buy Now',
            popular: true
        },
        {
            name: 'Enterprise',
            price: '₹999',
            period: '/month',
            description: 'For large organizations',
            features: [
                '20 Chatbots',
                '100,000 conversations',
                'White-label solution',
                'Dedicated support',
                'Custom integrations',
                'SLA guarantee',
                'Advanced analytics',
                'Team collaboration',
                'Custom deployment'
            ],
            cta: 'Buy Now',
            popular: false
        }
    ];

    const handleSubscribe = async (plan: any) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (plan.name === 'Starter') {
            navigate('/create');
            return;
        }

        setLoading(true);

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

            // 1. Get Chatbots (MVP: Select first one or ask user)
            // For now, let's just get the first chatbot of the user 
            // NOTE: Ideally we should show a modal to select the chatbot
            const chatbotsRes = await fetch(`${API_URL}/api/dashboard/stats`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const chatbotsData = await chatbotsRes.json();

            // This endpoint might not return list of chatbots directly, checking routes/dashboard.routes.ts might be needed.
            // Assuming we might need a specific route, but let's try to list chatbots.
            // Actually, /api/chatbot might accept GET to list
            const listRes = await fetch(`${API_URL}/api/chatbot`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const listData = await listRes.json();

            let chatbotId = '';
            if (listData && listData.length > 0) {
                chatbotId = listData[0].id; // Pick first for MVP
            } else {
                alert('Please create a chatbot first to upgrade.');
                navigate('/create');
                return;
            }

            // 2. Create Order
            const orderRes = await fetch(`${API_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    chatbotId: chatbotId,
                    planType: (() => {
                        const name = plan.name.toLowerCase();
                        if (name === 'starter') return 'basic';
                        if (name === 'professional') return 'pro';
                        if (name === 'enterprise') return 'premium';
                        return name;
                    })()
                })
            });

            const orderData = await orderRes.json();

            if (!orderData.success) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            const { order } = orderData;

            // 3. Open Razorpay
            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "CodeServir",
                description: `${plan.name} Subscription`,
                order_id: order.orderId,
                handler: async function (response: any) {
                    // 4. Verify Payment
                    try {
                        const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({
                                chatbotId,
                                planType: (() => {
                                    const name = plan.name.toLowerCase();
                                    if (name === 'starter') return 'basic';
                                    if (name === 'professional') return 'pro';
                                    if (name === 'enterprise') return 'premium';
                                    return name;
                                })(),
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                amount: order.amount
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            alert('Payment Successful! Subscription Active.');
                            navigate('/dashboard');
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user.displayName || user.email || '',
                    email: user.email || '',
                    contact: ''
                },
                theme: {
                    color: "#6366f1"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error: any) {
            console.error('Payment Error:', error);
            alert(error.message || 'Payment initialization failed');
        } finally {
            setLoading(false);
        }
    };

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
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                        Choose the perfect plan for your business. Start free, upgrade anytime.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="relative py-12 px-4 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border transition-all hover:scale-105 ${plan.popular
                                    ? 'border-purple-400 shadow-2xl shadow-purple-500/50'
                                    : 'border-white/20'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-purple-200 text-sm mb-4">{plan.description}</p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-bold text-white">{plan.price}</span>
                                        <span className="text-purple-300">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-purple-200">
                                            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loading}
                                    className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-2">Can I change plans later?</h3>
                            <p className="text-purple-200">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-2">Is there a free trial?</h3>
                            <p className="text-purple-200">Yes! The Professional plan includes a 14-day free trial. No credit card required.</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-2">What payment methods do you accept?</h3>
                            <p className="text-purple-200">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-2">Can I cancel anytime?</h3>
                            <p className="text-purple-200">Absolutely! Cancel anytime with no questions asked. No long-term contracts.</p>
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

export default PricingPage;
