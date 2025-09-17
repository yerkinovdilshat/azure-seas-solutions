import express from 'express';
import { prisma } from '../lib/prisma.js';
const router = express.Router();
// GET /api/projects - List all published projects
router.get('/', async (req, res) => {
    try {
        const locale = req.query.locale || 'en';
        const search = req.query.search;
        const status = req.query.status;
        const location = req.query.location;
        const where = {
            locale,
            status: 'published'
        };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { client_name: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status && status !== 'all') {
            where.project_status = status;
        }
        if (location) {
            where.project_location = { contains: location, mode: 'insensitive' };
        }
        const projects = await prisma.projects.findMany({
            where,
            orderBy: [
                { is_featured: 'desc' },
                { project_date: 'desc' },
                { created_at: 'desc' }
            ],
            select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                featured_image: true,
                client_name: true,
                project_location: true,
                project_status: true,
                project_date: true,
                is_featured: true,
                published_at: true,
                created_at: true
            }
        });
        res.json({ projects });
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});
// GET /api/projects/:slug - Get single project
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const locale = req.query.locale || 'en';
        const project = await prisma.projects.findFirst({
            where: {
                slug,
                locale,
                status: 'published'
            }
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});
export default router;
//# sourceMappingURL=projects.js.map