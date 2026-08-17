"use server"

import { createClient } from "@/lib/supabase/server"

export interface ProductWithRelations {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  is_active: boolean
  stock_quantity: number
  sku: string | null
  category: { id: string; name: string; slug: string } | null
  product_variants: {
    id: string
    name: string
    price: number
    stock_quantity: number
    options: { size: string; color: string }
  }[]
  product_images: {
    id: string
    url: string
    alt_text: string | null
    sort_order: number
  }[]
  product_translations: {
    name: string
    description: string | null
    locale: string
  }[]
}

export async function getProducts(): Promise<ProductWithRelations[]> {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      product_variants(id, name, price, stock_quantity, options),
      product_images(id, url, alt_text, sort_order),
      product_translations(name, description, locale)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return products as unknown as ProductWithRelations[]
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      product_variants(id, name, price, stock_quantity, options),
      product_images(id, url, alt_text, sort_order),
      product_translations(name, description, locale)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return product as unknown as ProductWithRelations
}

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}
