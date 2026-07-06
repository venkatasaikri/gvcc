"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.askQuestion = void 0;
const Document_1 = __importDefault(require("../models/Document"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const ai_1 = require("../utils/ai");
const askQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentId, question } = req.body;
        if (!documentId || !question) {
            return res.status(400).json({ message: 'documentId and question are required' });
        }
        const document = yield Document_1.default.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to access this document' });
        }
        // Call AI
        const aiResponse = yield (0, ai_1.askGemini)(document.content, question);
        // Save conversation
        const conversation = yield Conversation_1.default.create({
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
});
exports.askQuestion = askQuestion;
const getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentId } = req.query;
        let query = { user: req.user._id };
        if (documentId) {
            query.document = documentId;
        }
        const history = yield Conversation_1.default.find(query)
            .populate('document', 'name originalName')
            .sort({ timestamp: -1 });
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getHistory = getHistory;
