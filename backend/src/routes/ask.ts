import express from 'express';
import { askQuestion, getHistory } from '../controllers/askController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, askQuestion);
router.get('/history', protect, getHistory);

export default router;
