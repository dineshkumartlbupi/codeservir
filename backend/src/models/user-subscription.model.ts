import { query } from '../config/database';

export interface UserSubscription {
    id: number;
    email: string;
    planType: string;
    status: string;
    startDate: Date;
    endDate: Date | null;
}

class UserSubscriptionModel {
    /**
     * Get active subscription by email
     */
    async findByEmail(email: string): Promise<UserSubscription | null> {
        const result = await query(
            `SELECT * FROM user_subscriptions 
             WHERE email = $1 AND status = 'active'
             ORDER BY created_at DESC LIMIT 1`,
            [email]
        );

        if (result.rows.length === 0) return null;
        return this.mapRowToSubscription(result.rows[0]);
    }

    /**
     * Create or update subscription
     */
    async upsert(email: string, planType: string): Promise<UserSubscription> {
        // Check if exists
        const existing = await this.findByEmail(email);

        if (existing) {
            const result = await query(
                `UPDATE user_subscriptions 
                 SET plan_type = $2, updated_at = CURRENT_TIMESTAMP
                 WHERE email = $1 
                 RETURNING *`,
                [email, planType]
            );
            return this.mapRowToSubscription(result.rows[0]);
        } else {
            const result = await query(
                `INSERT INTO user_subscriptions (email, plan_type, status)
                 VALUES ($1, $2, 'active')
                 RETURNING *`,
                [email, planType]
            );
            return this.mapRowToSubscription(result.rows[0]);
        }
    }

    private mapRowToSubscription(row: any): UserSubscription {
        return {
            id: row.id,
            email: row.email,
            planType: row.plan_type,
            status: row.status,
            startDate: row.start_date,
            endDate: row.end_date
        };
    }
}

export default new UserSubscriptionModel();
