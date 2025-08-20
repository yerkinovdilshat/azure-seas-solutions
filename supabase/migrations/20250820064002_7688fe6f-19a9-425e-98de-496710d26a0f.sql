-- Add missing fields to catalog_products table
ALTER TABLE public.catalog_products 
ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('production', 'supply')) NOT NULL DEFAULT 'supply',
ADD COLUMN IF NOT EXISTS is_ctkz boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS tags text[] NULL;

-- Create constraint function to ensure is_ctkz can only be true when type='production'
CREATE OR REPLACE FUNCTION validate_ctkz_constraint()
RETURNS TRIGGER AS $$
BEGIN
    -- If is_ctkz is true but type is not 'production', force is_ctkz to false
    IF NEW.is_ctkz = true AND NEW.type != 'production' THEN
        NEW.is_ctkz = false;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce the constraint
DROP TRIGGER IF EXISTS enforce_ctkz_constraint ON public.catalog_products;
CREATE TRIGGER enforce_ctkz_constraint
    BEFORE INSERT OR UPDATE ON public.catalog_products
    FOR EACH ROW
    EXECUTE FUNCTION validate_ctkz_constraint();

-- Set default values for existing rows
UPDATE public.catalog_products 
SET type = 'supply', is_ctkz = false 
WHERE type IS NULL OR is_ctkz IS NULL;