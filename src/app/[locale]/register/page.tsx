import RegisterPageClient from "./RegisterPageClient"

interface RegisterPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const { locale } = await params
  const { error } = await searchParams
  const validLocale = locale === "en" ? "en" : "ro"

  return <RegisterPageClient locale={validLocale as "ro" | "en"} error={error} />
}
