"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.askQuestion = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const Document_1 = __importDefault(require("../models/Document"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const ai_1 = require("../utils/ai");
const askQuestion = async (req, res) => {
    try {
        const { documentId, question } = req.body;
        if (!documentId || !question) {
            return res.status(400).json({ message: 'documentId and question are required' });
        }
        const document = await Document_1.default.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to access this document' });
        }
        // Call AI
        const aiResponse = await (0, ai_1.askGemini)(document.content, question);
        // Save conversation
        const conversation = await Conversation_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.askQuestion = askQuestion;
const getHistory = async (req, res) => {
    try {
        const { documentId } = req.query;
        let query = { user: req.user._id };
        if (documentId) {
            query.document = documentId;
        }
        const history = await Conversation_1.default.find(query)
            .populate('document', 'name originalName')
            .sort({ timestamp: -1 });
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getHistory = getHistory;
//# sourceMappingURL=askController.js.map