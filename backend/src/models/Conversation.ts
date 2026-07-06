import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IConversation extends MongooseDocument {
  user: mongoose.Types.ObjectId;
  document: mongoose.Types.ObjectId;
  question: string;
  aiResponse: string;
  timestamp: Date;
}

const ConversationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  document: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
  question: { type: String, required: true },
  aiResponse: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
