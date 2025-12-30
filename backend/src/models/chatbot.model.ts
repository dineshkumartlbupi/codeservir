import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface CreateChatbotDTO {
    ownerName: string;
    businessName: string;
    websiteUrl: string;
    contactNumber: string;
    contactEmail: string;
    businessAddress: string;
    businessDescription: string;
    primaryColor: string;
    secondaryColor: string;
}

export interface Chatbot {
    id: string;
    ownerName: string;
    businessName: string;
    websiteUrl: string;
    contactNumber: string;
    contactEmail: string;
    businessAddress: string;
    businessDescription: string;
    primaryColor: string;
    secondaryColor: string;
    createdAt: Date;
    status: string;
}

class ChatbotModel {
    /**
     * Create a new chatbot
     */
    async create(data: CreateChatbotDTO, chatbotId: string): Promise<Chatbot> {
        const result = await query(
            `INSERT INTO chatbots (
        id, owner_name, business_name, website_url, contact_number,
        contact_email, business_address, business_description,
        primary_color, secondary_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
            [
                chatbotId,
                data.ownerName,
                data.businessName,
                data.websiteUrl,
                data.contactNumber,
                data.contactEmail,
                data.businessAddress,
                data.businessDescription,
                data.primaryColor,
                data.secondaryColor,
            ]
        );

        const row = result.rows[0];
        return {
            id: row.id,
            ownerName: row.owner_name,
            businessName: row.business_name,
            websiteUrl: row.website_url,
            contactNumber: row.contact_number,
            contactEmail: row.contact_email,
            businessAddress: row.business_address,
            businessDescription: row.business_description,
            primaryColor: row.primary_color,
            secondaryColor: row.secondary_color,
            createdAt: row.created_at,
            status: row.status
        };
    }

    /**
     * Get chatbot by ID
     */
    async findById(id: string): Promise<Chatbot | null> {
        const result = await query(
            'SELECT * FROM chatbots WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) return null;
        const row = result.rows[0];
        return {
            id: row.id,
            ownerName: row.owner_name,
            businessName: row.business_name,
            websiteUrl: row.website_url,
            contactNumber: row.contact_number,
            contactEmail: row.contact_email,
            businessAddress: row.business_address,
            businessDescription: row.business_description,
            primaryColor: row.primary_color,
            secondaryColor: row.secondary_color,
            createdAt: row.created_at,
            status: row.status
        };
    }

    /**
     * Initialize chat usage
     */
    async initUsage(chatbotId: string): Promise<void> {
        await query(
            `INSERT INTO chat_usage (chatbot_id, chat_count) VALUES ($1, 0)`,
            [chatbotId]
        );
    }

    /**
     * Get chat usage
     */
    async getUsage(chatbotId: string): Promise<{ chat_count: number; last_chat_at: Date } | null> {
        const result = await query(
            'SELECT chat_count, last_chat_at FROM chat_usage WHERE chatbot_id = $1',
            [chatbotId]
        );
        return result.rows[0] || null;
    }

    /**
     * Increment chat usage
     */
    async incrementUsage(chatbotId: string): Promise<void> {
        await query(
            `UPDATE chat_usage 
             SET chat_count = chat_count + 1, last_chat_at = CURRENT_TIMESTAMP 
             WHERE chatbot_id = $1`,
            [chatbotId]
        );
    }

    /**
     * Initialize subscription
     */
    async initSubscription(chatbotId: string): Promise<void> {
        await query(
            `INSERT INTO subscriptions (chatbot_id, plan_type, chat_limit, price)
             VALUES ($1, 'free', 1000, 0)`,
            [chatbotId]
        );
    }

    /**
     * Get active subscription
     */
    async getSubscription(chatbotId: string): Promise<any> {
        const result = await query(
            `SELECT * FROM subscriptions 
             WHERE chatbot_id = $1 AND is_active = true 
             ORDER BY created_at DESC LIMIT 1`,
            [chatbotId]
        );
        return result.rows[0] || null;
    }
}

export default new ChatbotModel();
