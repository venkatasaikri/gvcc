"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFileContent = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const parseFileContent = async (filePath, mimeType) => {
    try {
        if (mimeType === 'application/pdf') {
            const dataBuffer = fs_1.default.readFileSync(filePath);
            const data = await (0, pdf_parse_1.default)(dataBuffer);
            return data.text;
        }
        else if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
            const text = fs_1.default.readFileSync(filePath, 'utf-8');
            return text;
        }
        else {
            throw new Error('Unsupported file type');
        }
    }
    catch (error) {
        throw error;
    }
};
exports.parseFileContent = parseFileContent;
//# sourceMappingURL=fileParser.js.map