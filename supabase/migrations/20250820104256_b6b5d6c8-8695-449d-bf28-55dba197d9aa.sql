-- Force update the project slug to fix the routing issue
UPDATE projects 
SET slug = 'ncoc-project' 
WHERE id = '1f2cedfc-cd0d-4bfb-84ea-65a25b668fd0';