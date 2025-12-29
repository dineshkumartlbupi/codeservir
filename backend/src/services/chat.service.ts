import { query } from '../config/database';
import aiService, { ChatMessage } from './ai.service';
import chatbotService from './chatbot.service';
import { v4 as uuidv4 } from 'uuid';

export interface ChatRequest {
    chatbotId: string;
    sessionId: string;
    message: string;
}

export interface ChatResponse {
    response: string;
    sessionId: string;
    error?: string;
}

export class ChatService {
    /**
     * Process chat message
     */
    async processMessage(request: ChatRequest): Promise<ChatResponse> {
        try {
            const { chatbotId, sessionId, message } = request;

            // Check if chatbot can respond
            const canRespond = await chatbotService.canRespond(chatbotId);
            if (!canRespond.allowed) {
                return {
                    response: canRespond.reason || 'Chat limit exceeded',
                    sessionId,
                    error: 'LIMIT_EXCEEDED',
                };
            }

            // Get chatbot details
            const chatbot = await chatbotService.getChatbot(chatbotId);
            if (!chatbot) {
                return {
                    response: 'Chatbot not found',
                    sessionId,
                    error: 'NOT_FOUND',
                };
            }

            // Get chat history for context
            const chatHistory = await this.getChatHistory(chatbotId, sessionId, 5);

            // Generate Response (Local Logic)
            const context = {
                businessName: chatbot.businessName,
                businessDescription: chatbot.businessDescription,
                contactEmail: chatbot.contactEmail,
                contactNumber: chatbot.contactNumber,
                businessAddress: chatbot.businessAddress,
                websiteUrl: chatbot.websiteUrl,
            };

            const aiResponse = await aiService.generateResponse(
                message,
                context,
                chatbotId,
                chatHistory
            );

            // Save chat to history
            await this.saveChatHistory(chatbotId, sessionId, message, aiResponse);

            // Increment chat count
            await chatbotService.incrementChatCount(chatbotId);

            return {
                response: aiResponse,
                sessionId,
            };
        } catch (error: any) {
            console.error('Error processing message:', error);
            return {
                response: 'Sorry, I am currently experiencing issues. Please try again later.',
                sessionId: request.sessionId,
                error: 'INTERNAL_ERROR',
            };
        }
    }

    /**
     * Get chat history for a session
     */
    private async getChatHistory(
        chatbotId: string,
        sessionId: string,
        limit: number = 10
    ): Promise<ChatMessage[]> {
        try {
            const result = await query(
                `SELECT user_message, bot_response 
                 FROM chat_history 
                 WHERE chatbot_id = $1 AND session_id = $2 
                 ORDER BY created_at DESC 
                 LIMIT $3`,
                [chatbotId, sessionId, limit]
            );

            const messages: ChatMessage[] = [];

            // Reverse to get chronological order
            result.rows.reverse().forEach((row: any) => {
                messages.push(
                    { role: 'user', content: row.user_message },
                    { role: 'assistant', content: row.bot_response }
                );
            });

            return messages;
        } catch (error) {
            console.error('Error getting chat history:', error);
            return [];
        }
    }

    /**
     * Save chat to history
     */
    private async saveChatHistory(
        chatbotId: string,
        sessionId: string,
        userMessage: string,
        botResponse: string
    ): Promise<void> {
        try {
            await query(
                `INSERT INTO chat_history (chatbot_id, session_id, user_message, bot_response)
                 VALUES ($1, $2, $3, $4)`,
                [chatbotId, sessionId, userMessage, botResponse]
            );
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    /**
     * Create new session
     */
    createSession(): string {
        return `session_${uuidv4()}`;
    }

    /**
     * Get chat history for a chatbot (admin view)
     */
    async getChatbotHistory(chatbotId: string, limit: number = 50): Promise<any[]> {
        try {
            const result = await query(
                `SELECT * FROM chat_history 
                 WHERE chatbot_id = $1 
                 ORDER BY created_at DESC 
                 LIMIT $2`,
                [chatbotId, limit]
            );

            return result.rows;
        } catch (error) {
            console.error('Error getting chatbot history:', error);
            return [];
        }
    }
}

export default new ChatService();
