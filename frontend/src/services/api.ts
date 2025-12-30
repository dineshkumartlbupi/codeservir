// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://codeservir-api.vercel.app';

// API Client with error handling
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Request failed' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async googleLogin(idToken: string, userData: any) {
        return this.request('/api/auth/google-login', {
            method: 'POST',
            body: JSON.stringify({ idToken, user: userData }),
        });
    }

    async emailLogin(email: string, password: string) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async signup(userData: any) {
        return this.request('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Chatbot endpoints
    async createChatbot(data: any, token?: string) {
        return this.request('/api/chatbot/create', {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: JSON.stringify(data),
        });
    }

    async getChatbots(token?: string) {
        return this.request('/api/chatbot/list', {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }

    async getChatbot(id: string, token?: string) {
        return this.request(`/api/chatbot/${id}`, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }

    async updateChatbot(id: string, data: any, token?: string) {
        return this.request(`/api/chatbot/${id}`, {
            method: 'PUT',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: JSON.stringify(data),
        });
    }

    async deleteChatbot(id: string, token?: string) {
        return this.request(`/api/chatbot/${id}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }

    async trainChatbot(id: string, trainingData: any, token?: string) {
        return this.request(`/api/chatbot/${id}/train`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: JSON.stringify({ trainingData }),
        });
    }

    // Analytics endpoints
    async getChatbotAnalytics(id: string, token?: string) {
        return this.request(`/api/chatbot/${id}/analytics`, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }

    async getDashboardStats(token?: string) {
        return this.request('/api/dashboard/stats', {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }

    // User endpoints
    async updateProfile(data: any, token?: string) {
        return this.request('/api/user/profile', {
            method: 'PUT',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: JSON.stringify(data),
        });
    }

    async getProfile(token?: string) {
        return this.request('/api/user/profile', {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export types
export interface ChatbotData {
    name: string;
    description: string;
    website: string;
    email: string;
    phone?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export interface ChatbotResponse {
    success: boolean;
    chatbotId: string;
    message: string;
    embedCode?: string;
}

export interface DashboardStats {
    totalChatbots: number;
    totalConversations: number;
    activeUsers: number;
    responseRate: string;
}

export interface Chatbot {
    id: string;
    name: string;
    description: string;
    website: string;
    status: 'active' | 'inactive';
    conversations: number;
    lastActive: string;
    createdAt: string;
}
