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
exports.deleteDocument = exports.getDocuments = exports.uploadDocument = void 0;
const Document_1 = __importDefault(require("../models/Document"));
const fileParser_1 = require("../utils/fileParser");
const fs_1 = __importDefault(require("fs"));
const uploadDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { originalname, mimetype, path: filePath, size } = req.file;
        const userId = req.user._id;
        // Parse content
        const content = yield (0, fileParser_1.parseFileContent)(filePath, mimetype);
        const document = yield Document_1.default.create({
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
});
exports.uploadDocument = uploadDocument;
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documents = yield Document_1.default.find({ owner: req.user._id }).select('-content').sort({ uploadTimestamp: -1 });
        res.json(documents);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDocuments = getDocuments;
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const document = yield Document_1.default.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this document' });
        }
        yield Document_1.default.deleteOne({ _id: document._id });
        res.json({ message: 'Document removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteDocument = deleteDocument;
