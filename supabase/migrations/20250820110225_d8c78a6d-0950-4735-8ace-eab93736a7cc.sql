-- Add video_url column to catalog_products table
ALTER TABLE catalog_products ADD COLUMN IF NOT EXISTS video_url TEXT;