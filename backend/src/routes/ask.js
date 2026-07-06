"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const askController_1 = require("../controllers/askController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, askController_1.askQuestion);
router.get('/history', authMiddleware_1.protect, askController_1.getHistory);
exports.default = router;
//# sourceMappingURL=ask.js.map