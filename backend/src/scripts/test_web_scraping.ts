
import chatbotService from '../services/chatbot.service';
import chatService from '../services/chat.service';
import pool from '../config/database';
import redisClient, { connectRedis } from '../config/redis';

async function main() {
    try {
        await connectRedis();
        console.log('🚀 Starting Advanced Web Scraping Bot Test...');

        // 1. Create a "Web" Chatbot
        // We use 'example.com' which has generic text. 
        // For a REAL test, we'd need a real site, but example.com is safe for automated tests.
        const chatbotData = {
            ownerName: 'Web Master',
            businessName: 'Example Domain Bot',
            websiteUrl: 'https://example.com',
            contactNumber: '555-WEB',
            contactEmail: 'web@example.com',
            businessAddress: '123 Internet Blvd',
            businessDescription: 'A bot for Example.com',
            primaryColor: '#000000',
            secondaryColor: '#ffffff'
        };

        console.log(`Creating chatbot for ${chatbotData.businessName}...`);
        const chatbot = await chatbotService.createChatbot(chatbotData);
        console.log(`✅ Chatbot Created! ID: ${chatbot.id}`);
        console.log(`✅ Chatbot Created! ID: ${chatbot.id}`);

        console.log('⏳ Waiting 5 seconds for Web Scraping to finish...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('✅ Knowledge base should now contain CHUNKED scraped content.');

        // 2. Test Retrieval from Scraped Content
        const sessionId = chatService.createSession();
        console.log(`\n💬 Testing Chat (Session: ${sessionId})...`);

        // precise phrases from example.com
        const scenarios = [
            { msg: 'What is this domain for?', intent: 'General Purpose (Scraped)' },
            { msg: 'Can I use this for permission?', intent: 'Permission (Scraped)' }
        ];

        for (const scenario of scenarios) {
            console.log(`\n👤 User: "${scenario.msg}" [Testing: ${scenario.intent}]`);
            const response = await chatService.processMessage({
                chatbotId: chatbot.id,
                sessionId,
                message: scenario.msg
            });
            console.log(`🤖 Bot: ${response.response}`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
        await redisClient.quit();
        process.exit(0);
    }
}

main();
