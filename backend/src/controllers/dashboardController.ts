import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Document from '../models/Document';
import Conversation from '../models/Conversation';

export const getDashboardMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const totalDocuments = await Document.countDocuments({ owner: userId });
    const totalQuestions = await Conversation.countDocuments({ user: userId });
    const recentUploads = await Document.find({ owner: userId })
      .select('name mimeType uploadTimestamp')
      .sort({ uploadTimestamp: -1 })
      .limit(5);

    res.json({
      totalDocuments,
      totalQuestions,
      recentUploads,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
