"use server"

import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/actions/auth"
import { revalidatePath } from "next/cache"

export interface AdminProduct {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  is_active: boolean
  stock_quantity: number
  sku: string | null
  weight: number | null
  category_id: string | null
  created_at: string
  category: { id: string; name: string; slug: string } | null
  product_variants: {
    id: string
    name: string
    sku: string
    price: number
    stock_quantity: number
    options: Record<string, string>
  }[]
  product_images: {
    id: string
    url: string
    alt_text: string | null
    sort_order: number
  }[]
  product_translations: {
    id: string
    locale: string
    name: string
    description: string | null
  }[]
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const admin = await getAdminUser()
  if (!admin) return []

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      product_variants(id, name, sku, price, stock_quantity, options),
      product_images(id, url, alt_text, sort_order),
      product_translations(id, locale, name, description)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching admin products:", error)
    return []
  }

  return data as unknown as AdminProduct[]
}

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  const admin = await getAdminUser()
  if (!admin) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      product_variants(id, name, sku, price, stock_quantity, options),
      product_images(id, url, alt_text, sort_order),
      product_translations(id, locale, name, description)
    `)
    .eq("id", id)
    .single()

  if (error) return null
  return data as unknown as AdminProduct
}

export async function createProduct(data: {
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  category_id?: string
  stock_quantity: number
  sku?: string
  weight?: number
  is_active?: boolean
  translations?: { locale: string; name: string; description?: string }[]
  variants?: { name: string; sku: string; price: number; stock_quantity: number; options: Record<string, string> }[]
  images?: { url: string; alt_text?: string; sort_order?: number }[]
}) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price: data.price,
      compare_at_price: data.compare_at_price || null,
      category_id: data.category_id || null,
      stock_quantity: data.stock_quantity,
      sku: data.sku || null,
      weight: data.weight || null,
      is_active: data.is_active ?? true,
    })
    .select("id")
    .single()

  if (productError || !product) return { error: productError?.message || "Failed to create product" }

  if (data.translations && data.translations.length > 0) {
    await supabase.from("product_translations").insert(
      data.translations.map(t => ({
        product_id: product.id,
        locale: t.locale,
        name: t.name,
        description: t.description || null,
      }))
    )
  }

  if (data.variants && data.variants.length > 0) {
    await supabase.from("product_variants").insert(
      data.variants.map(v => ({
        product_id: product.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
        stock_quantity: v.stock_quantity,
        options: v.options,
      }))
    )
  }

  if (data.images && data.images.length > 0) {
    await supabase.from("product_images").insert(
      data.images.map(img => ({
        product_id: product.id,
        url: img.url,
        alt_text: img.alt_text || null,
        sort_order: img.sort_order ?? 0,
      }))
    )
  }

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true, productId: product.id }
}

export async function updateProduct(id: string, data: {
  name?: string
  slug?: string
  description?: string
  price?: number
  compare_at_price?: number
  category_id?: string
  stock_quantity?: number
  sku?: string
  weight?: number
  is_active?: boolean
}) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase
    .from("products")
    .update(data)
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}`)
  revalidatePath("/products")
  return { success: true }
}

export async function updateProductTranslations(productId: string, translations: {
  locale: string
  name: string
  description?: string
}[]) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  for (const t of translations) {
    const { error } = await supabase
      .from("product_translations")
      .upsert({
        product_id: productId,
        locale: t.locale,
        name: t.name,
        description: t.description || null,
      }, { onConflict: "product_id,locale" })

    if (error) return { error: error.message }
  }

  revalidatePath(`/admin/products/${productId}`)
  return { success: true }
}

export async function updateProductVariants(productId: string, variants: {
  id?: string
  name: string
  sku: string
  price: number
  stock_quantity: number
  options: Record<string, string>
}[]) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  await supabase.from("product_variants").delete().eq("product_id", productId)

  if (variants.length > 0) {
    const { error } = await supabase.from("product_variants").insert(
      variants.map(v => ({
        product_id: productId,
        name: v.name,
        sku: v.sku,
        price: v.price,
        stock_quantity: v.stock_quantity,
        options: v.options,
      }))
    )
    if (error) return { error: error.message }
  }

  revalidatePath(`/admin/products/${productId}`)
  return { success: true }
}

export async function deleteProduct(id: string) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true }
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true }
}
