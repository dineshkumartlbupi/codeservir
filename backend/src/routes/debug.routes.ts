import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

/**
 * Debug endpoint to verify knowledge base timestamps
 */
router.get('/knowledge-base/:chatbotId', async (req: Request, res: Response) => {
    try {
        const { chatbotId } = req.params;

        const result = await query(
            `SELECT 
                id, 
                content_type,
                LEFT(content, 100) as content_preview,
                source_url,
                created_at,
                updated_at
             FROM knowledge_base 
             WHERE chatbot_id = $1 
             ORDER BY created_at DESC 
             LIMIT 10`,
            [chatbotId]
        );

        res.json({
            success: true,
            chatbotId,
            recordCount: result.rows.length,
            records: result.rows.map(row => ({
                id: row.id,
                type: row.content_type,
                contentPreview: row.content_preview,
                sourceUrl: row.source_url,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                minutesAgo: Math.floor((Date.now() - new Date(row.created_at).getTime()) / 60000)
            }))
        });
    } catch (error: any) {
        console.error('Debug knowledge base error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
