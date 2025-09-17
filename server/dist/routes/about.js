import express from 'express';
import { prisma } from '../lib/prisma.js';
const router = express.Router();
// Get general about sections (story, values, timeline, team, partners)
router.get('/general', async (req, res) => {
    try {
        const locale = req.query.locale || 'en';
        const [story, values, timeline, team, partners, blocks] = await Promise.all([
            prisma.aboutStory.findFirst({
                where: { locale, status: 'published' }
            }),
            prisma.aboutValues.findMany({
                where: { locale, status: 'published' },
                orderBy: { order: 'asc' }
            }),
            prisma.aboutTimeline.findMany({
                where: { locale, status: 'published' },
                orderBy: { year: 'asc' }
            }),
            prisma.aboutTeam.findMany({
                where: { locale, status: 'published' },
                orderBy: { order: 'asc' }
            }),
            prisma.aboutPartners.findMany({
                where: { status: 'published' },
                orderBy: { order: 'asc' }
            }),
            prisma.aboutBlocks.findMany({
                where: { status: 'published' }
            })
        ]);
        res.json({
            story,
            values,
            timeline,
            team,
            partners,
            blocks
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch about data' });
    }
});
// Get about items (distribution, certificates, licenses)
router.get('/items', async (req, res) => {
    try {
        const kind = req.query.kind;
        const locale = req.query.locale || 'en';
        if (!kind || !['distribution', 'certificate', 'license'].includes(kind)) {
            return res.status(400).json({ error: 'Invalid or missing kind parameter' });
        }
        const items = await prisma.aboutItems.findMany({
            where: {
                kind: kind,
                is_published: true
            },
            orderBy: { order_index: 'asc' }
        });
        // Transform to locale-specific format
        const localizedItems = items.map(item => ({
            id: item.id,
            title: item[`title_${locale}`] || item.title_en || '',
            description: item[`description_${locale}`] || item.description_en || '',
            issuer: item[`issuer_${locale}`] || item.issuer_en || '',
            date: item.date,
            image_url: item.image_url,
            pdf_url: item.pdf_url,
            order_index: item.order_index,
            created_at: item.created_at,
            updated_at: item.updated_at
        }));
        res.json(localizedItems);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});
export default router;
//# sourceMappingURL=about.js.map