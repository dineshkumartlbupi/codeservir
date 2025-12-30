import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function initDb() {
    try {
        console.log('Connecting to database...');

        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        console.log(`Reading schema from: ${schemaPath}`);

        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        console.log('Executing schema...');
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(schema);
            await client.query('COMMIT');
            console.log('Database initialized successfully!');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Failed to initialize database:', error);
    } finally {
        await pool.end();
    }
}

initDb();
