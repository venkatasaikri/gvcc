"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const Document_1 = __importDefault(require("../models/Document"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const getDashboardMetrics = async (req, res) => {
    try {
        const userId = req.user._id;
        const totalDocuments = await Document_1.default.countDocuments({ owner: userId });
        const totalQuestions = await Conversation_1.default.countDocuments({ user: userId });
        const recentUploads = await Document_1.default.find({ owner: userId })
            .select('name mimeType uploadTimestamp')
            .sort({ uploadTimestamp: -1 })
            .limit(5);
        res.json({
            totalDocuments,
            totalQuestions,
            recentUploads,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDashboardMetrics = getDashboardMetrics;
//# sourceMappingURL=dashboardController.js.map