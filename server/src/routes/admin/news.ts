import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { adminOnly } from '../../middleware/adminOnly.js';
import { z } from 'zod';

const router = Router();

const newsSchema = z.object({
  locale: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  content_rich: z.any().optional(),
  featured_image: z.string().optional(),
  gallery_images: z.any().optional(),
  video_url: z.string().optional(),
  published_at: z.string().optional(),
  order: z.number().default(0),
  status: z.enum(['draft', 'published']).default('draft'),
  is_featured: z.boolean().default(false),
});

// Apply admin middleware to all routes
router.use(adminOnly);

// GET list
router.get('/', async (req, res) => {
  try {
    const { locale, status, page = '1', pageSize = '10' } = req.query;
    
    const where: any = {};
    if (locale) where.locale = locale;
    if (status) where.status = status;
    
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    
    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: [
          { order: 'asc' },
          { created_at: 'desc' }
        ],
        skip,
        take: parseInt(pageSize as string),
      }),
      prisma.news.count({ where })
    ]);
    
    res.json({ items, total });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const data = newsSchema.parse(req.body);
    
    const item = await prisma.news.create({
      data: {
        ...data,
        published_at: data.published_at ? new Date(data.published_at) : null,
      }
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Failed to create news' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = newsSchema.parse(req.body);
    
    const item = await prisma.news.update({
      where: { id },
      data: {
        ...data,
        published_at: data.published_at ? new Date(data.published_at) : null,
      }
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.news.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

export default router;