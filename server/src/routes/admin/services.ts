import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { adminOnly } from '../../middleware/adminOnly.js';
import { z } from 'zod';

const router = Router();

const serviceSchema = z.object({
  locale: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  content_rich: z.any().optional(),
  featured_image: z.string().optional(),
  gallery_images: z.any().optional(),
  icon_key: z.string().optional(),
  is_featured: z.boolean().default(false),
  order: z.number().default(0),
  status: z.enum(['draft', 'published']).default('published'),
  published_at: z.string().optional(),
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
      prisma.services.findMany({
        where,
        orderBy: [
          { order: 'asc' },
          { created_at: 'desc' }
        ],
        skip,
        take: parseInt(pageSize as string),
      }),
      prisma.services.count({ where })
    ]);
    
    res.json({ items, total });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const data = serviceSchema.parse(req.body);
    
    const item = await prisma.services.create({
      data: {
        ...data,
        published_at: data.published_at ? new Date(data.published_at) : null,
      }
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = serviceSchema.parse(req.body);
    
    const item = await prisma.services.update({
      where: { id },
      data: {
        ...data,
        published_at: data.published_at ? new Date(data.published_at) : null,
      }
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.services.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;