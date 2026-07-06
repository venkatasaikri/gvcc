import fs from 'fs';
import pdfParse from 'pdf-parse';

export const parseFileContent = async (filePath: string, mimeType: string, originalName: string = ''): Promise<string> => {
  try {
    const isPDF = mimeType === 'application/pdf' || originalName.endsWith('.pdf');
    if (isPDF) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else {
      // Fallback for TXT and MD, even if mimetype is octet-stream
      const text = fs.readFileSync(filePath, 'utf-8');
      return text;
    }
  } catch (error) {
    throw error;
  }
};
