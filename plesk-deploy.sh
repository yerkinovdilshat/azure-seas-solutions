#!/bin/bash
set -e
export NODE_ENV=production
npm ci
npm run build
cd server
npm ci
npx prisma generate
# npx prisma migrate deploy   # only if migrations are prepared
npm run build
mkdir -p ./uploads
chmod 755 ./uploads