-- Fix project slugs to be properly formatted
UPDATE projects 
SET slug = CASE 
  WHEN slug = 'stug' OR slug = '' OR slug IS NULL THEN 'ncoc-project'
  ELSE slug 
END
WHERE slug = 'stug' OR slug = '' OR slug IS NULL;