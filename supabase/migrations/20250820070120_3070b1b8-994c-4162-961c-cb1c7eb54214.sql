-- Seed demo compliance data if table is empty
DO $$
BEGIN
  -- Only insert if the table is empty
  IF NOT EXISTS (SELECT 1 FROM about_compliance LIMIT 1) THEN
    
    -- Insert demo compliance records for English
    INSERT INTO about_compliance (locale, title, badge_icon, link_url, "order") VALUES
    ('en', 'ISO 9001:2015 Certified', 'Award', 'https://iso.org/iso-9001-quality-management.html', 1),
    ('en', 'Kazakhstan Industrial Safety Compliance', 'Shield', 'https://gov.kz/industrial-safety', 2),
    ('en', 'Environmental Management ISO 14001', 'Leaf', 'https://iso.org/iso-14001-environmental-management.html', 3),
    ('en', 'OHSAS 18001 Safety Standards', 'HardHat', NULL, 4);
    
    -- Insert demo compliance records for Russian
    INSERT INTO about_compliance (locale, title, badge_icon, link_url, "order") VALUES
    ('ru', 'Сертификат ISO 9001:2015', 'Award', 'https://iso.org/iso-9001-quality-management.html', 1),
    ('ru', 'Соответствие промышленной безопасности РК', 'Shield', 'https://gov.kz/industrial-safety', 2),
    ('ru', 'Экологический менеджмент ISO 14001', 'Leaf', 'https://iso.org/iso-14001-environmental-management.html', 3),
    ('ru', 'Стандарты безопасности OHSAS 18001', 'HardHat', NULL, 4);
    
    -- Insert demo compliance records for Kazakh
    INSERT INTO about_compliance (locale, title, badge_icon, link_url, "order") VALUES
    ('kk', 'ISO 9001:2015 сертификаты', 'Award', 'https://iso.org/iso-9001-quality-management.html', 1),
    ('kk', 'ҚР өнеркәсіптік қауіпсіздік сәйкестігі', 'Shield', 'https://gov.kz/industrial-safety', 2),
    ('kk', 'Экологиялық басқару ISO 14001', 'Leaf', 'https://iso.org/iso-14001-environmental-management.html', 3),
    ('kk', 'OHSAS 18001 қауіпсіздік стандарттары', 'HardHat', NULL, 4);
    
  END IF;
END $$;