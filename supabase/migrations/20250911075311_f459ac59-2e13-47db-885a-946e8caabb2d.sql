-- Create distribution items table
CREATE TABLE public.about_distribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text,
  title_ru text,
  title_kk text,
  description_en text,
  description_ru text,
  description_kk text,
  image_url text,
  file_url text,
  order_index integer DEFAULT 0,
  status text DEFAULT 'published'::text,
  published_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_distribution ENABLE ROW LEVEL SECURITY;

-- Create policies for distribution
CREATE POLICY "Distribution items are viewable by everyone" 
ON public.about_distribution 
FOR SELECT 
USING ((status = 'published'::text) OR (status IS NULL));

CREATE POLICY "Authenticated users can modify distribution items" 
ON public.about_distribution 
FOR ALL 
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);

-- Update existing licenses table to match new requirements
ALTER TABLE public.about_licenses 
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS title_ru text, 
ADD COLUMN IF NOT EXISTS title_kk text,
ADD COLUMN IF NOT EXISTS description_en text,
ADD COLUMN IF NOT EXISTS description_ru text,
ADD COLUMN IF NOT EXISTS description_kk text,
ADD COLUMN IF NOT EXISTS issuer_en text,
ADD COLUMN IF NOT EXISTS issuer_ru text,
ADD COLUMN IF NOT EXISTS issuer_kk text;

-- Update certificates table to support multilingual fields
ALTER TABLE public.about_certificates 
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS title_ru text,
ADD COLUMN IF NOT EXISTS title_kk text,
ADD COLUMN IF NOT EXISTS description_en text,
ADD COLUMN IF NOT EXISTS description_ru text,
ADD COLUMN IF NOT EXISTS description_kk text,
ADD COLUMN IF NOT EXISTS issuer_en text,
ADD COLUMN IF NOT EXISTS issuer_ru text,
ADD COLUMN IF NOT EXISTS issuer_kk text;

-- Add triggers for updated_at
CREATE TRIGGER update_about_distribution_updated_at
  BEFORE UPDATE ON public.about_distribution
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();