import { Router } from 'express';
import chatbotController from '../controllers/chatbot.controller';

const router = Router();

// Check limit
router.post('/check-limit', (req, res) => chatbotController.checkLimit(req, res));

// Get chatbots by email
router.post('/by-email', (req, res) => chatbotController.listByEmail(req, res));

// List chatbots (Auth required)
router.get('/', (req, res) => chatbotController.listChatbots(req, res));

// Create chatbot
router.post('/create', (req, res) => chatbotController.createChatbot(req, res));

// Get chatbot details
router.get('/:chatbotId', (req, res) => chatbotController.getChatbot(req, res));

// Update chatbot
router.put('/:chatbotId', (req, res) => chatbotController.updateChatbot(req, res));

// Delete chatbot
router.delete('/:chatbotId', (req, res) => chatbotController.deleteChatbot(req, res));

// Get chatbot configuration (for widget)
router.get('/:chatbotId/config', (req, res) => chatbotController.getChatbotConfig(req, res));

// Get chat statistics
router.get('/:chatbotId/stats', (req, res) => chatbotController.getChatStats(req, res));

// Train Chatbot
router.post('/:chatbotId/train', (req, res) => chatbotController.trainChatbot(req, res));

export default router;
