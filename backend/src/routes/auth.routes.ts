import { Router } from 'express';
import { signup, login, googleAuth, logout } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', authenticateToken, logout);

export default router;
