import express from 'express';
import { prisma } from '../lib/prisma.js';
const router = express.Router();
// Get all catalog products with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 8;
        const locale = req.query.locale || 'en';
        const skip = (page - 1) * pageSize;
        const [products, total] = await Promise.all([
            prisma.catalogProducts.findMany({
                where: {
                    locale,
                    status: 'published'
                },
                orderBy: [
                    { is_featured: 'desc' },
                    { order: 'asc' },
                    { created_at: 'desc' }
                ],
                skip,
                take: pageSize
            }),
            prisma.catalogProducts.count({
                where: {
                    locale,
                    status: 'published'
                }
            })
        ]);
        res.json({
            products,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch catalog products' });
    }
});
// Get single product by slug
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const locale = req.query.locale || 'en';
        const product = await prisma.catalogProducts.findFirst({
            where: {
                slug,
                locale,
                status: 'published'
            }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
export default router;
//# sourceMappingURL=catalog.js.map