import multer from 'multer';
export declare const createUploadDirs: () => Promise<void>;
export declare const getUploadPath: (type: string, filename: string) => string;
export declare const createMulterStorage: (subfolder: string) => multer.StorageEngine;
export declare const validateImageFile: (file: Express.Multer.File) => boolean;
export declare const validatePdfFile: (file: Express.Multer.File) => boolean;
export declare const validateResumeFile: (file: Express.Multer.File) => boolean;
//# sourceMappingURL=uploads.d.ts.map