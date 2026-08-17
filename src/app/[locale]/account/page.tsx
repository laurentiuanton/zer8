import { getUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import AccountPageClient from "./AccountPageClient"

interface AccountPageProps {
  params: Promise<{ locale: string }>
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params
  const validLocale = locale === "en" ? "en" : "ro"
  const user = await getUser()

  if (!user) {
    redirect(`/${validLocale}/login`)
  }

  return <AccountPageClient locale={validLocale as "ro" | "en"} user={user} />
}
