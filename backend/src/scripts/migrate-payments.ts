
import { query } from '../config/database';

async function migrate() {
    try {
        console.log('🔄 Migrating Payment Schema...');

        // Alter subscriptions table
        await query(`
            ALTER TABLE subscriptions 
            ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
            ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50),
            ADD COLUMN IF NOT EXISTS started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log('✅ Subscriptions table updated');

        // Payment Transactions Table
        await query(`
            CREATE TABLE IF NOT EXISTS payment_transactions (
                id SERIAL PRIMARY KEY,
                chatbot_id VARCHAR(255) REFERENCES chatbots(id) ON DELETE CASCADE,
                subscription_id INTEGER REFERENCES subscriptions(id),
                payment_gateway VARCHAR(50),
                transaction_id VARCHAR(255),
                amount DECIMAL(10, 2),
                currency VARCHAR(10),
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Payment Transactions table ready');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
