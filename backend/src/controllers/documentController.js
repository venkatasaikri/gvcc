"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.getDocuments = exports.uploadDocument = void 0;
const express_1 = require("express");
const Document_1 = __importDefault(require("../models/Document"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const fileParser_1 = require("../utils/fileParser");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { originalname, mimetype, path: filePath, size } = req.file;
        const userId = req.user._id;
        // Parse content
        const content = await (0, fileParser_1.parseFileContent)(filePath, mimetype);
        const document = await Document_1.default.create({
            name: originalname,
            originalName: originalname,
            mimeType: mimetype,
            content,
            owner: userId,
            metadata: {
                size,
            }
        });
        // Optionally delete the file from local storage after extracting text to save space
        fs_1.default.unlinkSync(filePath);
        res.status(201).json({
            _id: document._id,
            name: document.name,
            mimeType: document.mimeType,
            uploadTimestamp: document.uploadTimestamp,
            metadata: document.metadata,
        });
    }
    catch (error) {
        // Cleanup on error
        if (req.file && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message || 'Error processing file' });
    }
};
exports.uploadDocument = uploadDocument;
const getDocuments = async (req, res) => {
    try {
        const documents = await Document_1.default.find({ owner: req.user._id }).select('-content').sort({ uploadTimestamp: -1 });
        res.json(documents);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDocuments = getDocuments;
const deleteDocument = async (req, res) => {
    try {
        const document = await Document_1.default.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this document' });
        }
        await Document_1.default.deleteOne({ _id: document._id });
        res.json({ message: 'Document removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=documentController.js.map