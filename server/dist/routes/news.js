import express from 'express';
import { prisma } from '../lib/prisma.js';
const router = express.Router();
// GET /api/news - List all published news
router.get('/', async (req, res) => {
    try {
        const locale = req.query.locale || 'en';
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const search = req.query.search;
        const year = req.query.year;
        const where = {
            locale,
            status: 'published'
        };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (year) {
            where.published_at = {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${parseInt(year) + 1}-01-01`)
            };
        }
        const [news, total] = await Promise.all([
            prisma.news.findMany({
                where,
                orderBy: [
                    { is_featured: 'desc' },
                    { published_at: 'desc' },
                    { created_at: 'desc' }
                ],
                skip: (page - 1) * pageSize,
                take: pageSize,
                select: {
                    id: true,
                    title: true,
                    excerpt: true,
                    slug: true,
                    featured_image: true,
                    is_featured: true,
                    published_at: true,
                    created_at: true
                }
            }),
            prisma.news.count({ where })
        ]);
        res.json({
            news,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    }
    catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});
// GET /api/news/:slug - Get single news article
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const locale = req.query.locale || 'en';
        const article = await prisma.news.findFirst({
            where: {
                slug,
                locale,
                status: 'published'
            }
        });
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(article);
    }
    catch (error) {
        console.error('Error fetching news article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});
export default router;
//# sourceMappingURL=news.js.map