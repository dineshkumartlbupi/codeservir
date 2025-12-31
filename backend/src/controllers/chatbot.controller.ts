import { Request, Response } from 'express';
import chatbotService from '../services/chatbot.service';

export class ChatbotController {
    /**
     * Create a new chatbot
     */
    async createChatbot(req: Request, res: Response): Promise<void> {
        try {
            const {
                ownerName,
                businessName,
                websiteUrl,
                contactNumber,
                contactEmail,
                businessAddress,
                businessDescription,
                primaryColor,
                secondaryColor,
            } = req.body;

            // Validation
            if (!ownerName || !businessName || !websiteUrl || !contactEmail) {
                res.status(400).json({
                    error: 'Missing required fields',
                    required: ['ownerName', 'businessName', 'websiteUrl', 'contactEmail'],
                });
                return;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactEmail)) {
                res.status(400).json({ error: 'Invalid email address' });
                return;
            }

            // Validate URL
            try {
                new URL(websiteUrl);
            } catch {
                res.status(400).json({ error: 'Invalid website URL' });
                return;
            }

            const chatbot = await chatbotService.createChatbot({
                ownerName,
                businessName,
                websiteUrl,
                contactNumber: contactNumber || '', // Handle optional field
                contactEmail,
                businessAddress: businessAddress || '', // Handle optional field
                businessDescription: businessDescription || '', // Handle optional field
                primaryColor: primaryColor || '#4F46E5',
                secondaryColor: secondaryColor || '#10B981',
            });

            // Generate embed code
            const embedCode = this.generateEmbedCode(chatbot.id);

            res.status(201).json({
                success: true,
                chatbot: {
                    id: chatbot.id,
                    businessName: chatbot.businessName,
                    createdAt: chatbot.createdAt,
                },
                embedCode,
                message: 'Chatbot created successfully! Your knowledge base is being built in the background.',
            });
        } catch (error: any) {
            console.error('Create chatbot error:', error);

            // Check if it's a limit error
            if (error.message && error.message.includes('creation limit reached')) {
                res.status(403).json({
                    error: error.message,
                    requiresUpgrade: true // Hint for frontend
                });
                return;
            }

            res.status(500).json({
                error: error.message || 'Failed to create chatbot', // Return actual error message
            });
        }
    }

    /**
     * Get chatbot details
     */
    async getChatbot(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;

            const chatbot = await chatbotService.getChatbot(chatbotId);
            if (!chatbot) {
                res.status(404).json({ error: 'Chatbot not found' });
                return;
            }

            res.json({ success: true, chatbot });
        } catch (error) {
            console.error('Get chatbot error:', error);
            res.status(500).json({ error: 'Failed to get chatbot' });
        }
    }

    /**
     * Get chatbot configuration for widget
     */
    async getChatbotConfig(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;

            const config = await chatbotService.getChatbotConfig(chatbotId);
            if (!config) {
                res.status(404).json({ error: 'Chatbot not found' });
                return;
            }

            res.json({ success: true, config });
        } catch (error) {
            console.error('Get chatbot config error:', error);
            res.status(500).json({ error: 'Failed to get chatbot configuration' });
        }
    }

    /**
     * Get chat statistics
     */
    async getChatStats(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;

            const stats = await chatbotService.getChatStats(chatbotId);
            if (!stats) {
                res.status(404).json({ error: 'Chatbot not found' });
                return;
            }

            res.json({ success: true, stats });
        } catch (error) {
            console.error('Get chat stats error:', error);
            res.status(500).json({ error: 'Failed to get chat statistics' });
        }
    }

    /**
     * Train chatbot with manual data
     */
    async trainChatbot(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;
            const { trainingData } = req.body; // Expects [{ question, answer }]

            if (!trainingData || !Array.isArray(trainingData) || trainingData.length === 0) {
                res.status(400).json({ error: 'Invalid training data' });
                return;
            }

            await chatbotService.trainChatbot(chatbotId, trainingData);

            res.json({
                success: true,
                message: `Successfully trained chatbot with ${trainingData.length} new items.`
            });
        } catch (error) {
            console.error('Train chatbot error:', error);
            res.status(500).json({ error: 'Failed to train chatbot' });
        }
    }

    /**
     * Check chatbot creation limit
     */
    async checkLimit(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'Email is required' });
                return;
            }

            const limitInfo = await chatbotService.checkLimit(email);
            res.json(limitInfo);
        } catch (error) {
            console.error('Check limit error:', error);
            res.status(500).json({ error: 'Failed to check limit' });
        }
    }

    /**
     * Get chatbots by email (POST)
     */
    async listByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'Email is required' });
                return;
            }

            const chatbots = await chatbotService.listByEmail(email);
            res.json({ chatbots, total: chatbots.length });
        } catch (error) {
            console.error('List by email error:', error);
            res.status(500).json({ error: 'Failed to list chatbots' });
        }
    }

    /**
     * Get chatbots (GET, authenticated)
     */
    async listChatbots(req: Request, res: Response): Promise<void> {
        try {
            // For now return empty or use query param if needed
            // Frontend uses listByEmail primarily for the new flow
            res.json({ chatbots: [] });
        } catch (error) {
            res.status(500).json({ error: 'Failed' });
        }
    }

    /**
     * Update chatbot
     */
    async updateChatbot(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;
            const updateData = req.body;

            const updated = await chatbotService.updateChatbot(chatbotId, updateData);
            if (!updated) {
                res.status(404).json({ error: 'Chatbot not found' });
                return;
            }

            res.json({ success: true, chatbot: updated });
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({ error: 'Failed to update' });
        }
    }

    /**
     * Delete chatbot
     */
    async deleteChatbot(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;
            await chatbotService.deleteChatbot(chatbotId);
            res.json({ success: true, message: 'Deleted successfully' });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ error: 'Failed to delete' });
        }
    }

    /**
     * Generate embed code
     */
    private generateEmbedCode(chatbotId: string): string {
        // Use production URL if in Vercel, otherwise explicit ENV or localhost
        let cdnUrl = process.env.CDN_URL;

        if (!cdnUrl) {
            if (process.env.VERCEL) {
                cdnUrl = 'https://codeservir-api.vercel.app';
            } else {
                cdnUrl = 'http://localhost:5001';
            }
        }

        console.log('Using CDN URL:', cdnUrl);

        return `<script>
(function () {
  var s = document.createElement("script");
  s.src = "${cdnUrl}/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "${chatbotId}");
  (document.head || document.documentElement).appendChild(s);
})();
</script>`;
    }
}

export default new ChatbotController();
