"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CookieConsent } from "@/components/marketing/CookieConsent"
import type { AuthUser } from "@/actions/auth"

interface Props {
  locale: "ro" | "en"
  user: AuthUser | null
}

export function SiteLayout({ locale, user, children }: Props & { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.includes("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} user={user} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
      <CookieConsent locale={locale} />
    </div>
  )
}
