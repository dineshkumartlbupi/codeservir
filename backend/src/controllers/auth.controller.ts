import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model';
import { OAuth2Client } from 'google-auth-library';
import redisClient from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, phone } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if user exists
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await userModel.create(email, hashedPassword, fullName, phone);

        // Create token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name
            }
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login success',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name
            }
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            // Blacklist token for 7 days (604800 seconds)
            await redisClient.set(`blacklist:${token}`, 'true', { EX: 604800 });
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { idToken, user } = req.body;

        // Use payload directly for MVP
        let email = user?.email;
        let fullName = user?.displayName;

        if (!email) {
            return res.status(400).json({ message: 'Invalid Google Token or User Data' });
        }

        // Check if user exists
        let dbUser = await userModel.findByEmail(email);

        if (!dbUser) {
            // Create user
            const randomPassword = Math.random().toString(36).slice(-10);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            dbUser = await userModel.create(email, hashedPassword, fullName || 'Google User');
        }

        // Create token
        const token = jwt.sign({ id: dbUser.id, email: dbUser.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Google login success',
            token,
            user: {
                id: dbUser.id,
                email: dbUser.email,
                fullName: dbUser.full_name
            }
        });
    } catch (error: any) {
        console.error('Google Auth error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
