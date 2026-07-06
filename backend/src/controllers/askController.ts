import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Document from '../models/Document';
import Conversation from '../models/Conversation';
import { askGemini } from '../utils/ai';

export const askQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ message: 'documentId and question are required' });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this document' });
    }

    // Call AI
    const aiResponse = await askGemini(document.content, question);

    // Save conversation
    const conversation = await Conversation.create({
      user: req.user._id,
      document: document._id,
      question,
      aiResponse,
    });

    res.json({
      _id: conversation._id,
      question: conversation.question,
      aiResponse: conversation.aiResponse,
      timestamp: conversation.timestamp,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { documentId } = req.query;
    
    let query: any = { user: req.user._id };
    if (documentId) {
      query.document = documentId;
    }

    const history = await Conversation.find(query)
      .populate('document', 'name originalName')
      .sort({ timestamp: -1 });

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
