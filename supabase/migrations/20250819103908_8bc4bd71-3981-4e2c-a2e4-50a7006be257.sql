-- Create About Us tables with multilingual support

-- About Story table
CREATE TABLE public.about_story (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locale TEXT CHECK (locale IN ('en','ru','kk')) NOT NULL,
    title TEXT NOT NULL,
    body_rich JSONB,
    hero_image TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(locale)
);

-- About Values table
CREATE TABLE public.about_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locale TEXT CHECK (locale IN ('en','ru','kk')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon_key TEXT,
    "order" INTEGER DEFAULT 0
);

-- About Timeline table
CREATE TABLE public.about_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    locale TEXT CHECK (locale IN ('en','ru','kk')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    "order" INTEGER DEFAULT 0
);

-- About Team table
CREATE TABLE public.about_team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locale TEXT CHECK (locale IN ('en','ru','kk')) NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    photo TEXT,
    "order" INTEGER DEFAULT 0
);

-- About Partners table (not localized)
CREATE TABLE public.about_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo TEXT,
    website_url TEXT,
    "order" INTEGER DEFAULT 0
);

-- About Certificates table
CREATE TABLE public.about_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locale TEXT CHECK (locale IN ('en','ru','kk')) NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT,
    "date" DATE,
    file_url TEXT,
    image_url TEXT,
    "order" INTEGER DEFAULT 0
);

-- About Compliance table
CREATE TABLE public.about_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locale TEXT CHECK (locale IN ('en','ru','kk')) NOT NULL,
    title TEXT NOT NULL,
    badge_icon TEXT,
    link_url TEXT,
    "order" INTEGER DEFAULT 0
);

-- Enable RLS on all about_* tables
ALTER TABLE public.about_story ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_compliance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "select_public" ON public.about_story FOR SELECT USING (true);
CREATE POLICY "select_public" ON public.about_values FOR SELECT USING (true);
CREATE POLICY "select_public" ON public.about_timeline FOR SELECT USING (true);
CREATE POLICY "select_public" ON public.about_team FOR SELECT USING (true);
CREATE POLICY "select_public" ON public.about_partners FOR SELECT USING (true);
CREATE POLICY "select_public" ON public.about_certificates FOR SELECT USING (true);
CREATE POLICY "select_public" ON public.about_compliance FOR SELECT USING (true);

-- RLS Policies for authenticated write access
CREATE POLICY "write_authenticated" ON public.about_story FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.about_story FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.about_story FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "write_authenticated" ON public.about_values FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.about_values FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.about_values FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "write_authenticated" ON public.about_timeline FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.about_timeline FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.about_timeline FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "write_authenticated" ON public.about_team FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.about_team FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.about_team FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "write_authenticated" ON public.about_partners FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.about_partners FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.about_partners FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "write_authenticated" ON public.about_certificates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.about_certificates FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.about_certificates FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "write_authenticated" ON public.about_compliance FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "update_authenticated" ON public.about_compliance FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "delete_authenticated" ON public.about_compliance FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('docs', 'docs', true);

-- Storage policies for public read access
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id IN ('images', 'docs'));

