import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { adminOnly } from '../../middleware/adminOnly.js';
import { z } from 'zod';

const router = Router();

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
  date: z.string().optional(),
  image_url: z.string().optional(),
  pdf_url: z.string().optional(),
  is_published: z.boolean().default(true),
  order_index: z.number().default(0),
});

// Apply admin middleware to all routes
router.use(adminOnly);

// GET list with filters
router.get('/', async (req, res) => {
  try {
    const { kind, search, page = '1', pageSize = '10' } = req.query;
    
    const where: any = {};
    if (kind) where.kind = kind;
    if (search) {
      where.OR = [
        { title_ru: { contains: search as string } },
        { title_en: { contains: search as string } },
        { title_kk: { contains: search as string } },
      ];
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    
    const [items, total] = await Promise.all([
      prisma.aboutItems.findMany({
        where,
        orderBy: [
          { order_index: 'asc' },
          { created_at: 'desc' }
        ],
        skip,
        take: parseInt(pageSize as string),
      }),
      prisma.aboutItems.count({ where })
    ]);
    
    res.json({ items, total });
  } catch (error) {
    console.error('Error fetching about items:', error);
    res.status(500).json({ error: 'Failed to fetch about items' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const data = aboutItemSchema.parse(req.body);
    
    const item = await prisma.aboutItems.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : null,
      }
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error creating about item:', error);
    res.status(500).json({ error: 'Failed to create about item' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    const data = aboutItemSchema.parse(req.body);
    
    const item = await prisma.aboutItems.update({
      where: { id: idNum },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : null,
      }
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error updating about item:', error);
    res.status(500).json({ error: 'Failed to update about item' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    
    await prisma.aboutItems.delete({
      where: { id: idNum }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting about item:', error);
    res.status(500).json({ error: 'Failed to delete about item' });
  }
});

export default router;