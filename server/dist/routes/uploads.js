import express from 'express';
import multer from 'multer';
import path from 'path';
import { validateFile } from '../lib/uploads.js';
const router = express.Router();
// Configure multer for different file types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        let subDir = 'misc';
        if (file.mimetype.startsWith('image/')) {
            subDir = 'images';
        }
        else if (file.mimetype === 'application/pdf') {
            subDir = 'pdf';
        }
        const uploadPath = path.join(process.env.FILE_UPLOAD_DIR || './uploads', subDir, year.toString(), month);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}-${sanitized}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf'
        ];
        cb(null, allowedMimes.includes(file.mimetype));
    }
});
// Single file upload
router.post('/single', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const validation = validateFile(req.file, req.file.mimetype.startsWith('image/') ? 'image' : 'pdf');
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }
        const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
        const fileUrl = `${baseUrl}/uploads/${req.file.path.split('uploads/')[1].replace(/\\/g, '/')}`;
        res.json({
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to upload file' });
    }
});
// Multiple files upload
router.post('/multiple', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const results = [];
        const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
        for (const file of req.files) {
            const validation = validateFile(file, file.mimetype.startsWith('image/') ? 'image' : 'pdf');
            if (validation.valid) {
                const fileUrl = `${baseUrl}/uploads/${file.path.split('uploads/')[1].replace(/\\/g, '/')}`;
                results.push({
                    url: fileUrl,
                    filename: file.filename,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                });
            }
        }
        res.json({ files: results });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to upload files' });
    }
});
export default router;
//# sourceMappingURL=uploads.js.map