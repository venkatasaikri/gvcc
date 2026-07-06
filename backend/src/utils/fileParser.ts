import fs from 'fs';
import pdfParse from 'pdf-parse';

export const parseFileContent = async (filePath: string, mimeType: string): Promise<string> => {
  try {
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
      const text = fs.readFileSync(filePath, 'utf-8');
      return text;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw error;
  }
};
