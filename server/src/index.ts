import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';

import { config } from './config.js';
import { prisma } from './lib/prisma.js';
import { createUploadDirs } from './lib/uploads.js';
import { seedAdmin } from './scripts/seed.js';
import authRoutes from './routes/auth.js';
import aboutRoutes from './routes/about.js';
import catalogRoutes from './routes/catalog.js';
import contactRoutes from './routes/contacts.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/uploads.js';
import newsRoutes from './routes/news.js';
import projectsRoutes from './routes/projects.js';
import servicesRoutes from './routes/services.js';
import { authMiddleware } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

const app = express();

// Trust proxy if behind nginx/Plesk
app.set('trust proxy', config.NODE_ENV === 'production');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      fontSrc: ["'self'", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: config.CORS_ORIGIN === "*" ? (config.NODE_ENV === 'production' ? false : "*") : config.CORS_ORIGIN,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});
app.use('/api/auth', authLimiter);

// Serve static files
app.use('/uploads', express.static(config.FILE_UPLOAD_DIR));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/uploads', authMiddleware, uploadRoutes);

// Serve client in production
if (config.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../dist');
  app.use(express.static(clientDistPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    // Ensure database connection
    await prisma.$connect();
    logger.info('Database connected');

    // Create upload directories
    await createUploadDirs();
    logger.info('Upload directories created');

    // Seed admin user
    await seedAdmin();
    logger.info('Admin user seeded');

    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();