-- Storage policies for authenticated write access  
CREATE POLICY "Authenticated write access images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'docs' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated update access images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated update access docs" ON storage.objects FOR UPDATE USING (bucket_id = 'docs' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete access images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete access docs" ON storage.objects FOR DELETE USING (bucket_id = 'docs' AND auth.role() = 'authenticated');

-- Seed data for About Story (English)
INSERT INTO public.about_story (locale, title, body_rich, updated_at) VALUES 
('en', 'About Marine Support Services', '{"blocks":[{"type":"paragraph","data":{"text":"Marine Support Services is a reliable supplier of equipment and spares from leading European manufacturers for Kazakhstan projects. We provide integrated solutions from supply to installation and commissioning."}},{"type":"paragraph","data":{"text":"Based in Aktau, we serve the industrial sector across Kazakhstan with high-quality equipment, expert installation, and comprehensive commissioning services. Our mission is to deliver reliable, efficient solutions that meet the demanding requirements of industrial projects across Kazakhstan and the Caspian Sea region."}}]}', now()),
('ru', 'О компании Marine Support Services', '{"blocks":[{"type":"paragraph","data":{"text":"Marine Support Services - надежный поставщик оборудования и запчастей от ведущих европейских производителей для проектов в Казахстане. Мы предоставляем интегрированные решения от поставки до установки и пуско-наладки."}},{"type":"paragraph","data":{"text":"Базируясь в Актау, мы обслуживаем промышленный сектор по всему Казахстану высококачественным оборудованием, экспертной установкой и комплексными услугами по пуско-наладке. Наша миссия - предоставлять надежные, эффективные решения, отвечающие требованиям промышленных проектов в Казахстане и регионе Каспийского моря."}}]}', now()),
('kk', 'Marine Support Services туралы', '{"blocks":[{"type":"paragraph","data":{"text":"Marine Support Services - Қазақстан жобалары үшін жетекші еуропалық өндірушілерден жабдықтар мен қосалқы бөлшектердің сенімді жеткізушісі. Біз жеткізуден орнатуға және іске қосуға дейінгі интеграцияланған шешімдерді ұсынамыз."}},{"type":"paragraph","data":{"text":"Ақтауда орналасып, біз Қазақстан бойынша өнеркәсіп секторына жоғары сапалы жабдықтармен, сарапшы орнатумен және кешенді іске қосу қызметтерімен қызмет көрсетеміз. Біздің миссиямыз - Қазақстан мен Каспий теңізі аймағындағы өнеркәсіптік жобалардың талаптарына сәйкес келетін сенімді, тиімді шешімдерді жеткізу."}}]}', now());

-- Seed data for About Values
INSERT INTO public.about_values (locale, title, description, icon_key, "order") VALUES 
('en', 'Quality Assurance', 'We partner only with certified European manufacturers to ensure the highest quality standards for all equipment and spare parts.', 'shield-check', 1),
('en', 'Expert Installation', 'Our certified technicians provide professional installation and commissioning services with comprehensive testing and documentation.', 'wrench', 2),
('en', 'Reliable Supply Chain', 'Established partnerships with leading European suppliers ensure timely delivery and authentic products for your projects.', 'truck', 3),
('en', 'Local Expertise', 'Deep understanding of Kazakhstan industrial requirements and regulatory compliance for seamless project execution.', 'map-pin', 4),
('ru', 'Гарантия качества', 'Мы сотрудничаем только с сертифицированными европейскими производителями для обеспечения высочайших стандартов качества всего оборудования и запчастей.', 'shield-check', 1),
('ru', 'Экспертная установка', 'Наши сертифицированные технические специалисты предоставляют профессиональные услуги по установке и пуско-наладке с комплексным тестированием и документацией.', 'wrench', 2),
('ru', 'Надежная цепочка поставок', 'Установленные партнерские отношения с ведущими европейскими поставщиками обеспечивают своевременную доставку и подлинные продукты для ваших проектов.', 'truck', 3),
('ru', 'Местная экспертиза', 'Глубокое понимание промышленных требований Казахстана и соответствия нормативным требованиям для бесшовного выполнения проектов.', 'map-pin', 4),
('kk', 'Сапа кепілдігі', 'Біз барлық жабдықтар мен қосалқы бөлшектердің ең жоғары сапа стандарттарын қамтамасыз ету үшін тек сертификатталған еуропалық өндірушілермен ғана серіктестік жасаймыз.', 'shield-check', 1),
('kk', 'Сарапшы орнату', 'Біздің сертификатталған техникалық мамандар кешенді тестілеу және құжаттамамен кәсіби орнату және іске қосу қызметтерін ұсынады.', 'wrench', 2),
('kk', 'Сенімді жеткізу тізбегі', 'Жетекші еуропалық жеткізушілермен орнатылған серіктестік қарым-қатынастар сіздің жобаларыңыз үшін уақтылы жеткізу және түпнұсқа өнімдерді қамтамасыз етеді.', 'truck', 3),
('kk', 'Жергілікті сараптама', 'Жобаны үздіксіз орындау үшін Қазақстанның өнеркәсіптік талаптары мен нормативтік сәйкестікті терең түсіну.', 'map-pin', 4);

-- Seed data for About Timeline
INSERT INTO public.about_timeline (year, locale, title, description, "order") VALUES 
(2008, 'en', 'Company Foundation', 'Marine Support Services was established in Aktau to serve the growing industrial sector in Kazakhstan with European quality equipment.', 1),
(2015, 'en', 'Partnership Expansion', 'Formed strategic partnerships with leading European manufacturers, expanding our product portfolio and technical capabilities.', 2),
(2020, 'en', 'Service Integration', 'Launched comprehensive installation and commissioning services, becoming a full-cycle solution provider for industrial projects.', 3),
(2008, 'ru', 'Основание компании', 'Marine Support Services была основана в Актау для обслуживания растущего промышленного сектора в Казахстане европейским качественным оборудованием.', 1),
(2015, 'ru', 'Расширение партнерства', 'Сформированы стратегические партнерские отношения с ведущими европейскими производителями, расширяя наш продуктовый портфель и технические возможности.', 2),
(2020, 'ru', 'Интеграция сервиса', 'Запущены комплексные услуги по установке и пуско-наладке, став поставщиком полного цикла решений для промышленных проектов.', 3),
(2008, 'kk', 'Компания құрылуы', 'Marine Support Services Ақтауда Қазақстандағы өсіп келе жатқан өнеркәсіп секторын еуропалық сапалы жабдықтармен қамтамасыз ету үшін құрылды.', 1),
(2015, 'kk', 'Серіктестікті кеңейту', 'Жетекші еуропалық өндірушілермен стратегиялық серіктестік қалыптастырылып, біздің өнім портфелімізді және техникалық мүмкіндіктерімізді кеңейттік.', 2),
(2020, 'kk', 'Қызмет интеграциясы', 'Кешенді орнату және іске қосу қызметтері іске қосылып, өнеркәсіптік жобалар үшін толық циклды шешім жеткізушісі болдық.', 3);

-- Seed data for About Team
INSERT INTO public.about_team (locale, name, role, bio, "order") VALUES 
('en', 'Alexey Petrov', 'General Director', 'Over 15 years of experience in industrial equipment supply and project management. Leads strategic partnerships with European manufacturers.', 1),
('en', 'Marina Kuznetsova', 'Technical Director', 'Certified engineer with expertise in commissioning and technical support. Oversees all installation and testing operations.', 2),
('en', 'Dmitry Volkov', 'Supply Chain Manager', 'Manages procurement and logistics operations, ensuring timely delivery of equipment and spare parts from European suppliers.', 3),
('ru', 'Алексей Петров', 'Генеральный директор', 'Более 15 лет опыта в поставке промышленного оборудования и управлении проектами. Руководит стратегическими партнерствами с европейскими производителями.', 1),
('ru', 'Марина Кузнецова', 'Технический директор', 'Сертифицированный инженер с экспертизой в пуско-наладке и технической поддержке. Курирует все операции по установке и тестированию.', 2),
('ru', 'Дмитрий Волков', 'Менеджер по поставкам', 'Управляет операциями по закупкам и логистике, обеспечивая своевременную доставку оборудования и запчастей от европейских поставщиков.', 3),
('kk', 'Алексей Петров', 'Бас директор', 'Өнеркәсіптік жабдықтарды жеткізу және жобаларды басқару бойынша 15 жылдан астам тәжірибе. Еуропалық өндірушілермен стратегиялық серіктестікті басқарады.', 1),
('kk', 'Марина Кузнецова', 'Техникалық директор', 'Іске қосу және техникалық қолдау бойынша сараптамасы бар сертификатталған инженер. Барлық орнату және тестілеу операцияларын қадағалайды.', 2),
('kk', 'Дмитрий Волков', 'Жеткізу тізбегінің менеджері', 'Сатып алу және логистика операцияларын басқарады, еуропалық жеткізушілерден жабдықтар мен қосалқы бөлшектердің уақтылы жеткізілуін қамтамасыз етеді.', 3);

-- Seed data for About Partners (not localized)
INSERT INTO public.about_partners (name, logo, website_url, "order") VALUES 
('Siemens AG', '/placeholder-logo-siemens.png', 'https://siemens.com', 1),
('ABB Group', '/placeholder-logo-abb.png', 'https://abb.com', 2),
('Schneider Electric', '/placeholder-logo-schneider.png', 'https://schneider-electric.com', 3),
('Danfoss', '/placeholder-logo-danfoss.png', 'https://danfoss.com', 4),
('Wilo Group', '/placeholder-logo-wilo.png', 'https://wilo.com', 5);

-- Seed data for About Certificates
INSERT INTO public.about_certificates (locale, title, issuer, "date", image_url, "order") VALUES 
('en', 'ISO 9001:2015 Quality Management', 'International Organization for Standardization', '2023-06-15', '/placeholder-cert-iso9001.jpg', 1),
('en', 'Authorized Distributor Certificate', 'Siemens AG', '2023-01-10', '/placeholder-cert-siemens.jpg', 2),
('en', 'Technical Competency Certification', 'ABB Group', '2022-11-20', '/placeholder-cert-abb.jpg', 3),
('ru', 'ISO 9001:2015 Управление качеством', 'Международная организация по стандартизации', '2023-06-15', '/placeholder-cert-iso9001.jpg', 1),
('ru', 'Сертификат авторизованного дистрибьютора', 'Siemens AG', '2023-01-10', '/placeholder-cert-siemens.jpg', 2),
('ru', 'Сертификация технической компетентности', 'ABB Group', '2022-11-20', '/placeholder-cert-abb.jpg', 3),
('kk', 'ISO 9001:2015 Сапа менеджменті', 'Халықаралық стандарттау ұйымы', '2023-06-15', '/placeholder-cert-iso9001.jpg', 1),
('kk', 'Авторландырылған дистрибьютор сертификаты', 'Siemens AG', '2023-01-10', '/placeholder-cert-siemens.jpg', 2),
('kk', 'Техникалық құзыреттілік сертификациясы', 'ABB Group', '2022-11-20', '/placeholder-cert-abb.jpg', 3);

-- Seed data for About Compliance
INSERT INTO public.about_compliance (locale, title, badge_icon, link_url, "order") VALUES 
('en', 'ISO 9001:2015 Certified', 'iso-9001', 'https://iso.org/iso-9001-quality-management.html', 1),
('en', 'Kazakhstan Industrial Safety Compliance', 'safety-helmet', 'https://gov.kz/industrial-safety', 2),
('ru', 'Сертифицирован по ISO 9001:2015', 'iso-9001', 'https://iso.org/iso-9001-quality-management.html', 1),
('ru', 'Соответствие промышленной безопасности Казахстана', 'safety-helmet', 'https://gov.kz/industrial-safety', 2),
('kk', 'ISO 9001:2015 сертификатталған', 'iso-9001', 'https://iso.org/iso-9001-quality-management.html', 1),
('kk', 'Қазақстанның өнеркәсіптік қауіпсіздік сәйкестігі', 'safety-helmet', 'https://gov.kz/industrial-safety', 2);