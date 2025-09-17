import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { adminOnly } from '../../middleware/adminOnly.js';
import { z } from 'zod';
const router = Router();
const siteSettingsSchema = z.object({
    hero_title_ru: z.string().optional(),
    hero_title_en: z.string().optional(),
    hero_title_kk: z.string().optional(),
    hero_subtitle_ru: z.string().optional(),
    hero_subtitle_en: z.string().optional(),
    hero_subtitle_kk: z.string().optional(),
    cta1_text_ru: z.string().optional(),
    cta1_text_en: z.string().optional(),
    cta1_text_kk: z.string().optional(),
    cta1_link: z.string().optional(),
    cta2_text_ru: z.string().optional(),
    cta2_text_en: z.string().optional(),
    cta2_text_kk: z.string().optional(),
    cta2_link: z.string().optional(),
    hero_bg_url: z.string().optional(),
});
// Apply admin middleware to all routes
router.use(adminOnly);
// GET current site settings
router.get('/', async (req, res) => {
    try {
        const settings = await prisma.siteSettings.findFirst({
            orderBy: { created_at: 'desc' }
        });
        res.json(settings || {});
    }
    catch (error) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({ error: 'Failed to fetch site settings' });
    }
});
// POST upsert site settings
router.post('/', async (req, res) => {
    try {
        const data = siteSettingsSchema.parse(req.body);
        // Check if settings exist
        const existing = await prisma.siteSettings.findFirst();
        let settings;
        if (existing) {
            settings = await prisma.siteSettings.update({
                where: { id: existing.id },
                data
            });
        }
        else {
            settings = await prisma.siteSettings.create({
                data
            });
        }
        res.json(settings);
    }
    catch (error) {
        console.error('Error saving site settings:', error);
        res.status(500).json({ error: 'Failed to save site settings' });
    }
});
export default router;
//# sourceMappingURL=siteSettings.js.map