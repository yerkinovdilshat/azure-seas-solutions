import express from 'express';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { validateFile } from '../lib/uploads.js';
const router = express.Router();
// Configure multer for resume uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const uploadPath = path.join(process.env.FILE_UPLOAD_DIR || './uploads', 'resumes', year.toString(), month);
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        cb(null, allowedMimes.includes(file.mimetype));
    }
});
const contactSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().min(1).max(50),
    message: z.string().min(1).max(2000)
});
// Get contact information
router.get('/', async (req, res) => {
    try {
        const locale = req.query.locale || 'en';
        const contact = await prisma.contacts.findFirst({
            where: { locale, status: 'published' }
        });
        res.json(contact);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch contact information' });
    }
});
// Submit contact form
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone, message } = contactSchema.parse(req.body);
        // Validate uploaded file if present
        if (req.file) {
            const validation = validateFile(req.file, 'resume');
            if (!validation.valid) {
                return res.status(400).json({ error: validation.error });
            }
        }
        // Save contact request
        const contactRequest = await prisma.contactRequests.create({
            data: {
                name,
                phone,
                message,
                meta: {
                    email,
                    resumeFile: req.file ? req.file.filename : null,
                    userAgent: req.headers['user-agent'],
                    ip: req.ip
                }
            }
        });
        // Send email notification
        if (process.env.SMTP_HOST) {
            const transporter = nodemailer.createTransporter({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_PORT === '465',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: process.env.CONTACTS_TO,
                subject: `New Contact Form Submission from ${name}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          ${req.file ? `<p><strong>Resume:</strong> ${req.file.originalname}</p>` : ''}
        `,
                attachments: req.file ? [{
                        filename: req.file.originalname,
                        path: req.file.path
                    }] : []
            };
            await transporter.sendMail(mailOptions);
        }
        res.json({ success: true, id: contactRequest.id });
    }
    catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});
export default router;
//# sourceMappingURL=contacts.js.map