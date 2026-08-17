"use server"

import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/actions/auth"
import { revalidatePath } from "next/cache"

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const admin = await getAdminUser()
  if (!admin) return []

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) return []
  return data as AdminCategory[]
}

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  parent_id?: string
  sort_order?: number
  image_url?: string
}) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase.from("categories").insert({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    parent_id: data.parent_id || null,
    sort_order: data.sort_order ?? 0,
    image_url: data.image_url || null,
  })

  if (error) return { error: error.message }

  revalidatePath("/admin/categories")
  return { success: true }
}

export async function updateCategory(id: string, data: {
  name?: string
  slug?: string
  description?: string
  parent_id?: string | null
  sort_order?: number
  image_url?: string | null
}) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase.from("categories").update(data).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/categories")
  return { success: true }
}

export async function deleteCategory(id: string) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/categories")
  return { success: true }
}
