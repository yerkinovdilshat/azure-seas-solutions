-- Create additional tables for the admin dashboard

-- News table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru', 'kk')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content_rich JSONB,
  featured_image TEXT,
  gallery_images TEXT[],
  video_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru', 'kk')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content_rich JSONB,
  featured_image TEXT,
  gallery_images TEXT[],
  video_url TEXT,
  client_name TEXT,
  project_date DATE,
  project_location TEXT,
  project_status TEXT DEFAULT 'completed',
  is_featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru', 'kk')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content_rich JSONB,
  featured_image TEXT,
  gallery_images TEXT[],
  icon_key TEXT,
  is_featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Catalog categories table
CREATE TABLE public.catalog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru', 'kk')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.catalog_categories(id) ON DELETE CASCADE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Catalog products table
CREATE TABLE public.catalog_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru', 'kk')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content_rich JSONB,
  featured_image TEXT,
  gallery_images TEXT[],
  pdf_files TEXT[],
  category_id UUID REFERENCES public.catalog_categories(id) ON DELETE SET NULL,
  sku TEXT,
  manufacturer TEXT,
  specifications JSONB,
  is_featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contacts table (single record per locale)
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru', 'kk')) UNIQUE,
  company_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  working_hours TEXT NOT NULL,
  map_link TEXT,
  additional_info JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for news
CREATE POLICY "select_public" ON public.news FOR SELECT USING (true);
CREATE POLICY "write_authenticated" ON public.news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.news FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.news FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for projects
CREATE POLICY "select_public" ON public.projects FOR SELECT USING (true);
CREATE POLICY "write_authenticated" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.projects FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for services
CREATE POLICY "select_public" ON public.services FOR SELECT USING (true);
CREATE POLICY "write_authenticated" ON public.services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.services FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.services FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for catalog_categories
CREATE POLICY "select_public" ON public.catalog_categories FOR SELECT USING (true);
CREATE POLICY "write_authenticated" ON public.catalog_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.catalog_categories FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.catalog_categories FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for catalog_products
CREATE POLICY "select_public" ON public.catalog_products FOR SELECT USING (true);
CREATE POLICY "write_authenticated" ON public.catalog_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.catalog_products FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.catalog_products FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for contacts
CREATE POLICY "select_public" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "write_authenticated" ON public.contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.contacts FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.contacts FOR DELETE USING (auth.role() = 'authenticated');

-- Create update triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalog_categories_updated_at
  BEFORE UPDATE ON public.catalog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalog_products_updated_at
  BEFORE UPDATE ON public.catalog_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data for contacts
INSERT INTO public.contacts (locale, company_name, address, phone, email, working_hours, map_link, additional_info) VALUES
('en', 'Marine Support Services', 'Mangystau Region, Aktau, Industrial Zone 2, Building 25', '+7 700 555 76 33', 'info@marines.kz', 'Monday - Friday: 9:00 AM - 6:00 PM', 'https://maps.google.com', '{"fax": "", "emergency_phone": "+7 700 555 76 34"}'),
('ru', 'Marine Support Services', 'Мангистауская область, г. Актау, Промышленная зона 2, здание 25', '+7 700 555 76 33', 'info@marines.kz', 'Понедельник - Пятница: 9:00 - 18:00', 'https://maps.google.com', '{"fax": "", "emergency_phone": "+7 700 555 76 34"}'),
('kk', 'Marine Support Services', 'Маңғыстау облысы, Ақтау қ., 2-ші өнеркәсіп аймағы, 25-ғимарат', '+7 700 555 76 33', 'info@marines.kz', 'Дүйсенбі - Жұма: 9:00 - 18:00', 'https://maps.google.com', '{"fax": "", "emergency_phone": "+7 700 555 76 34"}');

-- Seed some sample data for other tables
INSERT INTO public.news (locale, title, slug, excerpt, content_rich, published_at, is_published) VALUES
('en', 'New Equipment Delivery to Tengiz Field', 'new-equipment-delivery-tengiz', 'Marine Support Services successfully delivered critical equipment to Tengiz oil field.', '{"blocks": [{"type": "paragraph", "data": {"text": "Marine Support Services has successfully completed the delivery of specialized equipment to the Tengiz oil field, demonstrating our commitment to reliable supply chain solutions."}}]}', now(), true),
('ru', 'Поставка нового оборудования на месторождение Тенгиз', 'new-equipment-delivery-tengiz', 'Marine Support Services успешно поставила критически важное оборудование на нефтяное месторождение Тенгиз.', '{"blocks": [{"type": "paragraph", "data": {"text": "Marine Support Services успешно завершила поставку специализированного оборудования на нефтяное месторождение Тенгиз, демонстрируя нашу приверженность надежным решениям цепи поставок."}}]}', now(), true),
('kk', 'Теңіз кенорнына жаңа жабдықтарды жеткізу', 'new-equipment-delivery-tengiz', 'Marine Support Services Теңіз мұнай кенорнына маңызды жабдықтарды сәтті жеткізді.', '{"blocks": [{"type": "paragraph", "data": {"text": "Marine Support Services Теңіз мұнай кенорнына мамандандырылған жабдықтарды сәтті жеткізуді аяқтады, бұл біздің сенімді жеткізу тізбегі шешімдеріне деген міндеттемемізді көрсетеді."}}]}', now(), true);

INSERT INTO public.services (locale, title, slug, description, content_rich, icon_key) VALUES
('en', 'Equipment Supply', 'equipment-supply', 'Comprehensive equipment supply from European manufacturers', '{"blocks": [{"type": "paragraph", "data": {"text": "We provide comprehensive equipment supply services from leading European manufacturers for Kazakhstan projects."}}]}', 'package'),
('ru', 'Поставка оборудования', 'equipment-supply', 'Комплексная поставка оборудования от европейских производителей', '{"blocks": [{"type": "paragraph", "data": {"text": "Мы предоставляем комплексные услуги по поставке оборудования от ведущих европейских производителей для проектов в Казахстане."}}]}', 'package'),
('kk', 'Жабдық жеткізу', 'equipment-supply', 'Еуропалық өндірушілерден жан-жақты жабдық жеткізу', '{"blocks": [{"type": "paragraph", "data": {"text": "Біз Қазақстандағы жобалар үшін жетекші еуропалық өндірушілерден жан-жақты жабдық жеткізу қызметтерін ұсынамыз."}}]}', 'package');