import React from 'react';
import { Link } from 'react-router-dom';

const DocsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            </div>

            <section className="relative py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-white mb-6">Documentation</h1>
                    <p className="text-xl text-purple-200 mb-12">Everything you need to know about CodeServir</p>

                    <div className="space-y-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-4">🚀 Quick Start</h2>
                            <div className="space-y-4 text-purple-200">
                                <p><strong className="text-white">Step 1:</strong> Go to <Link to="/create" className="text-purple-400 hover:text-purple-300">Create Chatbot</Link> page</p>
                                <p><strong className="text-white">Step 2:</strong> Fill in your business details</p>
                                <p><strong className="text-white">Step 3:</strong> Customize colors to match your brand</p>
                                <p><strong className="text-white">Step 4:</strong> Copy the embed code</p>
                                <p><strong className="text-white">Step 5:</strong> Add it to your website before &lt;/body&gt; tag</p>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-4">🎓 Training Your Chatbot</h2>
                            <p className="text-purple-200 mb-4">After creating your chatbot, you can train it with custom Q&A pairs:</p>
                            <ul className="space-y-2 text-purple-200 list-disc list-inside">
                                <li>Add common customer questions</li>
                                <li>Provide clear, detailed answers</li>
                                <li>Include variations of questions</li>
                                <li>Update regularly based on feedback</li>
                            </ul>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-4">🌐 Website Integration</h2>
                            <p className="text-purple-200 mb-4">Add this code to your website:</p>
                            <pre className="bg-slate-900/80 p-4 rounded-lg text-green-400 text-sm overflow-x-auto">
{`<script>
(function () {
  var s = document.createElement("script");
  s.src = "https://codeservir-api.vercel.app/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "YOUR_CHATBOT_ID");
  (document.head || document.documentElement).appendChild(s);
})();
</script>`}
                            </pre>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-4">📱 Mobile App Integration</h2>
                            <p className="text-purple-200 mb-4">For mobile apps, use the embed URL in a WebView:</p>
                            <pre className="bg-slate-900/80 p-4 rounded-lg text-green-400 text-sm">
                                https://codeservir-api.vercel.app/embed/YOUR_CHATBOT_ID
                            </pre>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                            <h2 className="text-3xl font-bold text-white mb-4">❓ Need Help?</h2>
                            <p className="text-purple-200">
                                Contact us at <a href="mailto:support@codeservir.com" className="text-purple-400 hover:text-purple-300">support@codeservir.com</a> or visit our <Link to="/contact" className="text-purple-400 hover:text-purple-300">Contact page</Link>.
                            </p>
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
            `}</style>
        </div>
    );
};

export default DocsPage;
