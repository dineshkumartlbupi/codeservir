
import { cacheGet, cacheSet, cacheIncrement, cacheGetNumber } from '../config/redis';
import webScraperService from './scraper.service';
import aiService from './ai.service';
import { v4 as uuidv4 } from 'uuid';
import chatbotModel, { Chatbot, CreateChatbotDTO } from '../models/chatbot.model';

export class ChatbotService {
    /**
     * Create a new chatbot
     */
    async createChatbot(data: CreateChatbotDTO): Promise<Chatbot> {
        try {
            console.log(`🤖 Creating chatbot for: ${data.businessName}`);

            // Generate unique chatbot ID
            const chatbotId = `cb_${uuidv4().replace(/-/g, '').substring(0, 16)}`;

            // Create chatbot via Model
            const chatbot = await chatbotModel.create(data, chatbotId);

            // Initialize chat usage via Model
            await chatbotModel.initUsage(chatbotId);

            // Create free subscription via Model
            await chatbotModel.initSubscription(chatbotId);

            // Initialize cache
            try {
                await cacheSet(`chatbot:${chatbotId}:count`, '0');
            } catch (redisError) {
                console.warn('⚠️ Redis cache init failed (continuing):', redisError);
            }

            // Start knowledge base creation (async)
            this.buildKnowledgeBase(chatbot).catch(err => {
                console.error('Error building knowledge base:', err);
            });

            console.log(`✅ Chatbot created: ${chatbotId}`);
            return chatbot;
        } catch (error) {
            console.error('Error creating chatbot:', error);
            throw error;
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

                // Also add specific extracted sections if possible
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
            return await chatbotModel.findById(chatbotId);
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
                const usage = await chatbotModel.getUsage(chatbotId);
                chatCount = usage?.chat_count || 0;
                await cacheSet(cacheKey, chatCount.toString());
            }

            // Get subscription limit
            const subscription = await chatbotModel.getSubscription(chatbotId);
            const chatLimit = subscription?.chat_limit || 1000;

            // Ensure numeric comparison (Handle BIGINT strings from PG)
            const currentCount = Number(chatCount);
            const limit = Number(chatLimit);

            if (currentCount >= limit) {
                return {
                    allowed: false,
                    reason: `Your free chat limit is over (Count: ${chatCount}, Limit: ${chatLimit}). Please upgrade your plan to continue using the chatbot.`,
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
            chatbotModel.incrementUsage(chatbotId)
                .catch(err => console.error('Error updating chat count:', err));
        } catch (error) {
            console.error('Error incrementing chat count:', error);
        }
    }

    /**
     * Get chat statistics
     */
    async getChatStats(chatbotId: string): Promise<any> {
        try {
            const usage = await chatbotModel.getUsage(chatbotId);
            const subscription = await chatbotModel.getSubscription(chatbotId);

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
