import { Request, Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../middleware/authMiddleware';
import { parseFileContent } from '../utils/fileParser';
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, path: filePath, size } = req.file;
    const userId = req.user._id;

    // Parse content
    const content = await parseFileContent(filePath, mimetype, originalname);

    const document = await Document.create({
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
    fs.unlinkSync(filePath);

    res.status(201).json({
      _id: document._id,
      name: document.name,
      mimeType: document.mimeType,
      uploadTimestamp: document.uploadTimestamp,
      metadata: document.metadata,
    });
  } catch (error: any) {
    // Cleanup on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message || 'Error processing file' });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const documents = await Document.find({ owner: req.user._id }).select('-content').sort({ uploadTimestamp: -1 });
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this document' });
    }

    await Document.deleteOne({ _id: document._id });
    res.json({ message: 'Document removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
