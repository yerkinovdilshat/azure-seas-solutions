import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply admin role requirement to all routes
router.use(requireRole(['admin', 'editor']));

const aboutItemSchema = z.object({
  kind: z.enum(['distribution', 'certificate', 'license']),
  title_ru: z.string().optional(),
  title_en: z.string().optional(),
  title_kk: z.string().optional(),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  description_kk: z.string().optional(),
  issuer_ru: z.string().optional(),
  issuer_en: z.string().optional(),
  issuer_kk: z.string().optional(),
  date: z.string().optional().transform(val => val ? new Date(val) : undefined),
  image_url: z.string().optional(),
  pdf_url: z.string().optional(),
  is_published: z.boolean().default(true),
  order_index: z.number().default(0)
});

// Get about items for admin
router.get('/about/items', async (req, res) => {
  try {
    const kind = req.query.kind as string;
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const skip = (page - 1) * pageSize;
    
    const where: any = {};
    if (kind && ['distribution', 'certificate', 'license'].includes(kind)) {
      where.kind = kind;
    }
    if (search) {
      where.OR = [
        { title_ru: { contains: search } },
        { title_en: { contains: search } },
        { title_kk: { contains: search } },
        { description_ru: { contains: search } },
        { description_en: { contains: search } },
        { description_kk: { contains: search } }
      ];
    }
    
    const [items, total] = await Promise.all([
      prisma.aboutItems.findMany({
        where,
        orderBy: [
          { order_index: 'asc' },
          { updated_at: 'desc' }
        ],
        skip,
        take: pageSize
      }),
      prisma.aboutItems.count({ where })
    ]);
    
    res.json({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Create about item
router.post('/about/items', async (req, res) => {
  try {
    const data = aboutItemSchema.parse(req.body);
    
    const item = await prisma.aboutItems.create({
      data: data as any
    });
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

// Update about item
router.put('/about/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = aboutItemSchema.parse(req.body);
    
    const item = await prisma.aboutItems.update({
      where: { id },
      data: data as any
    });
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

// Delete about item
router.delete('/about/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.aboutItems.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete item' });
  }
});

// Bulk update order
router.put('/about/items/reorder', async (req, res) => {
  try {
    const { items } = req.body as { items: { id: string; order_index: number }[] };
    
    await Promise.all(
      items.map(item => 
        prisma.aboutItems.update({
          where: { id: item.id },
          data: { order_index: item.order_index }
        })
      )
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to reorder items' });
  }
});

// Get general about blocks
router.get('/about/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const locale = req.query.locale as string || 'en';
    
    let data;
    
    switch (section) {
      case 'story':
        data = await prisma.aboutStory.findFirst({
          where: { locale }
        });
        break;
      case 'values':
        data = await prisma.aboutValues.findMany({
          where: { locale },
          orderBy: { order: 'asc' }
        });
        break;
      case 'timeline':
        data = await prisma.aboutTimeline.findMany({
          where: { locale },
          orderBy: { year: 'asc' }
        });
        break;
      case 'team':
        data = await prisma.aboutTeam.findMany({
          where: { locale },
          orderBy: { order: 'asc' }
        });
        break;
      case 'partners':
        data = await prisma.aboutPartners.findMany({
          orderBy: { order: 'asc' }
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid section' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch section data' });
  }
});

export default router;