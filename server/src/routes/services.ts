import express from 'express';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const router = express.Router();

// GET /api/services - List all published services
router.get('/', async (req, res) => {
  try {
    const locale = req.query.locale as string || 'en';
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 12;

    const where: any = {
      locale,
      status: 'published'
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [services, total] = await Promise.all([
      prisma.services.findMany({
        where,
        orderBy: [
          { is_featured: 'desc' },
          { order_index: 'asc' },
          { created_at: 'desc' }
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          featured_image: true,
          icon_key: true,
          is_featured: true,
          published_at: true,
          created_at: true
        }
      }),
      prisma.services.count({ where })
    ]);

    res.json({
      services,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/services/:slug - Get single service
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const locale = req.query.locale as string || 'en';

    const service = await prisma.services.findFirst({
      where: {
        slug,
        locale,
        status: 'published'
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

export default router;