import mongoose, { Document as MongooseDocument } from 'mongoose';
export interface IConversation extends MongooseDocument {
    user: mongoose.Types.ObjectId;
    document: mongoose.Types.ObjectId;
    question: string;
    aiResponse: string;
    timestamp: Date;
}
declare const _default: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, mongoose.DefaultSchemaOptions> & IConversation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IConversation>;
export default _default;
//# sourceMappingURL=Conversation.d.ts.map