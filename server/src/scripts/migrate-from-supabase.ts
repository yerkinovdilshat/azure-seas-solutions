import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const BATCH_SIZE = 100;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface MigrationLog {
  table: string;
  source_count: number;
  migrated_count: number;
  errors: string[];
  timestamp: string;
}

const migrationLog: MigrationLog[] = [];

// Helper function to convert Supabase URLs to local paths
const convertImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // Convert supabase storage URLs to local paths
  const match = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
  if (match) {
    const [, bucket, path] = match;
    return `/uploads/${bucket}/${path}`;
  }
  
  return url;
};

// Helper to generate merge key for deduplication
const generateMergeKey = (item: any): string => {
  return item.file_url || item.image_url || item.title || item.id;
};

// Migrate AboutDistribution
async function migrateAboutDistribution() {
  console.log('Migrating about_distribution...');
  
  const { data: sourceData, error } = await supabase
    .from('about_distribution')
    .select('*');
    
  if (error) {
    console.error('Error fetching about_distribution:', error);
    return;
  }

  const migrated = [];
  const errors = [];

  for (const item of sourceData || []) {
    try {
      const aboutItem = await prisma.aboutItems.create({
        data: {
          kind: 'distribution',
          title_ru: item.title_ru,
          title_en: item.title_en,
          title_kk: item.title_kk,
          description_ru: item.description_ru,
          description_en: item.description_en,
          description_kk: item.description_kk,
          image_url: convertImageUrl(item.image_url),
          pdf_url: convertImageUrl(item.file_url),
          is_published: item.status === 'published',
          order_index: item.order_index || 0,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at || item.created_at),
        },
      });
      
      migrated.push(aboutItem);
    } catch (error) {
      console.error(`Error migrating distribution item ${item.id}:`, error);
      errors.push(`Distribution ${item.id}: ${error}`);
    }
  }

  migrationLog.push({
    table: 'about_distribution',
    source_count: sourceData?.length || 0,
    migrated_count: migrated.length,
    errors,
    timestamp: new Date().toISOString(),
  });
}

