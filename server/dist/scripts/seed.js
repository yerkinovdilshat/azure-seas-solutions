import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
export async function seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
        console.log('ADMIN_EMAIL and ADMIN_PASSWORD must be set for seeding');
        return;
    }
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        // Create admin user
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash,
                role: 'admin',
            },
        });
        console.log(`Admin user created: ${admin.email}`);
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
}
async function seedData() {
    console.log('Seeding database...');
    await seedAdmin();
    // Seed default site settings
    const existingSettings = await prisma.siteSettings.findFirst();
    if (!existingSettings) {
        await prisma.siteSettings.create({
            data: {
                hero_title_en: 'Marine Support Services',
                hero_title_ru: 'Морские Вспомогательные Услуги',
                hero_title_kk: 'Теңіз Қолдау Қызметтері',
                hero_subtitle_en: 'Leading provider of marine and industrial services in Kazakhstan',
                hero_subtitle_ru: 'Ведущий поставщик морских и промышленных услуг в Казахстане',
                hero_subtitle_kk: 'Қазақстандағы теңіз және өнеркәсіп қызметтерінің жетекші провайдері',
                cta1_text_en: 'Our Services',
                cta1_text_ru: 'Наши Услуги',
                cta1_text_kk: 'Біздің Қызметтеріміз',
                cta1_link: '/services',
                cta2_text_en: 'Contact Us',
                cta2_text_ru: 'Связаться с Нами',
                cta2_text_kk: 'Бізбен Байланысыңыз',
                cta2_link: '/contacts',
                locale_default: 'en',
                hero_overlay_opacity: 0.45,
                hero_min_height_vh: 88,
                hero_top_padding_px: 140,
                content_max_width_px: 1100,
            },
        });
        console.log('Default site settings created');
    }
    console.log('Database seeded successfully');
}
// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedData()
        .then(() => {
        console.log('Seeding completed');
        process.exit(0);
    })
        .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    })
        .finally(() => {
        prisma.$disconnect();
    });
}
//# sourceMappingURL=seed.js.map