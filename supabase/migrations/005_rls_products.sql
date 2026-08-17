-- Enable RLS on product tables and allow public read access
-- This fixes the issue where products don't show on the live site

-- Categories - public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Products - public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

-- Product Images - public read
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  USING (true);

-- Product Variants - public read
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product variants are viewable by everyone"
  ON product_variants FOR SELECT
  USING (true);

-- Product Translations - public read
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product translations are viewable by everyone"
  ON product_translations FOR SELECT
  USING (true);
