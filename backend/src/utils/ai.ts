import { GoogleGenAI } from '@google/genai';

export const askGemini = async (documentContent: string, question: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    
    const prompt = `You are a helpful knowledge base assistant. Use the following document context to answer the user's question. If the answer is not contained within the document context, kindly inform the user that you don't know the answer based on the provided document.

--- Document Context ---
${documentContent}
--- End Document Context ---

Question: ${question}
Answer:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'No response generated.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to communicate with AI provider');
  }
};
