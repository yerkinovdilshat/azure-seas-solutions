import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { adminOnly } from '../../middleware/adminOnly.js';
import { z } from 'zod';

const router = Router();

const projectSchema = z.object({
  locale: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  content_rich: z.any().optional(),
  featured_image: z.string().optional(),
  gallery_images: z.any().optional(),
  video_url: z.string().optional(),
  client_name: z.string().optional(),
  project_date: z.string().optional(),
  project_location: z.string().optional(),
  project_status: z.enum(['planned', 'in_progress', 'completed']).default('completed'),
  is_featured: z.boolean().default(false),
  order_index: z.number().default(0),
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
      prisma.projects.findMany({
        where,
        orderBy: [
          { is_featured: 'desc' },
          { project_date: 'desc' },
          { created_at: 'desc' }
        ],
        skip,
        take: parseInt(pageSize as string),
      }),
      prisma.projects.count({ where })
    ]);
    
    res.json({ items, total });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const data = projectSchema.parse(req.body);
    
    const item = await prisma.projects.create({
      data: {
        ...data,
        project_date: data.project_date ? new Date(data.project_date) : null,
        published_at: data.published_at ? new Date(data.published_at) : null,
      }
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    const data = projectSchema.parse(req.body);
    
    const item = await prisma.projects.update({
      where: { id: idNum },
      data: {
        ...data,
        project_date: data.project_date ? new Date(data.project_date) : null,
        published_at: data.published_at ? new Date(data.published_at) : null,
      }
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const idNum = Number(req.params.id);
    
    await prisma.projects.delete({
      where: { id: idNum }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;