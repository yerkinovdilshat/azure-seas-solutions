-- Create site_settings table for homepage content management
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Hero background and layout
  hero_bg_url text,
  hero_overlay_opacity numeric DEFAULT 0.45 CHECK (hero_overlay_opacity >= 0 AND hero_overlay_opacity <= 1),
  hero_min_height_vh numeric DEFAULT 88,
  hero_top_padding_px numeric DEFAULT 140,
  content_max_width_px numeric DEFAULT 1100,
  
  -- Hero content in Russian
  hero_title_ru text,
  hero_subtitle_ru text,
  cta1_text_ru text,
  cta1_link text,
  cta2_text_ru text,
  cta2_link text,
  
  -- Hero content in English
  hero_title_en text,
  hero_subtitle_en text,
  cta1_text_en text,
  cta2_text_en text,
  
  -- Hero content in Kazakh
  hero_title_kk text,
  hero_subtitle_kk text,
  cta1_text_kk text,
  cta2_text_kk text,
  
  -- Default locale
  locale_default text DEFAULT 'en' CHECK (locale_default IN ('ru', 'en', 'kk')),
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify site settings" 
ON public.site_settings 
FOR ALL 
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);

-- Create user roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Update site_settings policies to require admin role for modifications
DROP POLICY "Only authenticated users can modify site settings" ON public.site_settings;

CREATE POLICY "Only admins can modify site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete site settings"
ON public.site_settings
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Insert default settings
INSERT INTO public.site_settings (
  hero_bg_url,
  hero_overlay_opacity,
  hero_min_height_vh,
  hero_top_padding_px,
  content_max_width_px,
  hero_title_ru,
  hero_subtitle_ru,
  cta1_text_ru,
  cta1_link,
  cta2_text_ru,
  cta2_link,
  hero_title_en,
  hero_subtitle_en,
  cta1_text_en,
  cta2_text_en,
  hero_title_kk,
  hero_subtitle_kk,
  cta1_text_kk,
  cta2_text_kk,
  locale_default
) VALUES (
  '/hero-caspian-offshore.jpg',
  0.45,
  88,
  140,
  1100,
  'Профессиональные решения для нефтегазовой отрасли Казахстана',
  'Поставка оборудования, техническое обслуживание и промышленные решения мирового класса',
  'Изучить услуги',
  '/services',
  'Запросить предложение',
  '/contacts',
  'Professional Solutions for Kazakhstan''s Oil & Gas Industry',
  'World-class equipment supply, technical maintenance, and industrial solutions',
  'Explore Services',
  'Request Quote',
  'Қазақстанның мұнай-газ өнеркәсібі үшін кәсіби шешімдер',
  'Әлемдік деңгейдегі жабдықтарды жеткізу, техникалық қызмет көрсету және өнеркәсіптік шешімдер',
  'Қызметтерді зерттеу',
  'Ұсыныс сұрау',
  'en'
);

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();