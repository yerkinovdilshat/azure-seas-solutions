# Marine Support Services - Plesk Deployment Guide

## Project Overview
- **Frontend**: React + Vite SPA (TypeScript)  
- **Backend**: Express.js + Prisma + MariaDB/MySQL
- **Authentication**: JWT with HTTP-only cookies
- **File Uploads**: Local filesystem storage

## Environment Variables
Copy these to your Plesk environment (replace placeholder values):

```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/marine_support"

# Application
APP_URL="https://yourdomain.com"
NODE_ENV="production"
PORT=3000
FILE_UPLOAD_DIR="./uploads"

# Security
JWT_SECRET="generate-a-secure-32-character-string-here"
SESSION_COOKIE_NAME="ms_session"
CORS_ORIGIN="https://yourdomain.com"

# SMTP Configuration (for contact forms)
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT=587
SMTP_USER="no-reply@yourdomain.com"
SMTP_PASS="your_email_password"
SMTP_FROM="Marine Support Services <no-reply@yourdomain.com>"
CONTACTS_TO="contact@yourdomain.com"

# Admin User (created automatically on first startup)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="choose-a-strong-admin-password"
```

## Build Order

### 1. Install Dependencies
```bash
npm install
cd server && npm install
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Build Backend
```bash
cd server
npm run generate  # Generate Prisma client
npm run build     # Compile TypeScript
```

### 4. Database Setup
```bash
cd server
npx prisma migrate deploy  # Run migrations
npm run db:seed           # Seed initial data
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