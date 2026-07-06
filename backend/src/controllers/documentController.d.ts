import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const uploadDocument: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDocuments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteDocument: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=documentController.d.ts.map