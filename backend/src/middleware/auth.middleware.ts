import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
    user?: any;
    token?: string;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        // Check if token is blacklisted
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            res.status(403).json({ message: 'Token is invalid (logged out).' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
};
