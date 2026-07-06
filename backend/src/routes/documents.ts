import express from 'express';
import multer from 'multer';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/documentController';
import { protect } from '../middleware/authMiddleware';
import fs from 'fs';

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain' || file.mimetype === 'text/markdown') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format'));
    }
  }
});

router.route('/')
  .post(protect, upload.single('file'), uploadDocument)
  .get(protect, getDocuments);

router.route('/:id')
  .delete(protect, deleteDocument);

export default router;
