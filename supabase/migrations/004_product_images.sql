-- Product Images (using Supabase Storage public URLs)
-- Replace YOUR_PROJECT_REF with your actual Supabase project reference

INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES
  -- Tricou Negru
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-negru'),
   'https://tavmtoujfgwuvnwxhsut.supabase.co/storage/v1/object/public/products/tricou-og-nicu-negru-1.jpg',
   'Tricou OG Nicu Negru - fata',
   0),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-negru'),
   'https://tavmtoujfgwuvnwxhsut.supabase.co/storage/v1/object/public/products/tricou-og-nicu-negru-2.jpg',
   'Tricou OG Nicu Negru - spate',
   1),
  -- Tricou Alb
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-alb'),
   'https://tavmtoujfgwuvnwxhsut.supabase.co/storage/v1/object/public/products/tricou-og-nicu-alb-1.jpg',
   'Tricou OG Nicu Alb - fata',
   0),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-alb'),
   'https://tavmtoujfgwuvnwxhsut.supabase.co/storage/v1/object/public/products/tricou-og-nicu-alb-2.jpg',
   'Tricou OG Nicu Alb - spate',
   1);
