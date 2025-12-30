import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-20">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-purple-200 mb-8">Last updated: December 31, 2025</p>

                    <div className="space-y-8 text-purple-100">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="leading-relaxed">
                                By accessing or using CodeServir's AI-powered chatbot platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service. These Terms apply to all users, including visitors, registered users, and paying customers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                            <p className="leading-relaxed mb-2">
                                CodeServir provides an AI-powered chatbot platform that enables businesses to create, customize, and deploy intelligent chatbots for their websites and applications. Our Service includes:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Chatbot creation and customization tools</li>
                                <li>AI-powered natural language processing</li>
                                <li>Website integration capabilities</li>
                                <li>Training and management interfaces</li>
                                <li>Analytics and reporting features</li>
                                <li>Customer support and documentation</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
                            <h3 className="text-xl font-semibold text-white mb-2">3.1 Account Creation</h3>
                            <p className="leading-relaxed mb-4">
                                To use certain features of our Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">3.2 Account Security</h3>
                            <p className="leading-relaxed mb-4">
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">3.3 Account Termination</h3>
                            <p className="leading-relaxed">
                                We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activities.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Subscription Plans and Payments</h2>
                            <h3 className="text-xl font-semibold text-white mb-2">4.1 Pricing</h3>
                            <p className="leading-relaxed mb-4">
                                We offer various subscription plans (Starter, Professional, Enterprise). Pricing is subject to change with 30 days' notice to existing subscribers.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">4.2 Billing</h3>
                            <ul className="list-disc list-inside space-y-2 mb-4">
                                <li>Subscriptions are billed monthly or annually in advance</li>
                                <li>Payment is due at the beginning of each billing cycle</li>
                                <li>All fees are non-refundable except as required by law</li>
                                <li>You authorize us to charge your payment method automatically</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mb-2">4.3 Cancellation</h3>
                            <p className="leading-relaxed">
                                You may cancel your subscription at any time. Cancellation will be effective at the end of the current billing period. You will continue to have access to the Service until the end of your paid period.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use Policy</h2>
                            <p className="mb-2">You agree not to use the Service to:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on intellectual property rights of others</li>
                                <li>Transmit harmful, offensive, or inappropriate content</li>
                                <li>Engage in fraudulent or deceptive practices</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Use the Service for competitive analysis or benchmarking</li>
                                <li>Resell or redistribute the Service without authorization</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property Rights</h2>
                            <h3 className="text-xl font-semibold text-white mb-2">6.1 Our Rights</h3>
                            <p className="leading-relaxed mb-4">
                                The Service, including all software, designs, text, graphics, and other content, is owned by CodeServir and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">6.2 Your Content</h3>
                            <p className="leading-relaxed mb-4">
                                You retain ownership of any content you provide to the Service (training data, chatbot configurations, etc.). By using the Service, you grant us a license to use, store, and process your content solely to provide and improve the Service.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">6.3 Feedback</h3>
                            <p className="leading-relaxed">
                                Any feedback, suggestions, or ideas you provide to us become our property, and we may use them without restriction or compensation to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Data and Privacy</h2>
                            <p className="leading-relaxed">
                                Your use of the Service is also governed by our <Link to="/privacy-policy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>. We collect, use, and protect your data as described in that policy. You are responsible for ensuring that any data you collect through your chatbot complies with applicable privacy laws and regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability and Support</h2>
                            <h3 className="text-xl font-semibold text-white mb-2">8.1 Uptime</h3>
                            <p className="leading-relaxed mb-4">
                                We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to the Service. We may perform scheduled maintenance with advance notice when possible.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">8.2 Support</h3>
                            <p className="leading-relaxed">
                                Support levels vary by subscription plan. Professional and Enterprise customers receive priority support. We aim to respond to all support requests within 24-48 hours.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers and Limitations of Liability</h2>
                            <h3 className="text-xl font-semibold text-white mb-2">9.1 Service "As Is"</h3>
                            <p className="leading-relaxed mb-4">
                                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">9.2 Limitation of Liability</h3>
                            <p className="leading-relaxed mb-4">
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODESERVIR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">9.3 Maximum Liability</h3>
                            <p className="leading-relaxed">
                                Our total liability to you for any claims arising from or related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
                            <p className="leading-relaxed">
                                You agree to indemnify, defend, and hold harmless CodeServir and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Service, your violation of these Terms, or your violation of any rights of another party.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. Modifications to Service and Terms</h2>
                            <p className="leading-relaxed">
                                We reserve the right to modify or discontinue the Service at any time, with or without notice. We may also update these Terms from time to time. Material changes will be notified via email or through the Service. Your continued use after changes constitutes acceptance of the modified Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law and Dispute Resolution</h2>
                            <h3 className="text-xl font-semibold text-white mb-2">12.1 Governing Law</h3>
                            <p className="leading-relaxed mb-4">
                                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">12.2 Dispute Resolution</h3>
                            <p className="leading-relaxed">
                                Any disputes arising from these Terms or the Service shall first be attempted to be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in Uttar Pradesh, India.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">13. Miscellaneous</h2>
                            <h3 className="text-xl font-semibold text-white mb-2">13.1 Entire Agreement</h3>
                            <p className="leading-relaxed mb-4">
                                These Terms, together with our Privacy Policy, constitute the entire agreement between you and CodeServir regarding the Service.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">13.2 Severability</h3>
                            <p className="leading-relaxed mb-4">
                                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-2">13.3 Waiver</h3>
                            <p className="leading-relaxed">
                                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
                            <p className="leading-relaxed mb-2">
                                If you have questions about these Terms, please contact us:
                            </p>
                            <div className="bg-white/5 rounded-lg p-4 mt-4">
                                <p><strong>Email:</strong> <a href="mailto:legal@codeservir.com" className="text-purple-400 hover:text-purple-300">legal@codeservir.com</a></p>
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

export default TermsOfServicePage;
