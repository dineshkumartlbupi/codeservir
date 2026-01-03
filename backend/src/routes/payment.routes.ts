import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Get available plans
router.get('/plans', (req, res) => paymentController.getPlans(req, res));

// Create payment order
router.post('/create-order', authenticateToken, (req, res) => paymentController.createOrder(req, res));

// Verify payment
router.post('/verify', authenticateToken, (req, res) => paymentController.verifyPayment(req, res));

// Get subscription details
router.get('/subscription/:chatbotId', authenticateToken, (req, res) => paymentController.getSubscription(req, res));

// Get payment history
router.get('/history/:chatbotId', authenticateToken, (req, res) => paymentController.getPaymentHistory(req, res));

export default router;
