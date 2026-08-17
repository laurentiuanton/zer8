"use server"

import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/actions/auth"

export interface AdminCustomer {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: string
  created_at: string
  orders: { id: string; total: number; status: string; created_at: string }[]
  totalSpent: number
  orderCount: number
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const admin = await getAdminUser()
  if (!admin) return []

  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, avatar_url, role, created_at")
    .order("created_at", { ascending: false })

  if (error) return []

  const customersWithOrders = await Promise.all(
    (profiles ?? []).map(async (p) => {
      const { data: orders } = await supabase
        .from("orders")
        .select("id, total, status, created_at")
        .eq("user_id", p.id)
        .order("created_at", { ascending: false })

      const orderList = orders ?? []
      const totalSpent = orderList
        .filter(o => o.status !== "cancelled" && o.status !== "refunded")
        .reduce((sum, o) => sum + o.total, 0)

      return {
        ...p,
        orders: orderList,
        totalSpent,
        orderCount: orderList.length,
      }
    })
  )

  return customersWithOrders as AdminCustomer[]
}

export async function getAdminCustomerById(id: string): Promise<AdminCustomer | null> {
  const admin = await getAdminUser()
  if (!admin) return null

  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, avatar_url, role, created_at")
    .eq("id", id)
    .single()

  if (error || !profile) return null

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false })

  const orderList = orders ?? []
  const totalSpent = orderList
    .filter(o => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((sum, o) => sum + o.total, 0)

  return {
    ...profile,
    orders: orderList,
    totalSpent,
    orderCount: orderList.length,
  } as AdminCustomer
}
