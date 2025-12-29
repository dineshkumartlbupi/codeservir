
import { query } from '../config/database';
import { cacheGet, cacheSet, cacheIncrement, cacheGetNumber } from '../config/redis';
import webScraperService from './scraper.service';
import aiService from './ai.service';
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

export class ChatbotService {
    /**
     * Create a new chatbot
     */
    async createChatbot(data: CreateChatbotDTO): Promise<Chatbot> {
        try {
            console.log(`🤖 Creating chatbot for: ${data.businessName}`);

            // Generate unique chatbot ID
            const chatbotId = `cb_${uuidv4().replace(/-/g, '').substring(0, 16)}`;

            // Insert chatbot into database
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
            const chatbot: Chatbot = {
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

            // Initialize chat usage
            await query(
                `INSERT INTO chat_usage (chatbot_id, chat_count) VALUES ($1, 0)`,
                [chatbotId]
            );

            // Create free subscription
            await query(
                `INSERT INTO subscriptions (chatbot_id, plan_type, chat_limit, price)
         VALUES ($1, 'free', 1000, 0)`,
                [chatbotId]
            );

            // Initialize cache
            await cacheSet(`chatbot:${chatbotId}:count`, '0');

            // Start knowledge base creation (async)
            this.buildKnowledgeBase(chatbot).catch(err => {
                console.error('Error building knowledge base:', err);
            });

            console.log(`✅ Chatbot created: ${chatbotId}`);
            return chatbot;
        } catch (error) {
            console.error('Error creating chatbot:', error);
            throw new Error('Failed to create chatbot');
        }
    }

    /**
     * Build knowledge base for chatbot
     */
    private async buildKnowledgeBase(chatbot: Chatbot): Promise<void> {
        try {
            console.log(`📚 Building knowledge base for: ${chatbot.id}`);

            // Scrape website
            const scrapedPages = await webScraperService.scrapeWebsite(chatbot.websiteUrl);

            const knowledgeContents: { text: string; type: string; sourceUrl?: string }[] = [];

            // Add scraped content (Chunked for granular retrieval)
            for (const page of scrapedPages) {
                // Chunk the content by paragraphs or double newlines
                const chunks = page.content.split(/\n\s*\n/);

                for (const chunk of chunks) {
                    const cleanChunk = chunk.trim();
                    // Skip if too short or just navigation/links noise (often short)
                    if (cleanChunk.length < 50) continue;

                    knowledgeContents.push({
                        text: cleanChunk,
                        type: 'scraped',
                        sourceUrl: page.url,
                    });
                }

                // Also add specific extracted sections if possible (scraper returns extractingSections but we need to call it)
                // Integrating extractSections logic from ScraperService
                const sections = webScraperService.extractSections(page.content);
                Object.entries(sections).forEach(([section, content]) => {
                    if (content.length > 50) {
                        knowledgeContents.push({
                            text: `${section.toUpperCase()} SECTION:\n${content}`,
                            type: 'scraped_section',
                            sourceUrl: page.url
                        });
                    }
                });

                // Add Page Heading/Title as a separate high-value entry
                knowledgeContents.push({
                    text: `Page Title: ${page.title}\nURL: ${page.url}`,
                    type: 'scraped_meta',
                    sourceUrl: page.url,
                });
            }

            // Add business description
            knowledgeContents.push({
                text: `Business Description: ${chatbot.businessDescription}`,
                type: 'description',
            });

            // Add contact information
            const contactInfo = `
        Contact Information:
        Business Name: ${chatbot.businessName}
        Email: ${chatbot.contactEmail}
        Phone: ${chatbot.contactNumber}
        Address: ${chatbot.businessAddress}
        Website: ${chatbot.websiteUrl}
      `;

            knowledgeContents.push({
                text: contactInfo,
                type: 'contact',
            });

            // Store in Knowledge Base (Local DB now)
            await aiService.createKnowledgeBase(chatbot.id, knowledgeContents);

            console.log(`✅ Knowledge base built for: ${chatbot.id}`);
        } catch (error) {
            console.error('Error building knowledge base:', error);
            throw error;
        }
    }

    /**
     * Get chatbot by ID
     */
    async getChatbot(chatbotId: string): Promise<Chatbot | null> {
        try {
            const result = await query(
                'SELECT * FROM chatbots WHERE id = $1',
                [chatbotId]
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
        } catch (error) {
            console.error('Error getting chatbot:', error);
            return null;
        }
    }

    /**
     * Get chatbot configuration for embed widget
     */
    async getChatbotConfig(chatbotId: string): Promise<any> {
        try {
            const chatbot = await this.getChatbot(chatbotId);
            if (!chatbot) return null;

            return {
                id: chatbot.id,
                businessName: chatbot.businessName,
                primaryColor: chatbot.primaryColor,
                secondaryColor: chatbot.secondaryColor,
                greeting: `Hi! I'm the AI assistant for ${chatbot.businessName}. How can I help you today?`,
            };
        } catch (error) {
            console.error('Error getting chatbot config:', error);
            return null;
        }
    }

    /**
     * Check if chatbot can respond (within chat limit)
     */
    async canRespond(chatbotId: string): Promise<{ allowed: boolean; reason?: string }> {
        try {
            // Get current chat count from cache
            const cacheKey = `chatbot:${chatbotId}:count`;
            let chatCount = await cacheGetNumber(cacheKey);

            // If not in cache, get from database
            if (chatCount === 0) {
                const result = await query(
                    'SELECT chat_count FROM chat_usage WHERE chatbot_id = $1',
                    [chatbotId]
                );
                chatCount = result.rows[0]?.chat_count || 0;
                await cacheSet(cacheKey, chatCount.toString());
            }

            // Get subscription limit
            const subResult = await query(
                `SELECT chat_limit FROM subscriptions 
                 WHERE chatbot_id = $1 AND is_active = true 
                 ORDER BY created_at DESC LIMIT 1`,
                [chatbotId]
            );

            const chatLimit = subResult.rows[0]?.chat_limit || 1000;

            if (chatCount >= chatLimit) {
                return {
                    allowed: false,
                    reason: 'Your free chat limit is over. Please upgrade your plan to continue using the chatbot.',
                };
            }

            return { allowed: true };
        } catch (error) {
            console.error('Error checking chat limit:', error);
            return { allowed: true }; // Fail open
        }
    }

    /**
     * Increment chat count
     */
    async incrementChatCount(chatbotId: string): Promise<void> {
        try {
            const cacheKey = `chatbot:${chatbotId}:count`;

            // Increment in cache
            await cacheIncrement(cacheKey);

            // Increment in database (async)
            query(
                `UPDATE chat_usage 
                 SET chat_count = chat_count + 1, last_chat_at = CURRENT_TIMESTAMP 
                 WHERE chatbot_id = $1`,
                [chatbotId]
            ).catch(err => console.error('Error updating chat count:', err));
        } catch (error) {
            console.error('Error incrementing chat count:', error);
        }
    }

    /**
     * Get chat statistics
     */
    async getChatStats(chatbotId: string): Promise<any> {
        try {
            const usageResult = await query(
                'SELECT * FROM chat_usage WHERE chatbot_id = $1',
                [chatbotId]
            );

            const subResult = await query(
                `SELECT * FROM subscriptions 
                 WHERE chatbot_id = $1 AND is_active = true 
                 ORDER BY created_at DESC LIMIT 1`,
                [chatbotId]
            );

            const usage = usageResult.rows[0];
            const subscription = subResult.rows[0];

            return {
                chatCount: usage?.chat_count || 0,
                chatLimit: subscription?.chat_limit || 1000,
                planType: subscription?.plan_type || 'free',
                lastChatAt: usage?.last_chat_at,
            };
        } catch (error) {
            console.error('Error getting chat stats:', error);
            return null;
        }
    }

    /**
     * Train chatbot with manual input
     */
    async trainChatbot(chatbotId: string, trainingData: { question: string; answer: string }[]): Promise<void> {
        try {
            console.log(`🎓 Training chatbot ${chatbotId} with ${trainingData.length} items...`);

            const contents = trainingData.map(item => ({
                text: `${item.question}\n${item.answer}`, // Store as simple QA pair for keyword search
                type: 'manual_qa',
                sourceUrl: 'manual_input'
            }));

            await aiService.createKnowledgeBase(chatbotId, contents);
            console.log(`✅ Training complete for chatbot: ${chatbotId}`);
        } catch (error) {
            console.error('Error training chatbot:', error);
            throw new Error('Failed to train chatbot');
        }
    }
}

export default new ChatbotService();
