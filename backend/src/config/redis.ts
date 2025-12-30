import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

dotenv.config();

const redisUrl = process.env.REDIS_URL || process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL;
if (redisUrl) {
    console.log('🔌 Redis Config: Using REDIS_URL (starts with ' + redisUrl.substring(0, 15) + '...)');
} else {
    console.log('🔌 Redis Config: Using Host/Port', process.env.REDIS_HOST, process.env.REDIS_PORT);
}

const redisClient = createClient(
    redisUrl
        ? {
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 5) {
                        console.error('❌ Redis: Max retries exceeded');
                        return new Error('Max retries exceeded');
                    }
                    console.log(`Redis reconnecting attempt ${retries}...`);
                    return Math.min(retries * 100, 3000);
                }
            }
        }
        : {
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
            password: process.env.REDIS_PASSWORD || undefined,
        }
);

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('✅ Connected to Redis (Connection established)');
});

redisClient.on('ready', () => {
    console.log('✅ Redis client ready');
});

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        // Don't throw in Vercel environment to prevent crash, just log
        if (!process.env.VERCEL) {
            throw error;
        }
    }
};

// Cache helper functions
export const cacheGet = async (key: string): Promise<string | null> => {
    try {
        const result = await redisClient.get(key);
        return result as string | null;
    } catch (error) {
        console.error('Redis GET error:', error);
        return null;
    }
};

export const cacheSet = async (
    key: string,
    value: string,
    expirationSeconds?: number
): Promise<void> => {
    try {
        if (expirationSeconds) {
            await redisClient.setEx(key, expirationSeconds, value);
        } else {
            await redisClient.set(key, value);
        }
    } catch (error) {
        console.error('Redis SET error:', error);
    }
};

export const cacheDelete = async (key: string): Promise<void> => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Redis DELETE error:', error);
    }
};

export const cacheIncrement = async (key: string): Promise<number> => {
    try {
        const result = await redisClient.incr(key);
        return result as number;
    } catch (error) {
        console.error('Redis INCREMENT error:', error);
        return 0;
    }
};

export const cacheGetNumber = async (key: string): Promise<number> => {
    try {
        const value = await redisClient.get(key);
        return value ? parseInt(value as string, 10) : 0;
    } catch (error) {
        console.error('Redis GET NUMBER error:', error);
        return 0;
    }
};

export default redisClient;
