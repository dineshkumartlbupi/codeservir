import express, { Application, Request, Response } from 'express';
// Force update for CORS fix
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import redisClient, { connectionError, connectRedis } from './config/redis';

// Import routes
import chatbotRoutes from './routes/chatbot.routes';
import chatRoutes from './routes/chat.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001; // Port 5000 is reserved on macOS (AirPlay)

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Manual Preflight Handler for robustness
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.sendStatus(200);
    } else {
        next();
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for widget)
const publicPath = path.join(process.cwd(), 'public');
app.use('/static', express.static(publicPath));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.get('/', (req, res) => res.send('CodeServir API is running'));

// Widget endpoint
app.get('/widget.js', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(publicPath, 'widget.js'));
});

// Embed endpoint (for WebView)
app.get('/embed/:chatbotId', (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'embed.html'));
});

// (Handlers moved to end of file)

// Minimal debug route
app.get('/api/ping', (req, res) => res.send('pong'));

// Debug Diagnosis Route
app.get('/api/debug/diagnose', async (req, res) => {
    const report: any = {
        timestamp: new Date().toISOString(),
        env: {
            vercel: !!process.env.VERCEL,
            has_db_url: !!process.env.DATABASE_URL,
            has_redis_url: !!process.env.REDIS_URL,
            has_kv_url: !!process.env.KV_URL,
            has_upstash_url: !!process.env.UPSTASH_REDIS_REST_URL,
            has_custom_redis: !!process.env.codeservir_redis_db_REDIS_URL,
            has_custom_kv: !!process.env.codeservir_redis_db_KV_URL,
            has_openai_key: !!process.env.OPENAI_API_KEY,
            has_pinecone_key: !!process.env.PINECONE_API_KEY,
            node_env: process.env.NODE_ENV
        }
    };

    // Check DB
    try {
        // We need to import query dynamically or duplicate logic here to check pool directly
        // Assuming pool is exported from database.ts or valid global
        const { query } = await import('./config/database');
        const dbResult = await query('SELECT NOW() as time');
        report.database = {
            status: 'connected',
            time: dbResult.rows[0].time
        };
    } catch (dbErr: any) {
        console.error('DB Diagnosis Error:', dbErr);
        report.database = {
            status: 'failed',
            error: dbErr.message
        };
    }

    // Check Redis
    try {
        const { default: redisClient, connectionError, connectRedis } = await import('./config/redis');

        // Try to connect if closed
        if (!redisClient.isOpen) {
            console.log('Debug: Force connecting to Redis...');
            await connectRedis();
        }

        report.redis = {
            isOpen: redisClient.isOpen,
            isReady: redisClient.isReady,
            connectionError: connectionError
        };
        if (redisClient.isOpen) {
            await redisClient.set('debug_key', 'ok');
            report.redis.test_write = 'ok';
        }
    } catch (redisErr: any) {
        console.error('Redis Diagnosis Error:', redisErr);
        report.redis = {
            status: 'failed',
            error: redisErr.message
        };
    }

    res.json(report);
});

// 404 handler (Must be last)
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler (Must be very last)
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize services and start server
const startServer = async () => {
    try {
        console.log('🚀 Starting codeservir Server...');

        // Connect to Redis
        await connectRedis();

        // Start server
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📡 API: http://localhost:${PORT}/api`);
            console.log(`🔧 Widget: http://localhost:${PORT}/widget.js`);
            console.log(`🌐 Health: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

if (process.env.VERCEL) {
    // In Vercel, we don't start the server, just initialize services
    // Avoid eager connection to Redis to prevent startup timeouts
    console.log('🚀 Running in Vercel environment');
    // connectRedis().catch(err => console.warn('Redis init warning (non-fatal):', err.message));
} else {
    // Local development
    startServer();
}

export default app;
