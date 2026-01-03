import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/features', label: 'Features' },
        { path: '/pricing', label: 'Pricing' },
        { path: '/docs', label: 'Docs' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    const handleSignOut = async () => {
        await logout();
        setShowProfileMenu(false);
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo-horizontal.png"
                            alt="CodeServir Logo"
                            className="h-10 w-auto transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.path)
                                    ? 'bg-white/10 text-white'
                                    : 'text-purple-200 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            // Show user profile when logged in
                            <>
                                <Link
                                    to="/create"
                                    className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
                                >
                                    Create Chatbot
                                </Link>

                                <div className="relative ml-2">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <img
                                            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=6366f1&color=fff`}
                                            alt={user.displayName || 'User'}
                                            className="w-8 h-8 rounded-full border-2 border-purple-400"
                                        />
                                        <span className="text-white font-medium hidden lg:block">
                                            {user.displayName || user.email?.split('@')[0]}
                                        </span>
                                        <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-white/10 py-2">
                                            <div className="px-4 py-2 border-b border-white/10">
                                                <p className="text-sm font-medium text-white">{user.displayName || 'User'}</p>
                                                <p className="text-xs text-purple-300">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/dashboard"
                                                className="block px-4 py-2 text-sm text-purple-200 hover:bg-white/10 hover:text-white transition-colors"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                📊 Dashboard
                                            </Link>
                                            <Link
                                                to="/my-chatbots"
                                                className="block px-4 py-2 text-sm text-purple-200 hover:bg-white/10 hover:text-white transition-colors"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                🤖 My Chatbots
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-purple-200 hover:bg-white/10 hover:text-white transition-colors"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                ⚙️ Settings
                                            </Link>
                                            <hr className="my-2 border-white/10" />
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-white/10 hover:text-red-200 transition-colors"
                                            >
                                                🚪 Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Show login/signup buttons when not logged in
                            <>
                                <Link
                                    to="/login"
                                    className="ml-4 px-5 py-2 text-white hover:bg-white/10 rounded-lg font-medium transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
                    <div className="px-4 py-4 space-y-2">
                        {user && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg mb-4">
                                <img
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=6366f1&color=fff`}
                                    alt={user.displayName || 'User'}
                                    className="w-10 h-10 rounded-full border-2 border-purple-400"
                                />
                                <div>
                                    <p className="text-white font-medium">{user.displayName || 'User'}</p>
                                    <p className="text-xs text-purple-300">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.path)
                                    ? 'bg-white/10 text-white'
                                    : 'text-purple-200 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            <>
                                <Link
                                    to="/create"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-center"
                                >
                                    Create Chatbot
                                </Link>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-purple-200 hover:bg-white/10 rounded-lg"
                                >
                                    📊 Dashboard
                                </Link>
                                <Link
                                    to="/my-chatbots"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-purple-200 hover:bg-white/10 rounded-lg"
                                >
                                    🤖 My Chatbots
                                </Link>
                                <Link
                                    to="/settings"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-purple-200 hover:bg-white/10 rounded-lg"
                                >
                                    ⚙️ Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleSignOut();
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-300 hover:bg-white/10 rounded-lg"
                                >
                                    🚪 Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg font-medium text-center"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-center"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
