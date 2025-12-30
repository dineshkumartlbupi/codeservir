import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-20">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-purple-200 mb-8">Last updated: December 31, 2025</p>

                    <div className="space-y-8 text-purple-100">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p className="leading-relaxed">
                                Welcome to CodeServir ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered chatbot platform and services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                            <h3 className="text-xl font-semibold text-white mb-2">2.1 Information You Provide</h3>
                            <ul className="list-disc list-inside space-y-2 mb-4">
                                <li>Account information (name, email address, phone number)</li>
                                <li>Business information (business name, website URL, address)</li>
                                <li>Chatbot customization data (colors, descriptions, training data)</li>
                                <li>Payment information (processed securely through third-party providers)</li>
                                <li>Communication data (support requests, feedback)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mb-2">2.2 Automatically Collected Information</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Usage data (pages visited, features used, time spent)</li>
                                <li>Device information (browser type, operating system, IP address)</li>
                                <li>Chatbot conversation data (for improving AI responses)</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                            <p className="mb-2">We use your information to:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Provide, maintain, and improve our chatbot services</li>
                                <li>Process your transactions and manage your account</li>
                                <li>Train and optimize AI models for better chatbot performance</li>
                                <li>Send you service updates, security alerts, and support messages</li>
                                <li>Respond to your comments, questions, and customer service requests</li>
                                <li>Analyze usage patterns to enhance user experience</li>
                                <li>Detect, prevent, and address technical issues and security threats</li>
                                <li>Comply with legal obligations and enforce our terms</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
                            <p className="mb-2">We may share your information with:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, analytics, payment processing)</li>
                                <li><strong>Business Partners:</strong> With your consent, for joint marketing or service offerings</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                            </ul>
                            <p className="mt-4">We do not sell your personal information to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                            <p className="leading-relaxed">
                                We implement industry-standard security measures to protect your information, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-2">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Access controls and authentication mechanisms</li>
                                <li>Secure data centers with physical and digital safeguards</li>
                            </ul>
                            <p className="mt-4">However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Your Privacy Rights</h2>
                            <p className="mb-2">Depending on your location, you may have the following rights:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal information</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Restriction:</strong> Limit how we process your information</li>
                            </ul>
                            <p className="mt-4">To exercise these rights, contact us at <a href="mailto:privacy@codeservir.com" className="text-purple-400 hover:text-purple-300">privacy@codeservir.com</a></p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
                            <p className="leading-relaxed mb-2">
                                We use cookies and similar technologies to:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Remember your preferences and settings</li>
                                <li>Analyze site traffic and usage patterns</li>
                                <li>Provide personalized content and features</li>
                                <li>Measure the effectiveness of our services</li>
                            </ul>
                            <p className="mt-4">You can control cookies through your browser settings.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
                            <p className="leading-relaxed">
                                We retain your information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                            <p className="leading-relaxed">
                                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
                            <p className="leading-relaxed">
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
                            <p className="leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
                            <p className="leading-relaxed mb-2">
                                If you have questions about this Privacy Policy or our privacy practices, please contact us:
                            </p>
                            <div className="bg-white/5 rounded-lg p-4 mt-4">
                                <p><strong>Email:</strong> <a href="mailto:privacy@codeservir.com" className="text-purple-400 hover:text-purple-300">privacy@codeservir.com</a></p>
                                <p><strong>Phone:</strong> +91 9519202809</p>
                                <p><strong>Address:</strong> 4/37, 2nd Floor, Vibhav khad, Gomtinagar, Uttar Pradesh, India</p>
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

export default PrivacyPolicyPage;
