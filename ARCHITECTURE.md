# Architecture

## Project Structure
The project is a monorepo containing two main directories:
- `backend/`: Node.js, Express, TypeScript, Mongoose.
- `frontend/`: React, Vite, TypeScript, Tailwind CSS.

## Database Design
MongoDB is used as the primary data store with three core models:
1. **User**: Stores authentication details (hashed passwords).
2. **Document**: Stores file metadata, owner reference, and the extracted text content.
3. **Conversation**: Stores chat history (user, document reference, question, and AI response).

## Authentication Approach
JSON Web Tokens (JWT) are used for stateless authentication. 
- On successful login/signup, the backend generates a JWT.
- The frontend stores this token in `localStorage`.
- An Axios interceptor automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests.
- The backend `protect` middleware verifies the token and attaches the authenticated user to the request object.

## Major Engineering Decisions
1. **Full-Document Context**: For this MVP, the entire parsed text of the document is passed in the prompt to the AI. This is simple and effective for small to medium documents.
2. **Synchronous File Parsing**: Files are parsed synchronously upon upload before saving to the DB.
3. **TypeScript**: Used end-to-end to catch errors early.
4. **Tailwind CSS**: Used for styling to keep the frontend bundle small and development fast.

## How to Improve and Scale
- **RAG (Retrieval-Augmented Generation)**: Sending full documents to an LLM scales poorly for large PDFs (token limits). The architecture should be improved by chunking the text, generating embeddings, and storing them in a Vector DB (like Pinecone). When a question is asked, only the most relevant chunks would be retrieved and sent to the LLM.
- **Asynchronous Processing**: File parsing can take time. Uploads should ideally place a job in a queue (e.g., Redis/Bull), and the user should be notified via WebSockets when parsing is complete.
- **Cloud Storage**: Instead of storing the raw extracted text in MongoDB and deleting the original file, files should be uploaded to AWS S3. MongoDB would only store the metadata and S3 URI.
