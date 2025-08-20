-- Create storage buckets for file uploads if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('docs', 'docs', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for images bucket
CREATE POLICY "Public can view images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Create RLS policies for docs bucket
CREATE POLICY "Authenticated users can view docs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'docs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload docs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'docs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update docs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'docs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete docs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'docs' AND auth.role() = 'authenticated');