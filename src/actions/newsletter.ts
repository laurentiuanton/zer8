"use server"

import { createClient } from "@/lib/supabase/server"

export async function subscribeNewsletter(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("newsletter_subscribers").upsert(
    { email, is_active: true },
    { onConflict: "email" }
  )

  if (error) {
    console.error("Newsletter subscribe error:", error)
    return { error: error.message }
  }

  return { success: true }
}
