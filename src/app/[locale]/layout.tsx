import type { Metadata } from "next"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getUser } from "@/actions/auth"

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
    <div className="flex min-h-screen flex-col">
      <Header locale={validLocale as "ro" | "en"} user={user} />
      <main className="flex-1">{children}</main>
      <Footer locale={validLocale as "ro" | "en"} />
    </div>
  )
}
