import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface User {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    password_hash: string;
    created_at: Date;
}

export class UserModel {

    async create(email: string, passwordHash: string, fullName: string, phone?: string): Promise<User> {
        const id = uuidv4();

        const result = await query(
            `INSERT INTO users (id, email, password_hash, full_name, phone)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [id, email, passwordHash, fullName, phone || null]
        );
        return result.rows[0];
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }

    async findById(id: string): Promise<User | null> {
        const result = await query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }
}

export default new UserModel();
