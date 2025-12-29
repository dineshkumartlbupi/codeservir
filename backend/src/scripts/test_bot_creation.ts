
import chatbotService from '../services/chatbot.service';
import chatService from '../services/chat.service';
import pool from '../config/database';
import redisClient, { connectRedis } from '../config/redis';

async function main() {
    try {
        await connectRedis();
        console.log('🚀 Starting Advanced Bot Test...');

        // 1. Create a "Boat" Chatbot
        const chatbotData = {
            ownerName: 'Captain Dave',
            businessName: 'Dave\'s Boat Rentals',
            websiteUrl: 'https://example.com',
            contactNumber: '555-0199',
            contactEmail: 'dave@boats.com',
            businessAddress: '777 Marina Way, Ocean City',
            businessDescription: 'We provide premium boat rentals. Open 7 days a week from 8 AM to 6 PM.',
            primaryColor: '#0077be',
            secondaryColor: '#ffffff'
        };

        console.log(`Creating chatbot for ${chatbotData.businessName}...`);
        const chatbot = await chatbotService.createChatbot(chatbotData);
        console.log(`✅ Chatbot Created! ID: ${chatbot.id}`);

        // 2. Train the bot with Advanced Data (Pricing, Specifics)
        console.log('\n🎓 Training bot with advanced data...');
        await chatbotService.trainChatbot(chatbot.id, [
            {
                question: 'How much does it cost to rent a pontoon boat?',
                answer: 'Pontoon boats are $300 for a half-day and $500 for a full day. Fuel is included.'
            },
            {
                question: 'Do I need a boating license?',
                answer: 'No, you do not need a boating license for our rental boats. We provide a brief safety training session before departure.'
            },
            {
                question: 'Can we bring alcohol on board?',
                answer: 'Yes, alcohol is permitted for passengers only. The driver must remain sober at all times.'
            },
            {
                question: 'What are your opening hours?',
                answer: 'We are open every day of the week from 8:00 AM to 6:00 PM.'
            }
        ]);

        console.log('⏳ Waiting 1 second for indexing...');
        await new Promise(r => setTimeout(r, 1000));

        // 3. Test Advanced Queries using Synonyms
        const sessionId = chatService.createSession();
        console.log(`\n💬 Testing Advanced Queries (Session: ${sessionId})...`);

        const scenarios = [
            { msg: 'What are your rates for pontoons?', intent: 'Pricing (Synonym -> cost)' },
            { msg: 'Do I need a license?', intent: 'Regulation' },
            { msg: 'Can we drink beer?', intent: 'Policy (Synonym -> alcohol)' },
            { msg: 'When do you close?', intent: 'Hours (Synonym -> time)' }
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
