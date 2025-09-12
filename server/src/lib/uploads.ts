import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';

const UPLOAD_DIR = process.env.FILE_UPLOAD_DIR || './uploads';

export const createUploadDirs = async () => {
  const dirs = [
    'images/team',
    'images/news', 
    'images/catalog',
    'images/projects',
    'images/services',
    'images/about',
    'images/partners',
    'pdf',
    'resumes',
  ];

  for (const dir of dirs) {
    const fullPath = path.join(UPLOAD_DIR, dir);
    try {
      await fs.mkdir(fullPath, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory ${fullPath}:`, error);
    }
  }
};

export const getUploadPath = (type: string, filename: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  return path.join(UPLOAD_DIR, type, String(year), month, filename);
};

export const createMulterStorage = (subfolder: string) => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const dir = path.join(UPLOAD_DIR, subfolder, String(year), month);
      
      try {
        await fs.mkdir(dir, { recursive: true });
        cb(null, dir);
      } catch (error) {
        cb(error as Error, '');
      }
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      cb(null, `${timestamp}_${name}${ext}`);
    },
  });
};

export const validateImageFile = (file: Express.Multer.File): boolean => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return allowedMimes.includes(file.mimetype) && file.size <= maxSize;
};

export const validatePdfFile = (file: Express.Multer.File): boolean => {
  const allowedMimes = ['application/pdf'];
  const maxSize = 20 * 1024 * 1024; // 20MB
  
  return allowedMimes.includes(file.mimetype) && file.size <= maxSize;
};

export const validateResumeFile = (file: Express.Multer.File): boolean => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return allowedMimes.includes(file.mimetype) && file.size <= maxSize;
};