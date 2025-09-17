import { z } from 'zod';
const configSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    // Application
    APP_URL: z.string().url('APP_URL must be a valid URL'),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.string().transform(Number).pipe(z.number().int().min(1).max(65535)).default('3000'),
    FILE_UPLOAD_DIR: z.string().default('./uploads'),
    // Security
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    CSRF_SECRET: z.string().optional(),
    SESSION_COOKIE_NAME: z.string().default('ms_session'),
    CORS_ORIGIN: z.string().default('*'),
    // SMTP
    SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
    SMTP_PORT: z.string().transform(Number).pipe(z.number().int().min(1).max(65535)).default('587'),
    SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
    SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),
    SMTP_FROM: z.string().email('SMTP_FROM must be a valid email'),
    CONTACTS_TO: z.string().email('CONTACTS_TO must be a valid email'),
    // Admin
    ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
    ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters'),
});
function loadConfig() {
    const result = configSchema.safeParse(process.env);
    if (!result.success) {
        console.error('Configuration validation failed:');
        console.error(result.error.format());
        process.exit(1);
    }
    return result.data;
}
export const config = loadConfig();
export const getConfig = () => config;
//# sourceMappingURL=config.js.map