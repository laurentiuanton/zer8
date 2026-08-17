"use server"

import { createClient } from "@/lib/supabase/server"

export async function validateCartItem(productId: string, variantId: string | null, quantity: number) {
  const supabase = await createClient()

  if (variantId) {
    const { data: variant, error } = await supabase
      .from("product_variants")
      .select("id, stock_quantity, price")
      .eq("id", variantId)
      .single()

    if (error || !variant) {
      return { valid: false, error: "Variant not found" }
    }

    if (variant.stock_quantity < quantity) {
      return { valid: false, error: "Insufficient stock" }
    }

    return { valid: true, price: variant.price, stock: variant.stock_quantity }
  }

  const { data: product, error } = await supabase
    .from("products")
    .select("id, stock_quantity, price")
    .eq("id", productId)
    .single()

  if (error || !product) {
    return { valid: false, error: "Product not found" }
  }

  if (product.stock_quantity < quantity) {
    return { valid: false, error: "Insufficient stock" }
  }

  return { valid: true, price: product.price, stock: product.stock_quantity }
}
