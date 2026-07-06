import mongoose, { Document as MongooseDocument } from 'mongoose';
export interface IDocument extends MongooseDocument {
    name: string;
    originalName: string;
    mimeType: string;
    content: string;
    owner: mongoose.Types.ObjectId;
    uploadTimestamp: Date;
    metadata: {
        size: number;
        pages?: number;
    };
}
declare const _default: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument, {}, mongoose.DefaultSchemaOptions> & IDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDocument>;
export default _default;
//# sourceMappingURL=Document.d.ts.map