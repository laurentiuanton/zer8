import LoginPageClient from "./LoginPageClient"

interface LoginPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string; error?: string; registered?: string }>
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params
  const { redirect, error, registered } = await searchParams
  const validLocale = locale === "en" ? "en" : "ro"

  return (
    <LoginPageClient
      locale={validLocale as "ro" | "en"}
      redirectTo={redirect}
      error={error}
      registered={registered === "true"}
    />
  )
}
