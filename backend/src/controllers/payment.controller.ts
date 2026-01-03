import { Request, Response } from 'express';
import paymentService, { PAYMENT_PLANS } from '../services/payment.service';

export class PaymentController {
    /**
     * Get available plans
     */
    async getPlans(req: Request, res: Response): Promise<void> {
        try {
            res.json({
                success: true,
                plans: PAYMENT_PLANS,
            });
        } catch (error) {
            console.error('Get plans error:', error);
            res.status(500).json({ error: 'Failed to get plans' });
        }
    }

    /**
     * Create payment order
     */
    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId, planType } = req.body;

            if (!chatbotId || !planType) {
                res.status(400).json({
                    error: 'Missing required fields',
                    required: ['chatbotId', 'planType'],
                });
                return;
            }

            if (!PAYMENT_PLANS[planType]) {
                res.status(400).json({ error: 'Invalid plan type' });
                return;
            }

            const order = await paymentService.createOrder(chatbotId, planType);

            res.json({
                success: true,
                order,
            });
        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({
                error: 'Failed to create payment order',
                details: error.message || 'Unknown error'
            });
        }
    }

    /**
     * Verify payment
     */
    async verifyPayment(req: Request, res: Response): Promise<void> {
        try {
            const {
                chatbotId,
                planType,
                orderId,
                paymentId,
                signature,
                amount,
            } = req.body;

            if (!chatbotId || !planType || !orderId || !paymentId || !signature) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            // Verify signature
            const isValid = await paymentService.verifyPayment(
                orderId,
                paymentId,
                signature
            );

            if (!isValid) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid payment signature',
                });
                return;
            }

            // Get user email
            const user = (req as any).user;
            if (!user || !user.email) {
                res.status(401).json({ error: 'Unauthorized: User email not found' });
                return;
            }

            // Process payment (User-Level Subscription)
            await paymentService.processPayment(
                chatbotId,
                planType,
                paymentId,
                orderId,
                amount,
                user.email
            );

            res.json({
                success: true,
                message: 'Payment verified and subscription activated',
            });
        } catch (error) {
            console.error('Verify payment error:', error);
            res.status(500).json({ error: 'Failed to verify payment' });
        }
    }

    /**
     * Get subscription details
     */
    async getSubscription(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;

            const subscription = await paymentService.getSubscription(chatbotId);

            if (!subscription) {
                res.status(404).json({ error: 'No active subscription found' });
                return;
            }

            res.json({
                success: true,
                subscription,
            });
        } catch (error) {
            console.error('Get subscription error:', error);
            res.status(500).json({ error: 'Failed to get subscription' });
        }
    }

    /**
     * Get payment history
     */
    async getPaymentHistory(req: Request, res: Response): Promise<void> {
        try {
            const { chatbotId } = req.params;

            const history = await paymentService.getPaymentHistory(chatbotId);

            res.json({
                success: true,
                history,
            });
        } catch (error) {
            console.error('Get payment history error:', error);
            res.status(500).json({ error: 'Failed to get payment history' });
        }
    }
}

export default new PaymentController();
