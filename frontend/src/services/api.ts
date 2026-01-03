// API service for chatbot operations
const API_URL = process.env.REACT_APP_API_URL || 'https://codeservir-api.vercel.app';

export interface Chatbot {
    id: string;
    name: string;
    businessName: string;
    description?: string;
    website: string;
    websiteUrl?: string;
    contactEmail: string;
    status: 'active' | 'inactive';
    conversations: number;
    lastActive: string;
    createdAt: string;
    ownerEmail?: string;
}

export interface DashboardStats {
    totalChatbots: number;
    totalConversations: number;
    activeUsers: number;
    responseRate: string;
    // Optional/Legacy keys for compatibility
    activeChatbots?: number;
    planType?: string;
    totalMessages?: number;
}

export interface ChatbotLimitResponse {
    canCreate: boolean;
    currentCount: number;
    maxLimit: number;
    requiresUpgrade: boolean;
    message: string;
}

export const api = {
    // Check if user can create more chatbots
    async checkChatbotLimit(email: string): Promise<ChatbotLimitResponse> {
        try {
            const response = await fetch(`${API_URL}/api/chatbot/check-limit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error checking limit:', error);
            // Return default allowing creation if API fails
            return {
                canCreate: true,
                currentCount: 0,
                maxLimit: 5,
                requiresUpgrade: false,
                message: 'You can create chatbots'
            };
        }
    },

    // Get all chatbots for an email
    async getChatbotsByEmail(email: string, token?: string | null): Promise<{ chatbots: Chatbot[], total: number }> {
        try {
            const headers: any = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/api/chatbot/by-email`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chatbots');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching chatbots:', error);
            return { chatbots: [], total: 0 };
        }
    },

    // Create chatbot
    async createChatbot(data: any, token?: string | null): Promise<any> {
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/chatbot/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create chatbot');
        }

        return await response.json();
    },

    // Get chatbots (for logged in users)
    async getChatbots(token?: string | null): Promise<{ chatbots: Chatbot[] }> {
        try {
            const headers: any = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/api/chatbot`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chatbots');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching chatbots:', error);
            return { chatbots: [] };
        }
    },

    // Update chatbot
    async updateChatbot(id: string, data: any, token?: string | null): Promise<any> {
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/chatbot/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update chatbot');
        }

        return await response.json();
    },

    // Delete chatbot
    async deleteChatbot(id: string, token?: string | null): Promise<any> {
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/chatbot/${id}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to delete chatbot');
        }

        return await response.json();
    },

    // Get dashboard stats
    async getDashboardStats(token?: string | null, email?: string): Promise<DashboardStats> {
        try {
            const headers: any = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            let url = `${API_URL}/api/dashboard/stats`;
            if (email) {
                url += `?email=${encodeURIComponent(email)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalChatbots: 0,
                totalConversations: 0,
                activeUsers: 0,
                responseRate: '0%'
            };
        }
    },
    // Get specific chatbot stats
    async getChatbotStats(chatbotId: string, token?: string | null): Promise<any> {
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/chatbot/${chatbotId}/stats`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch chatbot stats');
        }

        return await response.json();
    },
};
