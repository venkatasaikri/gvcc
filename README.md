# AI-Powered Knowledge Base Assistant

A full-stack web application that allows users to upload documents (PDF, TXT, MD) and interact with an AI to ask questions based on the document's contents. Built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with the Google Gemini API.

## Features

- **User Authentication**: Secure signup and login with JWT and bcrypt.
- **Document Management**: Upload PDF, TXT, and Markdown files. View uploaded files and delete them.
- **AI Question Answering**: Ask context-aware questions based on your uploaded documents, powered by Google Gemini.
- **Chat History**: Keeps track of previous conversations.
- **Dashboard**: View high-level metrics like total documents and questions asked.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation Steps

1. **Clone the repository** (if not already done).
2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```
3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory with the following keys:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kb-assistant
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### Running Locally

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   *(Note: ensure your local MongoDB instance is running, or `MONGO_URI` points to a valid Atlas cluster)*

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Design Decisions
- **TypeScript**: Used across both frontend and backend for type safety and better developer experience.
- **Tailwind CSS**: Chosen for rapid UI development and consistent, responsive styling without external component libraries.
- **Context API**: Used for global authentication state management.
- **Google Gemini**: Selected as the LLM provider due to its fast inference and generous free tier for developers.

## Future Improvements
- **Vector Database**: Instead of sending the whole document to the LLM context (which fails on very large files), chunk the documents and store them in a vector DB (like Pinecone or Qdrant) for scalable Semantic Search (RAG).
- **Rate Limiting**: Implement express-rate-limit to protect AI endpoints from abuse.
- **Advanced File Parsing**: Implement OCR for scanned PDFs.
- **Streaming Responses**: Stream the AI response chunks to the frontend for a better user experience (similar to ChatGPT).
