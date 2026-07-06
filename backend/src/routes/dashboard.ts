import express from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getDashboardMetrics);

export default router;
