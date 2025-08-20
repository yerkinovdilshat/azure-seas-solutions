-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION validate_ctkz_constraint()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If is_ctkz is true but type is not 'production', force is_ctkz to false
    IF NEW.is_ctkz = true AND NEW.type != 'production' THEN
        NEW.is_ctkz = false;
    END IF;
    
    RETURN NEW;
END;
$$;