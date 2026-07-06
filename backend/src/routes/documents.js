"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const documentController_1 = require("../controllers/documentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// Configure Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain' || file.mimetype === 'text/markdown') {
            cb(null, true);
        }
        else {
            cb(new Error('Unsupported file format'));
        }
    }
});
router.route('/')
    .post(authMiddleware_1.protect, upload.single('file'), documentController_1.uploadDocument)
    .get(authMiddleware_1.protect, documentController_1.getDocuments);
router.route('/:id')
    .delete(authMiddleware_1.protect, documentController_1.deleteDocument);
exports.default = router;
//# sourceMappingURL=documents.js.map