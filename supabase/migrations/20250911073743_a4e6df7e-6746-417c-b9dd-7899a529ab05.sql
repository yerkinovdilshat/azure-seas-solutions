-- Create tables for the new About Us structure

-- About blocks table for general content (General Information and Safety & Quality)
CREATE TABLE public.about_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_key TEXT NOT NULL UNIQUE, -- 'general' or 'safety_quality'
  title_en TEXT,
  title_ru TEXT,
  title_kk TEXT,
  content_en TEXT,
  content_ru TEXT,
  content_kk TEXT,
  gallery_images TEXT[], -- Array of image URLs for Safety & Quality section
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'published'
);

-- Enable RLS for about_blocks
ALTER TABLE public.about_blocks ENABLE ROW LEVEL SECURITY;

-- RLS policies for about_blocks
CREATE POLICY "About blocks are viewable by everyone" 
ON public.about_blocks 
FOR SELECT 
USING ((status = 'published' OR status IS NULL));

CREATE POLICY "Authenticated users can modify about blocks" 
ON public.about_blocks 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Update about_licenses table to match certificates structure
ALTER TABLE public.about_licenses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.about_licenses ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.about_licenses ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.about_licenses ADD COLUMN IF NOT EXISTS description_ru TEXT;
ALTER TABLE public.about_licenses ADD COLUMN IF NOT EXISTS description_kk TEXT;

-- Update RLS policies for about_licenses to match other tables
DROP POLICY IF EXISTS "about_licenses_select_all" ON public.about_licenses;
DROP POLICY IF EXISTS "about_licenses_write_auth" ON public.about_licenses;

CREATE POLICY "select_public" 
ON public.about_licenses 
FOR SELECT 
USING ((status = 'published' OR status IS NULL));

CREATE POLICY "write_authenticated" 
ON public.about_licenses 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "update_authenticated" 
ON public.about_licenses 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "delete_authenticated" 
ON public.about_licenses 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Insert default content for about blocks
INSERT INTO public.about_blocks (block_key, title_en, title_ru, title_kk, content_en, content_ru, content_kk) VALUES
('general', 'General Information', 'Общая информация', 'Жалпы ақпарат', 
 'Our company information will be displayed here.', 
 'Информация о нашей компании будет отображена здесь.',
 'Біздің компания туралы ақпарат осында көрсетіледі.'),
('safety_quality', 'Safety & Quality', 'Безопасность и качество', 'Қауіпсіздік және сапа',
 'Information about our safety and quality standards will be displayed here.',
 'Информация о наших стандартах безопасности и качества будет отображена здесь.',
 'Біздің қауіпсіздік пен сапа стандарттары туралы ақпарат осында көрсетіледі.');

-- Create trigger for updated_at
CREATE TRIGGER update_about_blocks_updated_at
BEFORE UPDATE ON public.about_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();