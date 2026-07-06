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
exports.getDashboardMetrics = void 0;
const Document_1 = __importDefault(require("../models/Document"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const getDashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const totalDocuments = yield Document_1.default.countDocuments({ owner: userId });
        const totalQuestions = yield Conversation_1.default.countDocuments({ user: userId });
        const recentUploads = yield Document_1.default.find({ owner: userId })
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
});
exports.getDashboardMetrics = getDashboardMetrics;
