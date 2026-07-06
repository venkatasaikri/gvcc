import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const askQuestion: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getHistory: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=askController.d.ts.map