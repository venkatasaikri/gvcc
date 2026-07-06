import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  name: string;
  originalName: string;
  mimeType: string;
  content: string; // extracted text
  owner: mongoose.Types.ObjectId;
  uploadTimestamp: Date;
  metadata: {
    size: number;
    pages?: number;
  };
}

const DocumentSchema: Schema = new Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  content: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadTimestamp: { type: Date, default: Date.now },
  metadata: {
    size: { type: Number, required: true },
    pages: { type: Number },
  },
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
