import type { Metadata } from "next"
import { getUser } from "@/actions/auth"
import { SiteLayout } from "@/components/layout/SiteLayout"

export const metadata: Metadata = {
  title: "ZER8 - Magazin Oficial",
  description:
    "Tricouri editie limitata cu design unic. Material premium, print serigrafie ecologica. Doar 89 de bucati.",
}

export function generateStaticParams() {
  return [{ locale: "ro" }, { locale: "en" }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = locale === "en" ? "en" : "ro"
  const user = await getUser()

  return (
    <SiteLayout locale={validLocale as "ro" | "en"} user={user}>
      {children}
    </SiteLayout>
  )
}
