import LoginPageClient from "./LoginPageClient"

interface LoginPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params
  const { redirect } = await searchParams
  const validLocale = locale === "en" ? "en" : "ro"

  return <LoginPageClient locale={validLocale as "ro" | "en"} redirectTo={redirect} />
}