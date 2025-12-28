import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectRedis } from './config/redis';
import { initializePinecone } from './config/pinecone';

// Import routes
import chatbotRoutes from './routes/chatbot.routes';
import chatRoutes from './routes/chat.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for widget)
const publicPath = path.join(process.cwd(), 'public');
app.use('/static', express.static(publicPath));

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);

// Widget endpoint
app.get('/widget.js', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(publicPath, 'widget.js'));
});

// Embed endpoint (for WebView)
app.get('/embed/:chatbotId', (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'embed.html'));
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
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

        // Initialize Pinecone
        await initializePinecone();

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
    // We catch errors but DO NOT exit, so the server/health check can still run
    console.log('🚀 Running in Vercel environment');
    connectRedis().catch(err => console.warn('⚠️ Redis init warning (non-fatal):', err.message));
    initializePinecone().catch(err => console.warn('⚠️ Pinecone init warning (non-fatal):', err.message));
} else {
    // Local development
    startServer();
}

export default app;
