import { Request, Response, NextFunction } from 'express';
export interface AdminRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}
export declare const adminOnly: (req: AdminRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=adminOnly.d.ts.map