import { Router } from 'express';
import chatbotController from '../controllers/chatbot.controller';

const router = Router();

// Create chatbot
router.post('/create', (req, res) => chatbotController.createChatbot(req, res));

// Get chatbot details
router.get('/:chatbotId', (req, res) => chatbotController.getChatbot(req, res));

// Get chatbot configuration (for widget)
router.get('/:chatbotId/config', (req, res) => chatbotController.getChatbotConfig(req, res));

// Get chat statistics
router.get('/:chatbotId/stats', (req, res) => chatbotController.getChatStats(req, res));

// Train Chatbot
router.post('/:chatbotId/train', (req, res) => chatbotController.trainChatbot(req, res));

export default router;
