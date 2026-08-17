"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export interface AuthUser {
  id: string
  email: string | undefined
}

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
  }
}

export async function signUp(formData: {
  email: string
  password: string
  fullName: string
  locale: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect(`/${formData.locale}`)
}

export async function signIn(formData: {
  email: string
  password: string
  locale: string
  redirectTo?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: error.message }
  }

  const redirectTo = formData.redirectTo || `/${formData.locale}`
  redirect(redirectTo)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