// Migrate AboutCertificates (with locale merging)
async function migrateAboutCertificates() {
  console.log('Migrating about_certificates...');
  
  const { data: sourceData, error } = await supabase
    .from('about_certificates')
    .select('*');
    
  if (error) {
    console.error('Error fetching about_certificates:', error);
    return;
  }

  // Group by merge key to handle multi-locale entries
  const groupedItems = new Map<string, any[]>();
  
  for (const item of sourceData || []) {
    const mergeKey = generateMergeKey(item);
    if (!groupedItems.has(mergeKey)) {
      groupedItems.set(mergeKey, []);
    }
    groupedItems.get(mergeKey)!.push(item);
  }

  const migrated = [];
  const errors = [];

  for (const [mergeKey, items] of groupedItems.entries()) {
    try {
      // Merge locale-specific fields
      const merged = {
        title_ru: null,
        title_en: null, 
        title_kk: null,
        description_ru: null,
        description_en: null,
        description_kk: null,
        issuer_ru: null,
        issuer_en: null,
        issuer_kk: null,
        image_url: null,
        pdf_url: null,
        date: null,
        order_index: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      for (const item of items) {
        const locale = item.locale;
        if (locale === 'ru') {
          merged.title_ru = item.title || item.title_ru;
          merged.description_ru = item.description_ru;
          merged.issuer_ru = item.issuer || item.issuer_ru;
        } else if (locale === 'en') {
          merged.title_en = item.title || item.title_en;
          merged.description_en = item.description_en;
          merged.issuer_en = item.issuer || item.issuer_en;
        } else if (locale === 'kk') {
          merged.title_kk = item.title || item.title_kk;
          merged.description_kk = item.description_kk;
          merged.issuer_kk = item.issuer || item.issuer_kk;
        }

        // Use first non-null values for shared fields
        merged.image_url = merged.image_url || convertImageUrl(item.image_url);
        merged.pdf_url = merged.pdf_url || convertImageUrl(item.file_url);
        merged.date = merged.date || (item.date ? new Date(item.date) : null);
        merged.order_index = merged.order_index || item.order || 0;
        merged.created_at = new Date(Math.min(merged.created_at.getTime(), new Date(item.published_at || item.created_at || Date.now()).getTime()));
      }

      const aboutItem = await prisma.aboutItems.create({
        data: {
          kind: 'certificate',
          ...merged,
          is_published: true,
        },
      });
      
      migrated.push(aboutItem);
    } catch (error) {
      console.error(`Error migrating certificate group ${mergeKey}:`, error);
      errors.push(`Certificate ${mergeKey}: ${error}`);
    }
  }

  migrationLog.push({
    table: 'about_certificates',
    source_count: sourceData?.length || 0,
    migrated_count: migrated.length,
    errors,
    timestamp: new Date().toISOString(),
  });
}

// Migrate AboutLicenses (with locale merging)
async function migrateAboutLicenses() {
  console.log('Migrating about_licenses...');
  
  const { data: sourceData, error } = await supabase
    .from('about_licenses')
    .select('*');
    
  if (error) {
    console.error('Error fetching about_licenses:', error);
    return;
  }

  // Group by merge key to handle multi-locale entries
  const groupedItems = new Map<string, any[]>();
  
  for (const item of sourceData || []) {
    const mergeKey = generateMergeKey(item);
    if (!groupedItems.has(mergeKey)) {
      groupedItems.set(mergeKey, []);
    }
    groupedItems.get(mergeKey)!.push(item);
  }

  const migrated = [];
  const errors = [];

  for (const [mergeKey, items] of groupedItems.entries()) {
    try {
      // Merge locale-specific fields
      const merged = {
        title_ru: null,
        title_en: null,
        title_kk: null,
        description_ru: null,
        description_en: null,
        description_kk: null,
        issuer_ru: null,
        issuer_en: null,
        issuer_kk: null,
        image_url: null,
        pdf_url: null,
        date: null,
        order_index: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      for (const item of items) {
        const locale = item.locale;
        if (locale === 'ru') {
          merged.title_ru = item.title || item.title_ru;
          merged.description_ru = item.description_ru;
          merged.issuer_ru = item.issuer || item.issuer_ru;
        } else if (locale === 'en') {
          merged.title_en = item.title || item.title_en;
          merged.description_en = item.description_en;
          merged.issuer_en = item.issuer || item.issuer_en;
        } else if (locale === 'kk') {
          merged.title_kk = item.title || item.title_kk;
          merged.description_kk = item.description_kk;
          merged.issuer_kk = item.issuer || item.issuer_kk;
        }

        // Use first non-null values for shared fields
        merged.image_url = merged.image_url || convertImageUrl(item.image_url);
        merged.pdf_url = merged.pdf_url || convertImageUrl(item.file_url);
        merged.date = merged.date || (item.date ? new Date(item.date) : null);
        merged.order_index = merged.order_index || item.order || 0;
        merged.created_at = new Date(Math.min(merged.created_at.getTime(), new Date(item.published_at || item.created_at || Date.now()).getTime()));
      }

      const aboutItem = await prisma.aboutItems.create({
        data: {
          kind: 'license',
          ...merged,
          is_published: true,
        },
      });
      
      migrated.push(aboutItem);
    } catch (error) {
      console.error(`Error migrating license group ${mergeKey}:`, error);
      errors.push(`License ${mergeKey}: ${error}`);
    }
  }

  migrationLog.push({
    table: 'about_licenses', 
    source_count: sourceData?.length || 0,
    migrated_count: migrated.length,
    errors,
    timestamp: new Date().toISOString(),
  });
}

// Main migration function
async function runMigration() {
  console.log('Starting Supabase to MySQL migration...');
  
  try {
    await migrateAboutDistribution();
    await migrateAboutCertificates();
    await migrateAboutLicenses();
    
    // Save migration log
    const logPath = path.join(process.cwd(), 'migration-log.json');
    await fs.writeFile(logPath, JSON.stringify(migrationLog, null, 2));
    
    console.log('Migration completed! Log saved to migration-log.json');
    console.log('\nSummary:');
    for (const log of migrationLog) {
      console.log(`${log.table}: ${log.migrated_count}/${log.source_count} migrated, ${log.errors.length} errors`);
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export { runMigration };