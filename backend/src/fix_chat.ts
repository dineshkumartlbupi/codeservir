
import { query } from './config/database';

const CHATBOT_ID = 'cb_9af0f5be94044cab';

async function checkAndFix() {
    try {
        console.log(`Checking for chatbot ${CHATBOT_ID}...`);
        const res = await query('SELECT * FROM chatbots WHERE id = $1', [CHATBOT_ID]);

        if (res.rows.length === 0) {
            console.log('Chatbot not found locally. Creating it...');
            await query(`
                INSERT INTO chatbots (id, owner_name, business_name, website_url, contact_email, status)
                VALUES ($1, 'Test Owner', 'Test Business', 'https://example.com', 'test@example.com', 'active')
            `, [CHATBOT_ID]);
            console.log('Chatbot created.');
        } else {
            console.log('Chatbot exists.');
        }

        console.log('Checking chat history...');
        const hist = await query('SELECT count(*) FROM chat_history WHERE chatbot_id = $1', [CHATBOT_ID]);
        const count = parseInt(hist.rows[0].count);
        console.log(`Found ${count} messages.`);

        if (count === 0) {
            console.log('Injecting test conversation...');
            const sessionId = `session_${Date.now()}`;
            await query(`
                INSERT INTO chat_history (chatbot_id, session_id, user_message, bot_response)
                VALUES 
                ($1, $2, 'Hello, is this working?', 'Yes! I am fully operational.'),
                ($1, $2, 'What can you do?', 'I can answer questions about your business.')
            `, [CHATBOT_ID, sessionId]);
            console.log('Test conversation injected.');
        }

    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}

checkAndFix();
