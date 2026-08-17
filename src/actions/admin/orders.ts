"use server"

import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/actions/auth"
import { revalidatePath } from "next/cache"

export interface AdminOrder {
  id: string
  status: string
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  currency: string
  shipping_address: Record<string, string> | null
  payment_method: string | null
  notes: string | null
  created_at: string
  updated_at: string
  profiles: { email: string; full_name: string | null; phone: string | null } | null
  order_items: {
    id: string
    product_name: string
    variant_name: string | null
    quantity: number
    price: number
    total: number
  }[]
}

export async function getAdminOrders(filters?: {
  status?: string
  search?: string
}): Promise<AdminOrder[]> {
  const admin = await getAdminUser()
  if (!admin) return []

  const supabase = await createClient()

  let query = supabase
    .from("orders")
    .select(`
      *,
      profiles(email, full_name, phone),
      order_items(id, product_name, variant_name, quantity, price, total)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) return []

  let orders = data as unknown as AdminOrder[]

  if (filters?.search) {
    const s = filters.search.toLowerCase()
    orders = orders.filter(o =>
      o.id.slice(0, 8).toLowerCase().includes(s) ||
      o.profiles?.email?.toLowerCase().includes(s) ||
      o.profiles?.full_name?.toLowerCase().includes(s)
    )
  }

  return orders
}

export async function getAdminOrderById(id: string): Promise<AdminOrder | null> {
  const admin = await getAdminUser()
  if (!admin) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles(email, full_name, phone),
      order_items(id, product_name, variant_name, quantity, price, total)
    `)
    .eq("id", id)
    .single()

  if (error) return null
  return data as unknown as AdminOrder
}

export async function updateOrderStatus(id: string, status: string) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase.from("orders").update({ status }).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${id}`)
  return { success: true }
}
