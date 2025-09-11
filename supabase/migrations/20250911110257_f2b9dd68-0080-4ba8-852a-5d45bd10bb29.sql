-- Create enum for about item kinds
CREATE TYPE about_item_kind AS ENUM ('distribution', 'certificate', 'license');

-- Create unified about_items table
CREATE TABLE about_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind about_item_kind NOT NULL,
  title_ru TEXT,
  title_kz TEXT,
  title_en TEXT,
  description_ru TEXT,
  description_kz TEXT,
  description_en TEXT,
  issuer_ru TEXT,
  issuer_kz TEXT,
  issuer_en TEXT,
  date DATE,
  image_url TEXT,
  pdf_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE about_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "About items are viewable by everyone"
ON about_items FOR SELECT
USING (is_published = true);

CREATE POLICY "Authenticated users can manage about items"
ON about_items FOR ALL
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);

-- Create trigger for updated_at
CREATE TRIGGER update_about_items_updated_at
  BEFORE UPDATE ON about_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing data from about_distribution
INSERT INTO about_items (
  kind, title_ru, title_kz, title_en, description_ru, description_kz, description_en,
  image_url, pdf_url, is_published, order_index, created_at, updated_at
)
SELECT 
  'distribution'::about_item_kind,
  title_ru, title_kk, title_en, description_ru, description_kk, description_en,
  image_url, file_url, (status = 'published'), order_index, created_at, updated_at
FROM about_distribution
WHERE status = 'published' OR status IS NULL;

-- Migrate existing data from about_certificates  
INSERT INTO about_items (
  kind, title_ru, title_kz, title_en, description_ru, description_kz, description_en,
  issuer_ru, issuer_kz, issuer_en, date, image_url, pdf_url, is_published, order_index
)
SELECT 
  'certificate'::about_item_kind,
  title_ru, title_kk, title_en, description_ru, description_kk, description_en,
  issuer_ru, issuer_kk, issuer_en, date, image_url, file_url, (status = 'published'), order_index
FROM about_certificates
WHERE status = 'published' OR status IS NULL;

-- Migrate existing data from about_licenses
INSERT INTO about_items (
  kind, title_ru, title_kz, title_en, description_ru, description_kz, description_en,
  issuer_ru, issuer_kz, issuer_en, date, image_url, pdf_url, is_published, order_index
)
SELECT 
  'license'::about_item_kind,
  title_ru, title_kk, title_en, description_ru, description_kk, description_en,
  issuer_ru, issuer_kk, issuer_en, date, image_url, file_url, (status = 'published'), order_index
FROM about_licenses
WHERE status = 'published' OR status IS NULL;