"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export interface AuthUser {
  id: string
  email: string | undefined
  role: string | null
}

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (error) {
    return {
      id: user.id,
      email: user.email,
      role: "customer",
    }
  }

  return {
    id: user.id,
    email: user.email,
    role: profile?.role ?? "customer",
  }
}

export async function getAdminUser(): Promise<AuthUser | null> {
  const user = await getUser()
  if (!user || user.role !== "admin") return null
  return user
}

export async function signInWithGoogle(locale: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `https://zer8.vercel.app/auth/callback?locale=${locale}`,
    },
  })

  if (error) {
    redirect(`/${locale}/login?error=google_failed`)
  }

  redirect(data.url)
}

export async function signInWithEmail(formData: {
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
    redirect(`/${formData.locale}/login?error=invalid_credentials`)
  }

  const redirectTo = formData.redirectTo || `/${formData.locale}`
  redirect(redirectTo)
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
      emailRedirectTo: `https://zer8.vercel.app/auth/callback?locale=${formData.locale}`,
    },
  })

  if (error) {
    redirect(`/${formData.locale}/register?error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/${formData.locale}/login?registered=true`)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
