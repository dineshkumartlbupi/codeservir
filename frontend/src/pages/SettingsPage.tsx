import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../config/firebase';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'billing'>('profile');

    const [profileData, setProfileData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        businessName: '',
        website: ''
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        chatbotAlerts: true,
        weeklyReports: false,
        marketingEmails: false
    });

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        // Save profile data
        alert('Profile updated successfully!');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Delete account logic
            alert('Account deletion requested. You will receive a confirmation email.');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'account', label: 'Account', icon: '⚙️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'billing', label: 'Billing', icon: '💳' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Settings ⚙️</h1>
                    <p className="text-purple-200">Manage your account and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                : 'text-purple-200 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-xl">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

                                    {/* Profile Picture */}
                                    <div className="flex items-center gap-6 mb-8">
                                        <img
                                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'User')}&background=6366f1&color=fff&size=128`}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full border-4 border-purple-400"
                                        />
                                        <div>
                                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors mb-2">
                                                Change Photo
                                            </button>
                                            <p className="text-purple-300 text-sm">JPG, PNG or GIF. Max size 2MB</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSaveProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                                    Display Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.displayName}
                                                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    disabled
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-purple-300 cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                                    Business Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.businessName}
                                                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="Your Company"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={profileData.website}
                                                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all hover:scale-105"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

                                    <div className="space-y-6">
                                        {/* Password Change */}
                                        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                            <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
                                            <p className="text-purple-200 text-sm mb-4">
                                                {user?.providerData[0]?.providerId === 'google.com'
                                                    ? 'You signed in with Google. Password change is not available.'
                                                    : 'Update your password to keep your account secure.'}
                                            </p>
                                            {user?.providerData[0]?.providerId !== 'google.com' && (
                                                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                                                    Change Password
                                                </button>
                                            )}
                                        </div>

                                        {/* Two-Factor Authentication */}
                                        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                            <h3 className="text-lg font-semibold text-white mb-2">Two-Factor Authentication</h3>
                                            <p className="text-purple-200 text-sm mb-4">Add an extra layer of security to your account.</p>
                                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                                                Enable 2FA
                                            </button>
                                        </div>

                                        {/* Delete Account */}
                                        <div className="p-6 bg-red-500/10 rounded-xl border border-red-400/20">
                                            <h3 className="text-lg font-semibold text-red-300 mb-2">Delete Account</h3>
                                            <p className="text-purple-200 text-sm mb-4">
                                                Permanently delete your account and all associated data. This action cannot be undone.
                                            </p>
                                            <button
                                                onClick={handleDeleteAccount}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>

                                    <div className="space-y-4">
                                        {Object.entries(notifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </p>
                                                    <p className="text-purple-300 text-sm">
                                                        {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                                                        {key === 'chatbotAlerts' && 'Get alerts when chatbots need attention'}
                                                        {key === 'weeklyReports' && 'Receive weekly performance reports'}
                                                        {key === 'marketingEmails' && 'Get updates about new features and offers'}
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Billing Tab */}
                            {activeTab === 'billing' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h2>

                                    {/* Current Plan */}
                                    <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mb-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-purple-100 text-sm mb-1">Current Plan</p>
                                                <h3 className="text-2xl font-bold text-white">Free Plan</h3>
                                            </div>
                                            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                                                Upgrade Plan
                                            </button>
                                        </div>
                                    </div>

                                    {/* Usage */}
                                    <div className="p-6 bg-white/5 rounded-xl border border-white/10 mb-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-purple-200">Chatbots</span>
                                                    <span className="text-white font-medium">3 / 5</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-purple-200">Conversations</span>
                                                    <span className="text-white font-medium">1,234 / 10,000</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                                        <p className="text-purple-200 text-sm mb-4">No payment method on file</p>
                                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                                            Add Payment Method
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
