
import { query } from '../config/database';

async function initDb() {
    try {
        console.log('🔄 Initializing Database...');

        // Chatbots Table
        await query(`
            CREATE TABLE IF NOT EXISTS chatbots (
                id VARCHAR(255) PRIMARY KEY,
                owner_name VARCHAR(255),
                business_name VARCHAR(255) NOT NULL,
                website_url VARCHAR(255) NOT NULL,
                contact_number VARCHAR(50),
                contact_email VARCHAR(255) NOT NULL,
                business_address TEXT,
                business_description TEXT,
                primary_color VARCHAR(50) DEFAULT '#6366f1',
                secondary_color VARCHAR(50) DEFAULT '#8b5cf6',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'active'
            );
        `);
        console.log('✅ Chatbots table ready');

        // Create index on contact_email for fast lookup
        await query(`
            CREATE INDEX IF NOT EXISTS idx_chatbots_email ON chatbots(contact_email);
        `);

        // Chat Usage Table (for analytics)
        await query(`
            CREATE TABLE IF NOT EXISTS chat_usage (
                chatbot_id VARCHAR(255) REFERENCES chatbots(id) ON DELETE CASCADE,
                chat_count INTEGER DEFAULT 0,
                last_chat_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (chatbot_id)
            );
        `);
        console.log('✅ Chat Usage table ready');

        // Chatbot Subscriptions (Legacy/Per-Chatbot)
        await query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id SERIAL PRIMARY KEY,
                chatbot_id VARCHAR(255) REFERENCES chatbots(id) ON DELETE CASCADE,
                plan_type VARCHAR(50) DEFAULT 'free',
                chat_limit INTEGER DEFAULT 1000,
                price DECIMAL(10, 2) DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Chatbot Subscriptions table ready');

        // User Subscriptions (Email-based / Account Level)
        await query(`
            CREATE TABLE IF NOT EXISTS user_subscriptions (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                plan_type VARCHAR(50) DEFAULT 'free', -- 'free', 'premium'
                status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
                start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                end_date TIMESTAMP,
                stripe_customer_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ User Subscriptions table ready');

        console.log('🎉 Database initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

initDb();
