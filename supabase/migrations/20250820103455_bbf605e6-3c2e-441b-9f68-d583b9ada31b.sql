-- Fix empty slug for catalog product
UPDATE catalog_products 
SET slug = 'products-ct-kz' 
WHERE slug = '' OR slug IS NULL;