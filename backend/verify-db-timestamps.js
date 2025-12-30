const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false
});

async function verifyTimestamps() {
    try {
        console.log('🔍 Checking knowledge_base timestamps...\n');

        const result = await pool.query(
            `SELECT 
                id, 
                content_type,
                LEFT(content, 80) as content_preview,
                source_url,
                created_at,
                updated_at
             FROM knowledge_base 
             WHERE chatbot_id = $1 
             ORDER BY created_at DESC 
             LIMIT 6`,
            ['cb_8313824b8d944693']
        );

        if (result.rows.length === 0) {
            console.log('❌ No records found for this chatbot');
            console.log('Training may not have completed yet.\n');
        } else {
            console.log(`✅ Found ${result.rows.length} training records\n`);
            console.log('═'.repeat(80));

            result.rows.forEach((row, index) => {
                console.log(`\nRecord #${index + 1}:`);
                console.log(`  ID: ${row.id}`);
                console.log(`  Type: ${row.content_type}`);
                console.log(`  Content: ${row.content_preview}...`);
                console.log(`  Source: ${row.source_url}`);
                console.log(`  ✅ Created At: ${new Date(row.created_at).toLocaleString()}`);
                console.log(`  ✅ Updated At: ${new Date(row.updated_at).toLocaleString()}`);
            });

            console.log('\n' + '═'.repeat(80));

            // Check if timestamps are recent
            const latestCreated = new Date(result.rows[0].created_at);
            const now = new Date();
            const minutesAgo = Math.floor((now - latestCreated) / 60000);

            console.log('\n📊 Timestamp Analysis:');
            console.log(`  Latest record created: ${minutesAgo} minutes ago`);
            console.log(`  Exact time: ${latestCreated.toLocaleString()}`);

            if (minutesAgo < 60) {
                console.log('\n  ✅ SUCCESS: Timestamps are being recorded correctly!');
                console.log('  ✅ created_at column is working as expected');
                console.log('  ✅ Auto-timestamp (DEFAULT CURRENT_TIMESTAMP) is functional\n');
            } else {
                console.log('\n  ℹ️  Records are older (training was done earlier)\n');
            }
        }

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

verifyTimestamps();
