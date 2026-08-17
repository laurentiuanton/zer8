-- ZER8 Seed Data
-- Migration: 002_seed_data.sql

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Imbracaminte', 'imbracaminte', 'Imbracaminte ZER8', 1),
  ('Tricouri', 'tricouri', 'Tricouri editie limitata', 2);

-- Set parent_id for Tricouri
UPDATE categories
SET parent_id = (SELECT id FROM categories WHERE slug = 'imbracaminte')
WHERE slug = 'tricouri';

-- Products
INSERT INTO products (name, slug, description, price, category_id, stock_quantity, sku) VALUES
  (
    'Tricou "OG Nicu" - Negru',
    'tricou-og-nicu-negru',
    'Tricouri editie limitata, doar 89 de bucati vor exista pana la sfarsitul universului. Fit regular/gangsta, materialul e bumbac ultra premium, printul e realizat prin serigrafie ecologica.',
    229.00,
    (SELECT id FROM categories WHERE slug = 'tricouri'),
    89,
    'OG-NICU-NEG'
  ),
  (
    'Tricou "OG Nicu" - Alb',
    'tricou-og-nicu-alb',
    'Tricouri editie limitata, doar 89 de bucati vor exista pana la sfarsitul universului. Fit regular/gangsta, materialul e bumbac ultra premium, printul e realizat prin serigrafie ecologica.',
    229.00,
    (SELECT id FROM categories WHERE slug = 'tricouri'),
    89,
    'OG-NICU-ALB'
  );

-- Product Variants (Sizes)
INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, options) VALUES
  -- Tricou Negru
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-negru'), 'S', 'OG-NICU-NEG-S', 229.00, 22, '{"size": "S", "color": "negru"}'),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-negru'), 'M', 'OG-NICU-NEG-M', 229.00, 22, '{"size": "M", "color": "negru"}'),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-negru'), 'L', 'OG-NICU-NEG-L', 229.00, 23, '{"size": "L", "color": "negru"}'),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-negru'), 'XXL', 'OG-NICU-NEG-XXL', 229.00, 22, '{"size": "XXL", "color": "negru"}'),
  -- Tricou Alb
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-alb'), 'S', 'OG-NICU-ALB-S', 229.00, 22, '{"size": "S", "color": "alb"}'),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-alb'), 'M', 'OG-NICU-ALB-M', 229.00, 22, '{"size": "M", "color": "alb"}'),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-alb'), 'L', 'OG-NICU-ALB-L', 229.00, 23, '{"size": "L", "color": "alb"}'),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-alb'), 'XXL', 'OG-NICU-ALB-XXL', 229.00, 22, '{"size": "XXL", "color": "alb"}');

-- Product Translations
INSERT INTO product_translations (product_id, locale, name, description) VALUES
  -- Tricou Negru
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-negru'), 'ro', 'Tricou "OG Nicu" - Negru', 'Tricouri editie limitata, doar 89 de bucati vor exista pana la sfarsitul universului. Fit regular/gangsta, materialul e bumbac ultra premium, printul e realizat prin serigrafie ecologica.'),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-negru'), 'en', '"OG Nicu" T-Shirt - Black', 'Limited edition t-shirts, only 89 pieces will exist until the end of the universe. Regular/gangsta fit, ultra premium cotton material, print made through ecological serigraphy.'),
  -- Tricou Alb
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-alb'), 'ro', 'Tricou "OG Nicu" - Alb', 'Tricouri editie limitata, doar 89 de bucati vor exista pana la sfarsitul universului. Fit regular/gangsta, materialul e bumbac ultra premium, printul e realizat prin serigrafie ecologica.'),
  ((SELECT id FROM products WHERE slug = 'tricou-og-nicu-alb'), 'en', '"OG Nicu" T-Shirt - White', 'Limited edition t-shirts, only 89 pieces will exist until the end of the universe. Regular/gangsta fit, ultra premium cotton material, print made through ecological serigraphy.');