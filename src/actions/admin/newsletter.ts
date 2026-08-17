"use server"

import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/actions/auth"
import { revalidatePath } from "next/cache"

export interface NewsletterSubscriber {
  id: string
  email: string
  is_active: boolean
  created_at: string
  user_id: string | null
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const admin = await getAdminUser()
  if (!admin) return []

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, is_active, created_at, user_id")
    .order("created_at", { ascending: false })

  if (error) return []
  return data as NewsletterSubscriber[]
}

export async function toggleSubscriberActive(id: string, isActive: boolean) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ is_active: isActive })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/newsletter")
  return { success: true }
}

export async function deleteSubscriber(id: string) {
  const admin = await getAdminUser()
  if (!admin) return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/newsletter")
  return { success: true }
}
