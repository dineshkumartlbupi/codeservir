import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';

const router = Router();

// Get dashboard stats
router.get('/stats', (req, res) => dashboardController.getStats(req, res));

export default router;
