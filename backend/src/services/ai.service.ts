import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatContext {
    businessName: string;
    businessDescription: string;
    contactEmail: string;
    contactNumber: string;
    businessAddress: string;
    websiteUrl: string;
}

export class AIService {

    constructor() {
        console.log('Local AI Service initialized (No external APIs)');
    }

    /**
     * Create knowledge base for a chatbot (Store plain text)
     */
    async createKnowledgeBase(
        chatbotId: string,
        contents: { text: string; type: string; sourceUrl?: string }[]
    ): Promise<void> {
        try {
            console.log(`📚 Creating local knowledge base for chatbot: ${chatbotId}`);

            for (const content of contents) {
                // Store directly in Postgres
                await query(
                    `INSERT INTO knowledge_base (chatbot_id, content, type, source_url, metadata)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        chatbotId,
                        content.text,
                        content.type,
                        content.sourceUrl || '',
                        { createdAt: new Date().toISOString() }
                    ]
                );
            }
            console.log(`Knowledge base created for chatbot: ${chatbotId}`);
        } catch (error) {
            console.error('Error creating knowledge base:', error);
            throw new Error('Failed to create knowledge base');
        }
    }

    /**
     * Query knowledge base using simple keyword matching
     */
    /**
     * Query knowledge base using simple keyword matching with synonym expansion
     */
    async queryKnowledgeBase(
        chatbotId: string,
        queryText: string,
        limit: number = 3
    ): Promise<{ content: string; type: string; score: number }[]> {
        try {
            // Simple keyword extraction
            const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'message', 'contact', 'what', 'where', 'when', 'how', 'who', 'why', 'are', 'you', 'can', 'help', 'me', 'with', 'about', 'this', 'that', 'for', 'from', 'a', 'an', 'in', 'to', 'of', 'do', 'does', 'have', 'i', 'get']);

            // Synonyms map for query expansion
            const synonyms: Record<string, string[]> = {
                'price': ['cost', 'rate', 'how much', 'expensive', 'cheap', 'quote', 'fee', 'charge'],
                'location': ['where', 'address', 'located', 'map', 'directions', 'place'],
                'services': ['offer', 'do', 'provide', 'service', 'rent', 'rental', 'buy', 'purchase'],
                'hours': ['open', 'close', 'time', 'schedule', 'when'],
                'contact': ['email', 'phone', 'call', 'reach', 'talk']
            };

            let keywords = queryText.toLowerCase()
                .replace(/[^\w\s]/g, '') // Remove punctuation
                .split(/\s+/)
                .filter(k => k.length > 2 && !stopWords.has(k));

            // Expand keywords with synonyms
            const expandedKeywords = new Set<string>(keywords);
            keywords.forEach(k => {
                for (const [key, variants] of Object.entries(synonyms)) {
                    if (key === k || variants.includes(k)) {
                        expandedKeywords.add(key);
                        variants.forEach(v => expandedKeywords.add(v));
                    }
                }
            });

            // Convert back to array
            const searchTerms = Array.from(expandedKeywords);

            if (searchTerms.length === 0) return [];

            // dynamic OR ILIKE clauses - use up to 20 terms to avoid massive queries
            const limitTerms = searchTerms.slice(0, 20);
            const clauses = limitTerms.map((_, i) => `content ILIKE $${i + 2}`).join(' OR ');
            const params = [chatbotId, ...limitTerms.map(k => `%${k}%`)];

            const result = await query(
                `SELECT content, type FROM knowledge_base 
                 WHERE chatbot_id = $1 AND (${clauses})
                 LIMIT ${limit + 10}`,
                params
            );

            // Scoring Algorithm
            const scoredResults = result.rows.map((row: any) => {
                const text = row.content.toLowerCase();
                let score = 0;

                // Original Keyword match (High Value)
                keywords.forEach(k => {
                    const regex = new RegExp(`\\b${k}\\b`, 'gi');
                    if (text.match(regex)) score += 10;
                    else if (text.includes(k)) score += 5;
                });

                // Expanded Synonym match (Medium Value)
                searchTerms.forEach(k => {
                    if (!keywords.includes(k) && text.includes(k)) {
                        score += 3;
                    }
                });

                // Boost for Manual QA (User Training)
                if (row.type === 'manual_qa') {
                    score += 20; // Very High priority for manual answers
                }

                // Boost for Contact Info
                if (row.type === 'contact') {
                    // Only boost if query implies contact
                    if (searchTerms.some(t => synonyms['contact'].includes(t) || t === 'contact')) {
                        score += 15;
                    }
                }

                // Penalize very long scraped content if it's a weak match
                if (row.type === 'scraped' && row.content.length > 500 && score < 10) {
                    score -= 5;
                }

                return { content: row.content, type: row.type, score };
            });

            // Return strong matches only
            return scoredResults
                .sort((a: any, b: any) => b.score - a.score)
                .filter(r => r.score > 5) // Minimum score threshold filter
                .slice(0, limit);

        } catch (error) {
            console.error('Error querying knowledge base:', error);
            return [];
        }
    }

    /**
     * Generate response using local knowledge base
     */
    async generateResponse(
        userMessage: string,
        context: ChatContext,
        chatbotId: string,
        chatHistory: ChatMessage[] = []
    ): Promise<string> {
        try {
            // 1. Check for greeting (Basic exact match)
            const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning'];
            if (greetings.includes(userMessage.toLowerCase().replace(/[^\w\s]/g, '').trim())) {
                return `Hello! How can I assist you with ${context.businessName} today?`;
            }

            // 2. Query knowledge base
            const results = await this.queryKnowledgeBase(chatbotId, userMessage);

            if (results.length > 0) {
                // If the top result is a very strong match (e.g. manual QA), just use that.
                const topResult = results[0];

                if (topResult.type === 'manual_qa') {
                    // Manual QA format is usually "Question\nAnswer". 
                    // We can try to strip the question if it's very similar, or just return the block.
                    // For now, let's return it as is but cleanly.
                    return topResult.content;
                }

                if (topResult.type === 'contact') {
                    return topResult.content;
                }

                // For scraped content, combine top 2 if they are decent
                const info = results
                    .slice(0, 2)
                    .map(r => r.content.trim())
                    .join('\n\n━━━━━━━━━━━━━━━━\n\n');

                return `Here is the information I found:\n\n${info}\n\nIs there anything else I can help you with?`;
            }

            // 3. Fallback to business context
            if (userMessage.toLowerCase().includes('contact') || userMessage.toLowerCase().includes('email') || userMessage.toLowerCase().includes('phone')) {
                return `You can contact us at ${context.contactEmail} or call us at ${context.contactNumber}. Our address is ${context.businessAddress}.`;
            }

            if (userMessage.toLowerCase().includes('address') || userMessage.toLowerCase().includes('location') || userMessage.toLowerCase().includes('where')) {
                return `We are located at ${context.businessAddress}.`;
            }

            if (userMessage.toLowerCase().includes('website') || userMessage.toLowerCase().includes('url')) {
                return `Visit our website at ${context.websiteUrl} for more information.`;
            }

            // 4. Smart Fallback for vague "more info" requests
            const vagueIntent = ['more', 'about', 'info', 'detail', 'describe', 'tell', 'what', 'it'];
            const userWords = userMessage.toLowerCase().split(/\s+/);
            if (vagueIntent.some(intent => userWords.includes(intent))) {
                return `Here is some information about ${context.businessName}:\n\n${context.businessDescription}\n\nYou can also contact us at ${context.contactEmail}.`;
            }

            // 5. Generic fallback
            return `I'm sorry, I couldn't find specific information about that in my database. Please contact us directly at ${context.contactEmail} for assistance.`;

        } catch (error) {
            console.error('Error generating response:', error);
            return "I apologize, but I'm having trouble accessing my information right now. Please try again later.";
        }
    }

    /**
     * Delete knowledge base for a chatbot
     */
    async deleteKnowledgeBase(chatbotId: string): Promise<void> {
        try {
            await query('DELETE FROM knowledge_base WHERE chatbot_id = $1', [chatbotId]);
            console.log(`✅ Deleted knowledge base for chatbot: ${chatbotId}`);
        } catch (error) {
            console.error('Error deleting knowledge base:', error);
            throw new Error('Failed to delete knowledge base');
        }
    }
}

export default new AIService();
