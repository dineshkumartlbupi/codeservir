import { Request, Response } from 'express';
import chatbotModel from '../models/chatbot.model';
import userSubscriptionModel from '../models/user-subscription.model';
import { query } from '../config/database';

export class DashboardController {
    /**
     * Get dashboard statistics
     */
    async getStats(req: Request, res: Response): Promise<void> {
        try {
            // MOCK: Decode token manually since we don't have full auth middleware set up yet
            // This is "insecure" signature-wise but sufficient for passing context in this prototype phase

            let email = req.query.email as string;

            const authHeader = req.headers.authorization;
            if (!email && authHeader && authHeader.startsWith('Bearer ')) {
                try {
                    const token = authHeader.split(' ')[1];
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
                    const decoded = JSON.parse(jsonPayload);
                    if (decoded.email) {
                        email = decoded.email;
                    }
                } catch (e) {
                    console.warn('Failed to decode token manually:', e);
                }
            }

            if (!email) {
                // Return generic stats or error
                // res.status(400).json({ error: 'User email required for stats' });
                // Return dummy stats to avoid crashing frontend if it doesn't send email
                res.json({
                    totalConversations: 0,
                    activeChatbots: 0,
                    totalMessages: 0,
                    planType: 'Free'
                });
                return;
            }

            // Get chatbots for user
            const chatbots = await chatbotModel.findByEmail(email);
            const activeChatbots = chatbots.length;

            // Get total messages (aggregate from chat_usage)
            // We need a method in model or raw query
            let totalMessages = 0;
            if (chatbots.length > 0) {
                const ids = chatbots.map(c => `'${c.id}'`).join(',');
                const usageResult = await query(
                    `SELECT SUM(chat_count) as total FROM chat_usage WHERE chatbot_id IN (${ids})`
                );
                totalMessages = parseInt(usageResult.rows[0].total || '0', 10);
            }

            // Get subscription
            const subscription = await userSubscriptionModel.findByEmail(email);
            const planType = subscription?.planType === 'premium' ? 'Premium' : 'Free';

            res.json({
                totalChatbots: activeChatbots,
                totalConversations: totalMessages,
                activeUsers: 0,
                responseRate: planType // Using this field to pass Plan Type for now
            });

        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({ error: 'Failed to get stats' });
        }
    }
}

export default new DashboardController();
