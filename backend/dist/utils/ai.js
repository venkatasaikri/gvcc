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
Object.defineProperty(exports, "__esModule", { value: true });
exports.askGemini = void 0;
const genai_1 = require("@google/genai");
const askGemini = (documentContent, question) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const prompt = `You are a helpful knowledge base assistant. Use the following document context to answer the user's question. If the answer is not contained within the document context, kindly inform the user that you don't know the answer based on the provided document.

--- Document Context ---
${documentContent}
--- End Document Context ---

Question: ${question}
Answer:`;
        const response = yield ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || 'No response generated.';
    }
    catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to communicate with AI provider');
    }
});
exports.askGemini = askGemini;
