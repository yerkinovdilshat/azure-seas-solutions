# Plesk Deployment Guide

This document provides instructions for deploying the application on Plesk hosting with MariaDB.

## Prerequisites

- Plesk hosting environment
- MariaDB database access
- Node.js support

## Environment Configuration

### Required Environment Variables

Set these variables in Plesk environment settings (no secrets in code):

```bash
DATABASE_URL=mysql://DB_USER:DB_PASS@localhost:3306/DB_NAME
APP_URL=https://yourdomain.com
NODE_ENV=production
PORT=3000
FILE_UPLOAD_DIR=./server/uploads
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
SESSION_COOKIE_NAME=ms_session
CORS_ORIGIN=https://yourdomain.com
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@yourdomain.com
CONTACTS_TO=contact@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password
```

## Build Process

### 1. Install Dependencies and Build Client

```bash
npm i
npm run build
```

### 2. Build Server

```bash
cd server
npm i
npx prisma generate
npm run build
```

## Database Setup

### Reflect Existing Schema (Non-destructive)

```bash
cd server
npx prisma db pull
npx prisma generate
```

## Deployment Configuration

### Option 1: Serve Frontend + API from Express (Recommended)
- **Document Root**: Point to your domain folder (not /dist)
- **Start Command**: `node server/dist/index.js`
- **Port**: 3000 (or configure in Plesk)

The Express server will:
- Serve static frontend files from `/dist`
- Handle API routes at `/api/*`
- Serve uploaded files from `/uploads`

### Option 2: Separate Static + API
- **Document Root**: `dist/` (for static files)
- **Proxy API**: `/api/*` → `http://localhost:3000/api/`
- **Start Command**: `node server/dist/index.js`

## Required Permissions

### File Upload Directory
Ensure the upload directory has write permissions:
```bash
chmod 755 uploads/
```

The server creates this directory automatically on startup if it doesn't exist.

### Node.js Process
- The Node.js process should run continuously
- Configure PM2 or similar process manager in Plesk
- Memory: Minimum 512MB recommended

## SSL Configuration
- Enable SSL/TLS in Plesk
- Update `CORS_ORIGIN` and `APP_URL` to use `https://`
- Cookies will use `secure: true` in production

## Health Check
- Endpoint: `GET /api/health`
- Returns: `{"ok": true, "timestamp": "..."}`

## Database Migration Notes
- Run `npx prisma migrate deploy` after each deployment
- Database migrations are automatic during deployment
- Backup your database before major updates

## Troubleshooting

### Common Issues:
1. **Database Connection**: Verify `DATABASE_URL` format and credentials
2. **File Permissions**: Ensure upload directory is writable
3. **CORS Errors**: Check `CORS_ORIGIN` matches your domain exactly
4. **SMTP Issues**: Test email settings with your hosting provider

### Logs:
- Application logs: Check Plesk logs or PM2 logs
- Database logs: Check MariaDB/MySQL logs in Plesk

## Production Checklist
- [ ] Database credentials configured
- [ ] Strong JWT_SECRET generated (32+ characters)
- [ ] CORS_ORIGIN set to your domain
- [ ] SMTP settings tested
- [ ] SSL certificate installed
- [ ] File upload directory permissions set
- [ ] Admin user credentials secured
- [ ] Database backed up before deployment