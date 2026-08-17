-- Migration 008: Admin roles, is_admin() function, and admin RLS policies

-- 1. Add role column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- 2. Create is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Set 1laurentiuanton@gmail.com as admin
UPDATE public.profiles SET role = 'admin' WHERE email = '1laurentiuanton@gmail.com';

-- 4. Admin RLS policies — full CRUD for admins on all tables

-- profiles: admins can read all, update roles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- categories: admins full CRUD
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (public.is_admin());

-- products: admins full CRUD
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.is_admin());

-- Also allow admins to read inactive products
CREATE POLICY "Admins can view all products including inactive" ON public.products
  FOR SELECT USING (public.is_admin());

-- product_variants: admins full CRUD
CREATE POLICY "Admins can insert variants" ON public.product_variants
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update variants" ON public.product_variants
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete variants" ON public.product_variants
  FOR DELETE USING (public.is_admin());

-- product_images: admins full CRUD
CREATE POLICY "Admins can insert product images" ON public.product_images
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update product images" ON public.product_images
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete product images" ON public.product_images
  FOR DELETE USING (public.is_admin());

-- product_translations: admins full CRUD
CREATE POLICY "Admins can insert translations" ON public.product_translations
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update translations" ON public.product_translations
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete translations" ON public.product_translations
  FOR DELETE USING (public.is_admin());

-- orders: admins can read all, update status
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- order_items: admins can read all
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (public.is_admin());

-- newsletter_subscribers: admins full CRUD
CREATE POLICY "Admins can view all subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update subscribers" ON public.newsletter_subscribers
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers
  FOR DELETE USING (public.is_admin());

-- reviews: admins can read all and delete
CREATE POLICY "Admins can view all reviews" ON public.reviews
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can delete reviews" ON public.reviews
  FOR DELETE USING (public.is_admin());

-- addresses: admins can read all
CREATE POLICY "Admins can view all addresses" ON public.addresses
  FOR SELECT USING (public.is_admin());

-- cart_items: admins can read all
CREATE POLICY "Admins can view all cart items" ON public.cart_items
  FOR SELECT USING (public.is_admin());
