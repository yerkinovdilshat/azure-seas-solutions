import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { getConfig } from '../config.js';

const config = getConfig();
const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6)
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    // Support both plain password and bcrypt hash for compatibility
    const isValidPassword = user?.password 
      ? password === user.password 
      : user?.passwordHash 
        ? await bcrypt.compare(password, user.passwordHash)
        : false;
    
    if (!user || !isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie(config.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie(config.SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.NODE_ENV === 'production',
    path: '/',
  });
  res.json({ ok: true });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.[config.SESSION_COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: number; role: string };
    const user = await prisma.user.findUnique({ 
      where: { id: payload.userId }, 
      select: { id: true, email: true, role: true } 
    });
    if (!user) return res.status(401).json({ error: 'Invalid session' });
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Change password
router.post('/change-password', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });
    
    if (!user || !await bcrypt.compare(currentPassword, user.passwordHash)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

export default router;