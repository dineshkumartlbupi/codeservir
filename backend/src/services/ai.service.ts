import { OpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getPineconeIndex } from '../config/pinecone';
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
    private embeddings: OpenAIEmbeddings;
    private chatModel: ChatOpenAI;
    private pineconeIndex: any;

    constructor() {
        if (process.env.OPENAI_API_KEY) {
            this.embeddings = new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY,
                modelName: 'text-embedding-ada-002',
            });

            this.chatModel = new ChatOpenAI({
                openAIApiKey: process.env.OPENAI_API_KEY,
                modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
                temperature: 0.7,
                maxTokens: 500,
            });
        }

        // Defer pinecone index retrieval/check until needed or handle error
        try {
            this.pineconeIndex = getPineconeIndex();
        } catch (e) {
            console.warn('⚠️ AIService: Pinecone index not ready yet (normal during startup)');
        }
    }

    /**
     * Create embeddings for content and store in Pinecone
     */
    async createKnowledgeBase(
        chatbotId: string,
        contents: { text: string; type: string; sourceUrl?: string }[]
    ): Promise<void> {
        try {
            console.log(`📚 Creating knowledge base for chatbot: ${chatbotId}`);

            for (const content of contents) {
                // Split content into chunks if too large
                const chunks = this.splitIntoChunks(content.text, 1000);

                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    const vectorId = `${chatbotId}_${content.type}_${i}_${uuidv4()}`;

                    // Create embedding
                    const embedding = await this.embeddings.embedQuery(chunk);

                    // Store in Pinecone
                    await this.pineconeIndex.upsert([
                        {
                            id: vectorId,
                            values: embedding,
                            metadata: {
                                chatbotId,
                                text: chunk,
                                type: content.type,
                                sourceUrl: content.sourceUrl || '',
                                createdAt: new Date().toISOString(),
                            },
                        },
                    ]);
                }
            }

            console.log(`✅ Knowledge base created for chatbot: ${chatbotId}`);
        } catch (error) {
            console.error('Error creating knowledge base:', error);
            throw new Error('Failed to create knowledge base');
        }
    }

    /**
     * Query knowledge base for relevant context
     */
    async queryKnowledgeBase(
        chatbotId: string,
        query: string,
        topK: number = 5
    ): Promise<string[]> {
        try {
            // Create query embedding
            const queryEmbedding = await this.embeddings.embedQuery(query);

            // Search Pinecone
            const results = await this.pineconeIndex.query({
                vector: queryEmbedding,
                topK,
                filter: { chatbotId },
                includeMetadata: true,
            });

            // Extract relevant text from results
            const relevantTexts = results.matches
                .filter((match: any) => match.score > 0.7) // Only include high-confidence matches
                .map((match: any) => match.metadata.text);

            return relevantTexts;
        } catch (error) {
            console.error('Error querying knowledge base:', error);
            return [];
        }
    }

    /**
     * Generate chatbot response using RAG
     */
    async generateResponse(
        userMessage: string,
        context: ChatContext,
        chatbotId: string,
        chatHistory: ChatMessage[] = []
    ): Promise<string> {
        try {
            // Query knowledge base for relevant context
            const relevantContext = await this.queryKnowledgeBase(chatbotId, userMessage);

            // Create system prompt
            const systemPrompt = this.createSystemPrompt(context, relevantContext);

            // Create chat history context
            const historyContext = chatHistory
                .slice(-5) // Last 5 messages
                .map(msg => `${msg.role}: ${msg.content}`)
                .join('\n');

            // Create prompt template
            const promptTemplate = PromptTemplate.fromTemplate(`
{systemPrompt}

Previous conversation:
{history}

User question: {question}

Assistant response (be helpful, accurate, and friendly. Only use information from the knowledge base. If you don't know something, say so politely):
      `);

            const chain = promptTemplate.pipe(this.chatModel).pipe(new StringOutputParser());

            const response = await chain.invoke({
                systemPrompt,
                history: historyContext || 'No previous conversation',
                question: userMessage,
            });

            return response.trim();
        } catch (error) {
            console.error('Error generating response:', error);
            return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
        }
    }

    /**
     * Create system prompt with business context
     */
    private createSystemPrompt(context: ChatContext, relevantContext: string[]): string {
        const contextText = relevantContext.length > 0
            ? relevantContext.join('\n\n')
            : 'No specific context available.';

        return `You are an AI assistant for ${context.businessName}.

Business Information:
- Business Name: ${context.businessName}
- Description: ${context.businessDescription}
- Website: ${context.websiteUrl}
- Contact Email: ${context.contactEmail}
- Contact Number: ${context.contactNumber}
- Address: ${context.businessAddress}

Relevant Knowledge Base:
${contextText}

Instructions:
1. Answer questions ONLY based on the provided business information and knowledge base
2. Be friendly, professional, and helpful
3. If asked for contact information, provide the email, phone, or address above
4. If you don't know something, politely say you don't have that information
5. Never make up information or hallucinate facts
6. Keep responses concise and relevant
7. If appropriate, encourage users to contact the business directly`;
    }

    /**
     * Split text into chunks
     */
    private splitIntoChunks(text: string, chunkSize: number): string[] {
        const chunks: string[] = [];
        const words = text.split(' ');

        for (let i = 0; i < words.length; i += chunkSize) {
            const chunk = words.slice(i, i + chunkSize).join(' ');
            chunks.push(chunk);
        }

        return chunks;
    }

    /**
     * Delete knowledge base for a chatbot
     */
    async deleteKnowledgeBase(chatbotId: string): Promise<void> {
        try {
            // Delete all vectors for this chatbot
            await this.pineconeIndex.deleteMany({
                filter: { chatbotId },
            });
            console.log(`✅ Deleted knowledge base for chatbot: ${chatbotId}`);
        } catch (error) {
            console.error('Error deleting knowledge base:', error);
            throw new Error('Failed to delete knowledge base');
        }
    }
}

export default new AIService();
