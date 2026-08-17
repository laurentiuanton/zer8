-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Allow public read access to product images
CREATE POLICY "Public access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Allow authenticated uploads to product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
