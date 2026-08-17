"use server"

import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/actions/auth"

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  recentOrders: {
    id: string
    status: string
    total: number
    currency: string
    created_at: string
    profiles: { email: string; full_name: string | null } | null
  }[]
  revenueByMonth: { month: string; revenue: number }[]
  topProducts: { name: string; totalSold: number; revenue: number }[]
  ordersByStatus: { status: string; count: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const admin = await getAdminUser()
  if (!admin) return null

  const supabase = await createClient()

  const { data: orders } = await supabase.from("orders").select("id, status, total, currency, created_at, user_id")
  const { data: products } = await supabase.from("products").select("id, name, stock_quantity")
  const { data: customers } = await supabase.from("profiles").select("id")
  const { data: orderItems } = await supabase.from("order_items").select("order_id, product_name, quantity, price, total")

  const totalRevenue = orders?.filter(o => o.status !== "cancelled" && o.status !== "refunded").reduce((sum, o) => sum + o.total, 0) ?? 0
  const totalOrders = orders?.length ?? 0
  const totalProducts = products?.length ?? 0
  const totalCustomers = customers?.length ?? 0

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, status, total, currency, created_at, profiles(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const now = new Date()
  const revenueByMonth: { month: string; revenue: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = d.toLocaleString("en", { month: "short" })
    const year = d.getFullYear()
    const month = d.getMonth()
    const revenue = orders
      ?.filter(o => {
        const od = new Date(o.created_at)
        return od.getFullYear() === year && od.getMonth() === month && o.status !== "cancelled" && o.status !== "refunded"
      })
      .reduce((sum, o) => sum + o.total, 0) ?? 0
    revenueByMonth.push({ month: monthStr, revenue })
  }

  const productSales: Record<string, { name: string; totalSold: number; revenue: number }> = {}
  orderItems?.forEach(item => {
    const key = item.product_name
    if (!productSales[key]) productSales[key] = { name: key, totalSold: 0, revenue: 0 }
    productSales[key].totalSold += item.quantity
    productSales[key].revenue += item.total
  })
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  const statusCounts: Record<string, number> = {}
  orders?.forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
  })
  const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }))

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders: ((recentOrders ?? []) as unknown as DashboardStats["recentOrders"]),
    revenueByMonth,
    topProducts,
    ordersByStatus,
  }
}
