import express, { Application, Request, Response } from 'express';
// Force update for CORS fix
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectRedis } from './config/redis';

// Import routes
import chatbotRoutes from './routes/chatbot.routes';
import chatRoutes from './routes/chat.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS Configuration
const allowedOrigins = [
    'https://codeservir-app.vercel.app', // Correct Frontend URL
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        console.log('Incoming Origin:', origin); // DEBUG logging

        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            // For development/testing, you might want to allow all, but for production be strict
            // temporarily allow all to debug
            console.log('Allowed blocked origin for debug:', origin);
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle preflight requests explicitly
app.options('*', cors());


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
} else {
    // Local development
    startServer();
}

export default app;
