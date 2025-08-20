-- Add status and published_at fields to tables that don't have them
DO $$ 
BEGIN
  -- Add status to about_certificates if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_certificates' AND column_name = 'status') THEN
    ALTER TABLE public.about_certificates ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_certificates' AND column_name = 'published_at') THEN
    ALTER TABLE public.about_certificates ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to about_compliance if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_compliance' AND column_name = 'status') THEN
    ALTER TABLE public.about_compliance ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_compliance' AND column_name = 'published_at') THEN
    ALTER TABLE public.about_compliance ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to about_partners if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_partners' AND column_name = 'status') THEN
    ALTER TABLE public.about_partners ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_partners' AND column_name = 'published_at') THEN
    ALTER TABLE public.about_partners ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to about_story if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_story' AND column_name = 'status') THEN
    ALTER TABLE public.about_story ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_story' AND column_name = 'published_at') THEN
    ALTER TABLE public.about_story ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to about_team if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_team' AND column_name = 'status') THEN
    ALTER TABLE public.about_team ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_team' AND column_name = 'published_at') THEN
    ALTER TABLE public.about_team ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to about_timeline if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_timeline' AND column_name = 'status') THEN
    ALTER TABLE public.about_timeline ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_timeline' AND column_name = 'published_at') THEN
    ALTER TABLE public.about_timeline ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to about_values if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_values' AND column_name = 'status') THEN
    ALTER TABLE public.about_values ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_values' AND column_name = 'published_at') THEN
    ALTER TABLE public.about_values ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to catalog_categories if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_categories' AND column_name = 'status') THEN
    ALTER TABLE public.catalog_categories ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_categories' AND column_name = 'published_at') THEN
    ALTER TABLE public.catalog_categories ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add is_featured to catalog_categories if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_categories' AND column_name = 'is_featured') THEN
    ALTER TABLE public.catalog_categories ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;

  -- Add status to catalog_products if not exists (already has is_featured)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_products' AND column_name = 'status') THEN
    ALTER TABLE public.catalog_products ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_products' AND column_name = 'published_at') THEN
    ALTER TABLE public.catalog_products ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Replace is_published with status in news table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'is_published') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'status') THEN
    -- Migrate is_published to status
    ALTER TABLE public.news ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
    UPDATE public.news SET status = CASE WHEN is_published = true THEN 'published' ELSE 'draft' END;
    ALTER TABLE public.news DROP COLUMN is_published;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'status') THEN
    ALTER TABLE public.news ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;

  -- Add is_featured to news if not exists (news doesn't have it)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'is_featured') THEN
    ALTER TABLE public.news ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;

  -- Add status to projects if not exists (already has is_featured)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'status') THEN
    ALTER TABLE public.projects ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'published_at') THEN
    ALTER TABLE public.projects ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to services if not exists (already has is_featured)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'status') THEN
    ALTER TABLE public.services ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'published_at') THEN
    ALTER TABLE public.services ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add status to contacts if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'status') THEN
    ALTER TABLE public.contacts ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'published_at') THEN
    ALTER TABLE public.contacts ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;

-- Create contact_requests table if not exists
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  meta JSONB NULL
);

-- Enable RLS on contact_requests
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Add unique constraints for slug per locale if not exists
DO $$ 
BEGIN
  -- Services slug unique per locale
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_locale_slug_unique') THEN
    ALTER TABLE public.services ADD CONSTRAINT services_locale_slug_unique UNIQUE (locale, slug);
  END IF;

  -- Catalog products slug unique per locale
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'catalog_products_locale_slug_unique') THEN
    ALTER TABLE public.catalog_products ADD CONSTRAINT catalog_products_locale_slug_unique UNIQUE (locale, slug);
  END IF;

  -- Projects slug unique per locale
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_locale_slug_unique') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_locale_slug_unique UNIQUE (locale, slug);
  END IF;

  -- News slug unique per locale
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'news_locale_slug_unique') THEN
    ALTER TABLE public.news ADD CONSTRAINT news_locale_slug_unique UNIQUE (locale, slug);
  END IF;

  -- Catalog categories slug unique per locale
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'catalog_categories_locale_slug_unique') THEN
    ALTER TABLE public.catalog_categories ADD CONSTRAINT catalog_categories_locale_slug_unique UNIQUE (locale, slug);
  END IF;
END $$;

-- Update RLS policies to filter by status for public access
-- Drop existing select_public policies and recreate with status filter

-- About certificates
DROP POLICY IF EXISTS "select_public" ON public.about_certificates;
CREATE POLICY "select_public" ON public.about_certificates 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- About compliance  
DROP POLICY IF EXISTS "select_public" ON public.about_compliance;
CREATE POLICY "select_public" ON public.about_compliance 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- About partners
DROP POLICY IF EXISTS "select_public" ON public.about_partners;
CREATE POLICY "select_public" ON public.about_partners 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- About story
DROP POLICY IF EXISTS "select_public" ON public.about_story;
CREATE POLICY "select_public" ON public.about_story 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- About team
DROP POLICY IF EXISTS "select_public" ON public.about_team;
CREATE POLICY "select_public" ON public.about_team 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- About timeline
DROP POLICY IF EXISTS "select_public" ON public.about_timeline;
CREATE POLICY "select_public" ON public.about_timeline 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- About values
DROP POLICY IF EXISTS "select_public" ON public.about_values;
CREATE POLICY "select_public" ON public.about_values 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- Catalog categories
DROP POLICY IF EXISTS "select_public" ON public.catalog_categories;
CREATE POLICY "select_public" ON public.catalog_categories 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- Catalog products
DROP POLICY IF EXISTS "select_public" ON public.catalog_products;
CREATE POLICY "select_public" ON public.catalog_products 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- Contacts
DROP POLICY IF EXISTS "select_public" ON public.contacts;
CREATE POLICY "select_public" ON public.contacts 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- News 
DROP POLICY IF EXISTS "select_public" ON public.news;
CREATE POLICY "select_public" ON public.news 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- Projects
DROP POLICY IF EXISTS "select_public" ON public.projects;
CREATE POLICY "select_public" ON public.projects 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- Services
DROP POLICY IF EXISTS "select_public" ON public.services;
CREATE POLICY "select_public" ON public.services 
FOR SELECT USING (status = 'published' OR status IS NULL);

-- Contact requests policies
CREATE POLICY "select_authenticated" ON public.contact_requests 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "write_public" ON public.contact_requests 
FOR INSERT WITH CHECK (true);

-- Storage policies for images bucket
CREATE POLICY "public_read_images" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "authenticated_write_images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_images" ON storage.objects 
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Storage policies for docs bucket
CREATE POLICY "public_read_docs" ON storage.objects 
FOR SELECT USING (bucket_id = 'docs');

CREATE POLICY "authenticated_write_docs" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'docs' AND auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_docs" ON storage.objects 
FOR UPDATE USING (bucket_id = 'docs' AND auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_docs" ON storage.objects 
FOR DELETE USING (bucket_id = 'docs' AND auth.role() = 'authenticated');