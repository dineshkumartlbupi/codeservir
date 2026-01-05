import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Use a generic interface or match your backend user structure
export interface AuthUser {
    id: string;
    email: string;
    fullName?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    setUser: (user: AuthUser | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for user data
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);

        // Setup Fetch Interceptor for 401/403
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (response.status === 401 || response.status === 403) {
                    const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
                    // Only logout if request is to our API
                    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                    if (url.includes(API_URL) || url.includes('/api/')) {
                        console.warn('Session expired or unauthorized. Logging out...');
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        setUser(null);
                        // Optional: Redirect to login if not already there
                        if (!window.location.pathname.includes('/login')) {
                            window.location.href = '/login';
                        }
                    }
                }
                return response;
            } catch (error) {
                throw error;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    const logout = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        setUser,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
